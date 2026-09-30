// service-worker-template.js
import { initializeWasm } from "https://gaios.sgai.uk/packages/@automerge/automerge/slim.js";
import initSubductionWasm from "https://gaios.sgai.uk/packages/@automerge/automerge-subduction/slim.js";
import {
  Repo,
  isValidAutomergeUrl,
  parseAutomergeUrl,
  stringifyAutomergeUrl
} from "https://gaios.sgai.uk/packages/@automerge/automerge-repo/slim.js";
import {
  findHandleInFolderHandle,
  resolvePackageExport
} from "https://gaios.sgai.uk/packages/@inkandswitch/patchwork-filesystem.js";
import { IndexedDBStorageAdapter } from "https://gaios.sgai.uk/packages/@automerge/automerge-repo-storage-indexeddb.js";
import { WebSocketClientAdapter } from "https://gaios.sgai.uk/packages/@automerge/automerge-repo-network-websocket.js";
import { MessageChannelNetworkAdapter } from "https://gaios.sgai.uk/packages/@automerge/automerge-repo-network-messagechannel.js";
var cachename = "automerge-docs-v2";
var debugging = false;
var cacheableStatuses = [
  200,
  203,
  204,
  206,
  300,
  301,
  404,
  405,
  410,
  414,
  501
];
function log(...args) {
  if (!debugging) return;
  console.log.call(
    console,
    `%cpatchwork:serviceworker%c
`,
    `color: #00ffcc; font-weight: bold`,
    "color: inherit",
    ...args
  );
}
self.addEventListener("install", () => self.skipWaiting());
async function clearOldCaches() {
  const cacheWhitelist = [cachename];
  const cacheNames = await caches.keys();
  const deletePromises = cacheNames.map((cacheName) => {
    if (!cacheWhitelist.includes(cacheName)) {
      return caches.delete(cacheName);
    }
  });
  await Promise.all(deletePromises);
}
self.addEventListener("activate", async () => {
  await clearOldCaches();
  clients.claim();
});
var repoPromise = null;
function getRepo() {
  if (!repoPromise) {
    repoPromise = (async () => {
      const [wasmResponse, subductionResponse] = await Promise.all([
        fetch("https://gaios.sgai.uk/automerge.wasm"),
        fetch("https://gaios.sgai.uk/subduction.wasm")
      ]);
      await initSubductionWasm({
        module_or_path: new Uint8Array(await subductionResponse.arrayBuffer())
      });
      await initializeWasm(new Uint8Array(await wasmResponse.arrayBuffer()));
      const repo = new Repo({
        storage: new IndexedDBStorageAdapter(),
        network: [new WebSocketClientAdapter("wss://sync3.automerge.org")],
        peerId: "service-worker-" + (Math.random() * 1e4).toString(36).slice(2),
        async sharePolicy(peerId) {
          return peerId.includes("storage-server");
        },
        enableRemoteHeadsGossiping: true
      });
      self.repo = repo;
      console.log(
        "[service worker] repo initialized, waiting for network subsystem to be ready"
      );
      await repo.networkSubsystem.whenReady();
      console.log("[service worker] repo network subsystem ready");
      return repo;
    })();
  }
  return repoPromise;
}
async function connectPort(port) {
  const repo = await getRepo();
  repo.networkSubsystem.addNetworkAdapter(
    new MessageChannelNetworkAdapter(port, { useWeakRef: true })
  );
}
self.addEventListener("message", async (event) => {
  if (event.data.type == "port") {
    log("received messagechannel");
    const [port] = event.ports;
    connectPort(port);
  } else if (event.data.type == "cachename") {
    const nextCachename = event.data.cachename;
    if (cachename == nextCachename) {
      return;
    }
    console.info(
      `deleting ${cachename} and setting cache name to ${nextCachename}`
    );
    caches.delete(cachename);
    cachename = nextCachename;
  } else if (event.data.type == "debug") {
    debugging = event.data.debug;
    log("serviceworker debugging enabled");
  }
});
async function resolveAutomergeUrl(automergeURL) {
  const repo = await getRepo();
  const href = automergeURL.href;
  const [maybeAutomergeUrl, ...path] = href.split("/");
  if (!isValidAutomergeUrl(maybeAutomergeUrl)) {
    return new Response("invalid automerge url", { status: 400 });
  }
  if (path.length && !path[path.length - 1]) path.pop();
  const { heads, documentId } = parseAutomergeUrl(maybeAutomergeUrl);
  if (!heads) {
    const folder = await repo.find(maybeAutomergeUrl);
    const latestHeads = folder.heads();
    const url = stringifyAutomergeUrl({ documentId, heads: latestHeads });
    let location = `/${encodeURIComponent(url)}`;
    if (path.length) location += `/${path.join("/")}`;
    return new Response(null, {
      status: 307,
      headers: { location }
    });
  }
  const folderHandle = await repo.find(maybeAutomergeUrl);
  let fileHandle;
  if (path.length) {
    fileHandle = await findHandleInFolderHandle(
      repo,
      folderHandle,
      path.map(decodeURIComponent)
    );
    if (!fileHandle) {
      const subpath = "./" + path.map(decodeURIComponent).join("/");
      const pkgFileHandle = await findHandleInFolderHandle(repo, folderHandle, [
        "package.json"
      ]);
      if (pkgFileHandle) {
        const pkgDoc = pkgFileHandle.doc();
        if (pkgDoc?.content) {
          const pkgJson = JSON.parse(String(pkgDoc.content));
          try {
            const resolved = resolvePackageExport(pkgJson, subpath);
            if (resolved) {
              const resolvedPath = resolved.replace(/^\.\//, "").split("/");
              fileHandle = await findHandleInFolderHandle(
                repo,
                folderHandle,
                resolvedPath
              );
            }
          } catch {
          }
        }
      }
    }
  } else {
    const pkgFileHandle = await findHandleInFolderHandle(repo, folderHandle, [
      "package.json"
    ]);
    if (pkgFileHandle) {
      const pkgDoc = pkgFileHandle.doc();
      if (pkgDoc?.content) {
        const pkgJson = JSON.parse(String(pkgDoc.content));
        try {
          const resolved = resolvePackageExport(pkgJson);
          if (resolved) {
            const resolvedPath = resolved.replace(/^\.\//, "").split("/");
            fileHandle = await findHandleInFolderHandle(
              repo,
              folderHandle,
              resolvedPath
            );
          }
        } catch {
        }
      }
    }
  }
  if (!fileHandle) {
    throw new Error(
      `couldn't resolve ${path.join("/")} in folder at ${maybeAutomergeUrl}`
    );
  }
  const fileDoc = fileHandle.doc();
  const content = fileDoc?.content;
  if (!content) {
    throw new Error(`file at ${href} has no content`);
  }
  let body = content instanceof Uint8Array ? new Uint8Array(content) : String(content);
  const mimeType = fileDoc.mimeType ?? "text/plain";
  const headers = new Headers({ "content-type": mimeType });
  headers.set("cross-origin-embedder-policy", "credentialless");
  headers.set("cross-origin-resource-policy", "cross-origin");
  return new Response(body, { status: 200, headers });
}
self.addEventListener("fetch", (fetchEvent) => {
  log("fetch event", fetchEvent.request.url);
  const request = fetchEvent.request;
  if (request.method !== "GET") return;
  const url = new URL(fetchEvent.request.url);
  let specialURL;
  if (url.hostname == self.location.hostname && url.port == self.location.port && url.protocol == self.location.protocol) {
    try {
      specialURL = new URL(decodeURIComponent(url.pathname.slice(1)));
      log(`received special request ${specialURL}`);
    } catch {
    }
  }
  if (!specialURL) return;
  fetchEvent.respondWith(
    (async () => {
      const cache = await caches.open(cachename);
      const match = await cache.match(request);
      try {
        if (match) {
          log(`serving ${specialURL} from cache ${cachename}`);
          const headers = new Headers(match.headers);
          headers.set("cross-origin-embedder-policy", "credentialless");
          headers.set("cross-origin-resource-policy", "cross-origin");
          return new Response(match.body, {
            status: match.status,
            headers
          });
        }
        const response = await resolveAutomergeUrl(specialURL);
        if (response.status === 307) {
          return response;
        }
        if (cacheableStatuses.includes(response.status)) {
          log(`caching ${specialURL}`);
          await cache.put(request, response.clone());
        }
        return response;
      } catch (error) {
        const message = error instanceof Error ? `${error.message}

${error.stack}` : String(error);
        console.error(
          `service worker error resolving ${request.url} (for: ${specialURL}).
${message}`
        );
        if (match) return match;
        return new Response(message, {
          status: 500,
          headers: { "content-type": "text/plain" }
        });
      }
    })()
  );
});
