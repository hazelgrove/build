var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __commonJS = (cb, mod) => function __require() {
  return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));

// ../../../node_modules/ms/index.js
var require_ms = __commonJS({
  "../../../node_modules/ms/index.js"(exports, module) {
    var s = 1e3;
    var m = s * 60;
    var h = m * 60;
    var d = h * 24;
    var w = d * 7;
    var y = d * 365.25;
    module.exports = function(val, options) {
      options = options || {};
      var type = typeof val;
      if (type === "string" && val.length > 0) {
        return parse(val);
      } else if (type === "number" && isFinite(val)) {
        return options.long ? fmtLong(val) : fmtShort(val);
      }
      throw new Error(
        "val is not a non-empty string or a valid number. val=" + JSON.stringify(val)
      );
    };
    function parse(str) {
      str = String(str);
      if (str.length > 100) {
        return;
      }
      var match = /^(-?(?:\d+)?\.?\d+) *(milliseconds?|msecs?|ms|seconds?|secs?|s|minutes?|mins?|m|hours?|hrs?|h|days?|d|weeks?|w|years?|yrs?|y)?$/i.exec(
        str
      );
      if (!match) {
        return;
      }
      var n = parseFloat(match[1]);
      var type = (match[2] || "ms").toLowerCase();
      switch (type) {
        case "years":
        case "year":
        case "yrs":
        case "yr":
        case "y":
          return n * y;
        case "weeks":
        case "week":
        case "w":
          return n * w;
        case "days":
        case "day":
        case "d":
          return n * d;
        case "hours":
        case "hour":
        case "hrs":
        case "hr":
        case "h":
          return n * h;
        case "minutes":
        case "minute":
        case "mins":
        case "min":
        case "m":
          return n * m;
        case "seconds":
        case "second":
        case "secs":
        case "sec":
        case "s":
          return n * s;
        case "milliseconds":
        case "millisecond":
        case "msecs":
        case "msec":
        case "ms":
          return n;
        default:
          return void 0;
      }
    }
    function fmtShort(ms) {
      var msAbs = Math.abs(ms);
      if (msAbs >= d) {
        return Math.round(ms / d) + "d";
      }
      if (msAbs >= h) {
        return Math.round(ms / h) + "h";
      }
      if (msAbs >= m) {
        return Math.round(ms / m) + "m";
      }
      if (msAbs >= s) {
        return Math.round(ms / s) + "s";
      }
      return ms + "ms";
    }
    function fmtLong(ms) {
      var msAbs = Math.abs(ms);
      if (msAbs >= d) {
        return plural(ms, msAbs, d, "day");
      }
      if (msAbs >= h) {
        return plural(ms, msAbs, h, "hour");
      }
      if (msAbs >= m) {
        return plural(ms, msAbs, m, "minute");
      }
      if (msAbs >= s) {
        return plural(ms, msAbs, s, "second");
      }
      return ms + " ms";
    }
    function plural(ms, msAbs, n, name) {
      var isPlural = msAbs >= n * 1.5;
      return Math.round(ms / n) + " " + name + (isPlural ? "s" : "");
    }
  }
});

// ../../../node_modules/debug/src/common.js
var require_common = __commonJS({
  "../../../node_modules/debug/src/common.js"(exports, module) {
    function setup(env) {
      createDebug.debug = createDebug;
      createDebug.default = createDebug;
      createDebug.coerce = coerce;
      createDebug.disable = disable;
      createDebug.enable = enable;
      createDebug.enabled = enabled;
      createDebug.humanize = require_ms();
      createDebug.destroy = destroy;
      Object.keys(env).forEach((key) => {
        createDebug[key] = env[key];
      });
      createDebug.names = [];
      createDebug.skips = [];
      createDebug.formatters = {};
      function selectColor(namespace) {
        let hash = 0;
        for (let i = 0; i < namespace.length; i++) {
          hash = (hash << 5) - hash + namespace.charCodeAt(i);
          hash |= 0;
        }
        return createDebug.colors[Math.abs(hash) % createDebug.colors.length];
      }
      createDebug.selectColor = selectColor;
      function createDebug(namespace) {
        let prevTime;
        let enableOverride = null;
        let namespacesCache;
        let enabledCache;
        function debug4(...args) {
          if (!debug4.enabled) {
            return;
          }
          const self2 = debug4;
          const curr = Number(/* @__PURE__ */ new Date());
          const ms = curr - (prevTime || curr);
          self2.diff = ms;
          self2.prev = prevTime;
          self2.curr = curr;
          prevTime = curr;
          args[0] = createDebug.coerce(args[0]);
          if (typeof args[0] !== "string") {
            args.unshift("%O");
          }
          let index = 0;
          args[0] = args[0].replace(/%([a-zA-Z%])/g, (match, format) => {
            if (match === "%%") {
              return "%";
            }
            index++;
            const formatter = createDebug.formatters[format];
            if (typeof formatter === "function") {
              const val = args[index];
              match = formatter.call(self2, val);
              args.splice(index, 1);
              index--;
            }
            return match;
          });
          createDebug.formatArgs.call(self2, args);
          const logFn = self2.log || createDebug.log;
          logFn.apply(self2, args);
        }
        debug4.namespace = namespace;
        debug4.useColors = createDebug.useColors();
        debug4.color = createDebug.selectColor(namespace);
        debug4.extend = extend;
        debug4.destroy = createDebug.destroy;
        Object.defineProperty(debug4, "enabled", {
          enumerable: true,
          configurable: false,
          get: () => {
            if (enableOverride !== null) {
              return enableOverride;
            }
            if (namespacesCache !== createDebug.namespaces) {
              namespacesCache = createDebug.namespaces;
              enabledCache = createDebug.enabled(namespace);
            }
            return enabledCache;
          },
          set: (v) => {
            enableOverride = v;
          }
        });
        if (typeof createDebug.init === "function") {
          createDebug.init(debug4);
        }
        return debug4;
      }
      function extend(namespace, delimiter) {
        const newDebug = createDebug(this.namespace + (typeof delimiter === "undefined" ? ":" : delimiter) + namespace);
        newDebug.log = this.log;
        return newDebug;
      }
      function enable(namespaces) {
        createDebug.save(namespaces);
        createDebug.namespaces = namespaces;
        createDebug.names = [];
        createDebug.skips = [];
        const split = (typeof namespaces === "string" ? namespaces : "").trim().replace(/\s+/g, ",").split(",").filter(Boolean);
        for (const ns of split) {
          if (ns[0] === "-") {
            createDebug.skips.push(ns.slice(1));
          } else {
            createDebug.names.push(ns);
          }
        }
      }
      function matchesTemplate(search, template) {
        let searchIndex = 0;
        let templateIndex = 0;
        let starIndex = -1;
        let matchIndex = 0;
        while (searchIndex < search.length) {
          if (templateIndex < template.length && (template[templateIndex] === search[searchIndex] || template[templateIndex] === "*")) {
            if (template[templateIndex] === "*") {
              starIndex = templateIndex;
              matchIndex = searchIndex;
              templateIndex++;
            } else {
              searchIndex++;
              templateIndex++;
            }
          } else if (starIndex !== -1) {
            templateIndex = starIndex + 1;
            matchIndex++;
            searchIndex = matchIndex;
          } else {
            return false;
          }
        }
        while (templateIndex < template.length && template[templateIndex] === "*") {
          templateIndex++;
        }
        return templateIndex === template.length;
      }
      function disable() {
        const namespaces = [
          ...createDebug.names,
          ...createDebug.skips.map((namespace) => "-" + namespace)
        ].join(",");
        createDebug.enable("");
        return namespaces;
      }
      function enabled(name) {
        for (const skip of createDebug.skips) {
          if (matchesTemplate(name, skip)) {
            return false;
          }
        }
        for (const ns of createDebug.names) {
          if (matchesTemplate(name, ns)) {
            return true;
          }
        }
        return false;
      }
      function coerce(val) {
        if (val instanceof Error) {
          return val.stack || val.message;
        }
        return val;
      }
      function destroy() {
        console.warn("Instance method `debug.destroy()` is deprecated and no longer does anything. It will be removed in the next major version of `debug`.");
      }
      createDebug.enable(createDebug.load());
      return createDebug;
    }
    module.exports = setup;
  }
});

// ../../../node_modules/debug/src/browser.js
var require_browser = __commonJS({
  "../../../node_modules/debug/src/browser.js"(exports, module) {
    exports.formatArgs = formatArgs;
    exports.save = save;
    exports.load = load;
    exports.useColors = useColors;
    exports.storage = localstorage();
    exports.destroy = /* @__PURE__ */ (() => {
      let warned = false;
      return () => {
        if (!warned) {
          warned = true;
          console.warn("Instance method `debug.destroy()` is deprecated and no longer does anything. It will be removed in the next major version of `debug`.");
        }
      };
    })();
    exports.colors = [
      "#0000CC",
      "#0000FF",
      "#0033CC",
      "#0033FF",
      "#0066CC",
      "#0066FF",
      "#0099CC",
      "#0099FF",
      "#00CC00",
      "#00CC33",
      "#00CC66",
      "#00CC99",
      "#00CCCC",
      "#00CCFF",
      "#3300CC",
      "#3300FF",
      "#3333CC",
      "#3333FF",
      "#3366CC",
      "#3366FF",
      "#3399CC",
      "#3399FF",
      "#33CC00",
      "#33CC33",
      "#33CC66",
      "#33CC99",
      "#33CCCC",
      "#33CCFF",
      "#6600CC",
      "#6600FF",
      "#6633CC",
      "#6633FF",
      "#66CC00",
      "#66CC33",
      "#9900CC",
      "#9900FF",
      "#9933CC",
      "#9933FF",
      "#99CC00",
      "#99CC33",
      "#CC0000",
      "#CC0033",
      "#CC0066",
      "#CC0099",
      "#CC00CC",
      "#CC00FF",
      "#CC3300",
      "#CC3333",
      "#CC3366",
      "#CC3399",
      "#CC33CC",
      "#CC33FF",
      "#CC6600",
      "#CC6633",
      "#CC9900",
      "#CC9933",
      "#CCCC00",
      "#CCCC33",
      "#FF0000",
      "#FF0033",
      "#FF0066",
      "#FF0099",
      "#FF00CC",
      "#FF00FF",
      "#FF3300",
      "#FF3333",
      "#FF3366",
      "#FF3399",
      "#FF33CC",
      "#FF33FF",
      "#FF6600",
      "#FF6633",
      "#FF9900",
      "#FF9933",
      "#FFCC00",
      "#FFCC33"
    ];
    function useColors() {
      if (typeof window !== "undefined" && window.process && (window.process.type === "renderer" || window.process.__nwjs)) {
        return true;
      }
      if (typeof navigator !== "undefined" && navigator.userAgent && navigator.userAgent.toLowerCase().match(/(edge|trident)\/(\d+)/)) {
        return false;
      }
      let m;
      return typeof document !== "undefined" && document.documentElement && document.documentElement.style && document.documentElement.style.WebkitAppearance || // Is firebug? http://stackoverflow.com/a/398120/376773
      typeof window !== "undefined" && window.console && (window.console.firebug || window.console.exception && window.console.table) || // Is firefox >= v31?
      // https://developer.mozilla.org/en-US/docs/Tools/Web_Console#Styling_messages
      typeof navigator !== "undefined" && navigator.userAgent && (m = navigator.userAgent.toLowerCase().match(/firefox\/(\d+)/)) && parseInt(m[1], 10) >= 31 || // Double check webkit in userAgent just in case we are in a worker
      typeof navigator !== "undefined" && navigator.userAgent && navigator.userAgent.toLowerCase().match(/applewebkit\/(\d+)/);
    }
    function formatArgs(args) {
      args[0] = (this.useColors ? "%c" : "") + this.namespace + (this.useColors ? " %c" : " ") + args[0] + (this.useColors ? "%c " : " ") + "+" + module.exports.humanize(this.diff);
      if (!this.useColors) {
        return;
      }
      const c = "color: " + this.color;
      args.splice(1, 0, c, "color: inherit");
      let index = 0;
      let lastC = 0;
      args[0].replace(/%[a-zA-Z%]/g, (match) => {
        if (match === "%%") {
          return;
        }
        index++;
        if (match === "%c") {
          lastC = index;
        }
      });
      args.splice(lastC, 0, c);
    }
    exports.log = console.debug || console.log || (() => {
    });
    function save(namespaces) {
      try {
        if (namespaces) {
          exports.storage.setItem("debug", namespaces);
        } else {
          exports.storage.removeItem("debug");
        }
      } catch (error) {
      }
    }
    function load() {
      let r;
      try {
        r = exports.storage.getItem("debug") || exports.storage.getItem("DEBUG");
      } catch (error) {
      }
      if (!r && typeof process !== "undefined" && "env" in process) {
        r = process.env.DEBUG;
      }
      return r;
    }
    function localstorage() {
      try {
        return localStorage;
      } catch (error) {
      }
    }
    module.exports = require_common()(exports);
    var { formatters } = module.exports;
    formatters.j = function(v) {
      try {
        return JSON.stringify(v);
      } catch (error) {
        return "[UnexpectedJSONParseError]: " + error.message;
      }
    };
  }
});

// ../../../node_modules/eventemitter3/index.js
var require_eventemitter3 = __commonJS({
  "../../../node_modules/eventemitter3/index.js"(exports, module) {
    "use strict";
    var has = Object.prototype.hasOwnProperty;
    var prefix = "~";
    function Events() {
    }
    if (Object.create) {
      Events.prototype = /* @__PURE__ */ Object.create(null);
      if (!new Events().__proto__) prefix = false;
    }
    function EE(fn, context, once) {
      this.fn = fn;
      this.context = context;
      this.once = once || false;
    }
    function addListener(emitter, event, fn, context, once) {
      if (typeof fn !== "function") {
        throw new TypeError("The listener must be a function");
      }
      var listener = new EE(fn, context || emitter, once), evt = prefix ? prefix + event : event;
      if (!emitter._events[evt]) emitter._events[evt] = listener, emitter._eventsCount++;
      else if (!emitter._events[evt].fn) emitter._events[evt].push(listener);
      else emitter._events[evt] = [emitter._events[evt], listener];
      return emitter;
    }
    function clearEvent(emitter, evt) {
      if (--emitter._eventsCount === 0) emitter._events = new Events();
      else delete emitter._events[evt];
    }
    function EventEmitter2() {
      this._events = new Events();
      this._eventsCount = 0;
    }
    EventEmitter2.prototype.eventNames = function eventNames() {
      var names = [], events, name;
      if (this._eventsCount === 0) return names;
      for (name in events = this._events) {
        if (has.call(events, name)) names.push(prefix ? name.slice(1) : name);
      }
      if (Object.getOwnPropertySymbols) {
        return names.concat(Object.getOwnPropertySymbols(events));
      }
      return names;
    };
    EventEmitter2.prototype.listeners = function listeners(event) {
      var evt = prefix ? prefix + event : event, handlers = this._events[evt];
      if (!handlers) return [];
      if (handlers.fn) return [handlers.fn];
      for (var i = 0, l = handlers.length, ee = new Array(l); i < l; i++) {
        ee[i] = handlers[i].fn;
      }
      return ee;
    };
    EventEmitter2.prototype.listenerCount = function listenerCount(event) {
      var evt = prefix ? prefix + event : event, listeners = this._events[evt];
      if (!listeners) return 0;
      if (listeners.fn) return 1;
      return listeners.length;
    };
    EventEmitter2.prototype.emit = function emit(event, a1, a2, a3, a4, a5) {
      var evt = prefix ? prefix + event : event;
      if (!this._events[evt]) return false;
      var listeners = this._events[evt], len = arguments.length, args, i;
      if (listeners.fn) {
        if (listeners.once) this.removeListener(event, listeners.fn, void 0, true);
        switch (len) {
          case 1:
            return listeners.fn.call(listeners.context), true;
          case 2:
            return listeners.fn.call(listeners.context, a1), true;
          case 3:
            return listeners.fn.call(listeners.context, a1, a2), true;
          case 4:
            return listeners.fn.call(listeners.context, a1, a2, a3), true;
          case 5:
            return listeners.fn.call(listeners.context, a1, a2, a3, a4), true;
          case 6:
            return listeners.fn.call(listeners.context, a1, a2, a3, a4, a5), true;
        }
        for (i = 1, args = new Array(len - 1); i < len; i++) {
          args[i - 1] = arguments[i];
        }
        listeners.fn.apply(listeners.context, args);
      } else {
        var length = listeners.length, j;
        for (i = 0; i < length; i++) {
          if (listeners[i].once) this.removeListener(event, listeners[i].fn, void 0, true);
          switch (len) {
            case 1:
              listeners[i].fn.call(listeners[i].context);
              break;
            case 2:
              listeners[i].fn.call(listeners[i].context, a1);
              break;
            case 3:
              listeners[i].fn.call(listeners[i].context, a1, a2);
              break;
            case 4:
              listeners[i].fn.call(listeners[i].context, a1, a2, a3);
              break;
            default:
              if (!args) for (j = 1, args = new Array(len - 1); j < len; j++) {
                args[j - 1] = arguments[j];
              }
              listeners[i].fn.apply(listeners[i].context, args);
          }
        }
      }
      return true;
    };
    EventEmitter2.prototype.on = function on(event, fn, context) {
      return addListener(this, event, fn, context, false);
    };
    EventEmitter2.prototype.once = function once(event, fn, context) {
      return addListener(this, event, fn, context, true);
    };
    EventEmitter2.prototype.removeListener = function removeListener(event, fn, context, once) {
      var evt = prefix ? prefix + event : event;
      if (!this._events[evt]) return this;
      if (!fn) {
        clearEvent(this, evt);
        return this;
      }
      var listeners = this._events[evt];
      if (listeners.fn) {
        if (listeners.fn === fn && (!once || listeners.once) && (!context || listeners.context === context)) {
          clearEvent(this, evt);
        }
      } else {
        for (var i = 0, events = [], length = listeners.length; i < length; i++) {
          if (listeners[i].fn !== fn || once && !listeners[i].once || context && listeners[i].context !== context) {
            events.push(listeners[i]);
          }
        }
        if (events.length) this._events[evt] = events.length === 1 ? events[0] : events;
        else clearEvent(this, evt);
      }
      return this;
    };
    EventEmitter2.prototype.removeAllListeners = function removeAllListeners(event) {
      var evt;
      if (event) {
        evt = prefix ? prefix + event : event;
        if (this._events[evt]) clearEvent(this, evt);
      } else {
        this._events = new Events();
        this._eventsCount = 0;
      }
      return this;
    };
    EventEmitter2.prototype.off = EventEmitter2.prototype.removeListener;
    EventEmitter2.prototype.addListener = EventEmitter2.prototype.on;
    EventEmitter2.prefixed = prefix;
    EventEmitter2.EventEmitter = EventEmitter2;
    if ("undefined" !== typeof module) {
      module.exports = EventEmitter2;
    }
  }
});

// service-worker-template.js
import { initializeWasm } from "https://gaios.sgai.uk/packages/@automerge/automerge/slim.js";
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

// ../../../node_modules/@automerge/automerge-repo-storage-indexeddb/dist/index.js
var IndexedDBStorageAdapter = class {
  database;
  store;
  dbPromise;
  /** Create a new {@link IndexedDBStorageAdapter}.
   * @param database - The name of the database to use. Defaults to "automerge".
   * @param store - The name of the object store to use. Defaults to "documents".
   */
  constructor(database = "automerge", store = "documents") {
    this.database = database;
    this.store = store;
    this.dbPromise = this.createDatabasePromise();
  }
  createDatabasePromise() {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.database, 1);
      request.onerror = () => {
        reject(request.error);
      };
      request.onupgradeneeded = (event) => {
        const db = event.target.result;
        db.createObjectStore(this.store);
      };
      request.onsuccess = (event) => {
        const db = event.target.result;
        resolve(db);
      };
    });
  }
  async load(keyArray) {
    const db = await this.dbPromise;
    const transaction = db.transaction(this.store);
    const objectStore = transaction.objectStore(this.store);
    const request = objectStore.get(keyArray);
    return new Promise((resolve, reject) => {
      transaction.onerror = () => {
        reject(request.error);
      };
      request.onsuccess = (event) => {
        const result = event.target.result;
        if (result && typeof result === "object" && "binary" in result) {
          resolve(result.binary);
        } else {
          resolve(void 0);
        }
      };
    });
  }
  async save(keyArray, binary) {
    const db = await this.dbPromise;
    const transaction = db.transaction(this.store, "readwrite");
    const objectStore = transaction.objectStore(this.store);
    objectStore.put({ key: keyArray, binary }, keyArray);
    return new Promise((resolve, reject) => {
      transaction.onerror = () => {
        reject(transaction.error);
      };
      transaction.oncomplete = () => {
        resolve();
      };
    });
  }
  async remove(keyArray) {
    const db = await this.dbPromise;
    const transaction = db.transaction(this.store, "readwrite");
    const objectStore = transaction.objectStore(this.store);
    objectStore.delete(keyArray);
    return new Promise((resolve, reject) => {
      transaction.onerror = () => {
        reject(transaction.error);
      };
      transaction.oncomplete = () => {
        resolve();
      };
    });
  }
  async loadRange(keyPrefix) {
    const db = await this.dbPromise;
    const lowerBound = keyPrefix;
    const upperBound = [...keyPrefix, "\uFFFF"];
    const range = IDBKeyRange.bound(lowerBound, upperBound);
    const transaction = db.transaction(this.store);
    const objectStore = transaction.objectStore(this.store);
    const request = objectStore.openCursor(range);
    const result = [];
    return new Promise((resolve, reject) => {
      transaction.onerror = () => {
        reject(request.error);
      };
      request.onsuccess = (event) => {
        const cursor = event.target.result;
        if (cursor) {
          result.push({
            data: cursor.value.binary,
            key: cursor.key
          });
          cursor.continue();
        } else {
          resolve(result);
        }
      };
    });
  }
  async removeRange(keyPrefix) {
    const db = await this.dbPromise;
    const lowerBound = keyPrefix;
    const upperBound = [...keyPrefix, "\uFFFF"];
    const range = IDBKeyRange.bound(lowerBound, upperBound);
    const transaction = db.transaction(this.store, "readwrite");
    const objectStore = transaction.objectStore(this.store);
    objectStore.delete(range);
    return new Promise((resolve, reject) => {
      transaction.onerror = () => {
        reject(transaction.error);
      };
      transaction.oncomplete = () => {
        resolve();
      };
    });
  }
};

// ../../../node_modules/@automerge/automerge-repo-network-websocket/dist/WebSocketClientAdapter.js
import { NetworkAdapter, cbor } from "https://gaios.sgai.uk/packages/@automerge/automerge-repo/slim.js";

// ../../../node_modules/isomorphic-ws/browser.js
var ws = null;
if (typeof WebSocket !== "undefined") {
  ws = WebSocket;
} else if (typeof MozWebSocket !== "undefined") {
  ws = MozWebSocket;
} else if (typeof global !== "undefined") {
  ws = global.WebSocket || global.MozWebSocket;
} else if (typeof window !== "undefined") {
  ws = window.WebSocket || window.MozWebSocket;
} else if (typeof self !== "undefined") {
  ws = self.WebSocket || self.MozWebSocket;
}
var browser_default = ws;

// ../../../node_modules/@automerge/automerge-repo-network-websocket/dist/WebSocketClientAdapter.js
var import_debug = __toESM(require_browser(), 1);

// ../../../node_modules/@automerge/automerge-repo-network-websocket/dist/messages.js
var isPeerMessage = (message) => message.type === "peer";
var isErrorMessage = (message) => message.type === "error";

// ../../../node_modules/@automerge/automerge-repo-network-websocket/dist/protocolVersion.js
var ProtocolV1 = "1";

// ../../../node_modules/@automerge/automerge-repo-network-websocket/dist/assert.js
function assert(value, message = "Assertion failed") {
  if (value === false || value === null || value === void 0) {
    const error = new Error(trimLines(message));
    error.stack = removeLine(error.stack, "assert.ts");
    throw error;
  }
}
var trimLines = (s) => s.split("\n").map((s2) => s2.trim()).join("\n");
var removeLine = (s = "", targetText) => s.split("\n").filter((line) => !line.includes(targetText)).join("\n");

// ../../../node_modules/@automerge/automerge-repo-network-websocket/dist/toArrayBuffer.js
var toArrayBuffer = (bytes) => {
  const { buffer, byteOffset, byteLength } = bytes;
  return buffer.slice(byteOffset, byteOffset + byteLength);
};

// ../../../node_modules/@automerge/automerge-repo-network-websocket/dist/WebSocketClientAdapter.js
var WebSocketNetworkAdapter = class extends NetworkAdapter {
  socket;
};
var WebSocketClientAdapter = class extends WebSocketNetworkAdapter {
  url;
  retryInterval;
  #ready = false;
  #readyResolver;
  #readyPromise = new Promise((resolve) => {
    this.#readyResolver = resolve;
  });
  isReady() {
    return this.#ready;
  }
  whenReady() {
    return this.#readyPromise;
  }
  #forceReady() {
    if (!this.#ready) {
      this.#ready = true;
      this.#readyResolver?.();
    }
  }
  #retryIntervalId;
  #log = (0, import_debug.default)("automerge-repo:websocket:browser");
  remotePeerId;
  // this adapter only connects to one remote client at a time
  constructor(url, retryInterval = 5e3) {
    super();
    this.url = url;
    this.retryInterval = retryInterval;
    this.#log = this.#log.extend(url);
  }
  connect(peerId, peerMetadata) {
    if (!this.socket || !this.peerId) {
      this.#log("connecting");
      this.peerId = peerId;
      this.peerMetadata = peerMetadata ?? {};
    } else {
      this.#log("reconnecting");
      assert(peerId === this.peerId);
      this.socket.removeEventListener("open", this.onOpen);
      this.socket.removeEventListener("close", this.onClose);
      this.socket.removeEventListener("message", this.onMessage);
      this.socket.removeEventListener("error", this.onError);
    }
    if (!this.#retryIntervalId)
      this.#retryIntervalId = setInterval(() => {
        this.connect(peerId, peerMetadata);
      }, this.retryInterval);
    this.socket = new browser_default(this.url);
    this.socket.binaryType = "arraybuffer";
    this.socket.addEventListener("open", this.onOpen);
    this.socket.addEventListener("close", this.onClose);
    this.socket.addEventListener("message", this.onMessage);
    this.socket.addEventListener("error", this.onError);
    setTimeout(() => this.#forceReady(), 1e3);
    this.join();
  }
  onOpen = () => {
    this.#log("open");
    clearInterval(this.#retryIntervalId);
    this.#retryIntervalId = void 0;
    this.join();
  };
  // When a socket closes, or disconnects, remove it from the array.
  onClose = () => {
    this.#log("close");
    if (this.remotePeerId)
      this.emit("peer-disconnected", { peerId: this.remotePeerId });
    if (this.retryInterval > 0 && !this.#retryIntervalId)
      setTimeout(() => {
        assert(this.peerId);
        return this.connect(this.peerId, this.peerMetadata);
      }, this.retryInterval);
  };
  onMessage = (event) => {
    this.receiveMessage(event.data);
  };
  /** The websocket error handler signature is different on node and the browser.  */
  onError = (event) => {
    if ("error" in event) {
      if (event.error.code !== "ECONNREFUSED") {
        throw event.error;
      }
    } else {
    }
    this.#log("Connection failed, retrying...");
  };
  join() {
    assert(this.peerId);
    assert(this.socket);
    if (this.socket.readyState === browser_default.OPEN) {
      this.send(joinMessage(this.peerId, this.peerMetadata));
    } else {
    }
  }
  disconnect() {
    assert(this.peerId);
    assert(this.socket);
    const socket = this.socket;
    if (socket) {
      socket.removeEventListener("open", this.onOpen);
      socket.removeEventListener("close", this.onClose);
      socket.removeEventListener("message", this.onMessage);
      socket.removeEventListener("error", this.onError);
      socket.close();
    }
    clearInterval(this.#retryIntervalId);
    if (this.remotePeerId)
      this.emit("peer-disconnected", { peerId: this.remotePeerId });
    this.socket = void 0;
  }
  send(message) {
    if ("data" in message && message.data?.byteLength === 0)
      throw new Error("Tried to send a zero-length message");
    assert(this.peerId);
    if (!this.socket) {
      this.#log("Tried to send on a disconnected socket.");
      return;
    }
    if (this.socket.readyState !== browser_default.OPEN)
      throw new Error(`Websocket not ready (${this.socket.readyState})`);
    const encoded = cbor.encode(message);
    this.socket.send(toArrayBuffer(encoded));
  }
  peerCandidate(remotePeerId, peerMetadata) {
    assert(this.socket);
    this.#forceReady();
    this.remotePeerId = remotePeerId;
    this.emit("peer-candidate", {
      peerId: remotePeerId,
      peerMetadata
    });
  }
  receiveMessage(messageBytes) {
    let message;
    try {
      message = cbor.decode(new Uint8Array(messageBytes));
    } catch (e) {
      this.#log("error decoding message:", e);
      return;
    }
    assert(this.socket);
    if (messageBytes.byteLength === 0)
      throw new Error("received a zero-length message");
    if (isPeerMessage(message)) {
      const { peerMetadata } = message;
      this.#log(`peer: ${message.senderId}`);
      this.peerCandidate(message.senderId, peerMetadata);
    } else if (isErrorMessage(message)) {
      this.#log(`error: ${message.message}`);
    } else {
      this.emit("message", message);
    }
  }
};
function joinMessage(senderId, peerMetadata) {
  return {
    type: "join",
    senderId,
    peerMetadata,
    supportedProtocolVersions: [ProtocolV1]
  };
}

// ../../../node_modules/@automerge/automerge-repo-network-websocket/dist/WebSocketServerAdapter.js
var import_debug2 = __toESM(require_browser(), 1);
import { cbor as cborHelpers, NetworkAdapter as NetworkAdapter2 } from "https://gaios.sgai.uk/packages/@automerge/automerge-repo/slim.js";
var log = (0, import_debug2.default)("WebsocketServer");
var { encode, decode } = cborHelpers;

// ../../../node_modules/@automerge/automerge-repo-network-messagechannel/dist/index.js
import { NetworkAdapter as NetworkAdapter3 } from "https://gaios.sgai.uk/packages/@automerge/automerge-repo/slim.js";

// ../../../node_modules/eventemitter3/index.mjs
var import_index = __toESM(require_eventemitter3(), 1);

// ../../../node_modules/@automerge/automerge-repo-network-messagechannel/dist/StrongMessagePortRef.js
var StrongMessagePortRef = class extends import_index.default {
  port;
  isDisconnected = false;
  constructor(port) {
    port.addEventListener("message", (event) => {
      if (!this.isDisconnected) {
        this.emit("message", event);
      }
    });
    super();
    this.port = port;
  }
  postMessage(message, transfer) {
    if (!this.isDisconnected) {
      this.port.postMessage(message, transfer);
    }
  }
  start() {
    this.isDisconnected = false;
    this.port.start();
  }
  stop() {
    this.isDisconnected = true;
  }
  isAlive() {
    return true;
  }
};

// ../../../node_modules/@automerge/automerge-repo-network-messagechannel/dist/WeakMessagePortRef.js
var WeakMessagePortRef = class extends import_index.default {
  weakRef;
  isDisconnected = false;
  constructor(port) {
    super();
    this.weakRef = new WeakRef(port);
    port.addEventListener("message", (event) => {
      if (!this.isDisconnected) {
        this.emit("message", event);
      }
    });
  }
  postMessage(message, transfer) {
    const port = this.weakRef.deref();
    if (!port) {
      this.disconnnect();
      return;
    }
    if (this.isDisconnected) {
      return;
    }
    try {
      port.postMessage(message, transfer);
    } catch (err) {
      this.disconnnect();
    }
  }
  start() {
    const port = this.weakRef.deref();
    if (!port) {
      this.disconnnect();
      return;
    }
    this.isDisconnected = false;
    try {
      port.start();
    } catch (err) {
      this.disconnnect();
    }
  }
  stop() {
    this.isDisconnected = true;
  }
  disconnnect() {
    if (!this.isDisconnected) {
      this.emit("close");
      this.isDisconnected = true;
    }
  }
  isAlive() {
    if (this.isDisconnected) {
      return false;
    }
    if (!this.weakRef.deref()) {
      this.disconnnect();
      return false;
    }
    return true;
  }
};

// ../../../node_modules/@automerge/automerge-repo-network-messagechannel/dist/index.js
var import_debug3 = __toESM(require_browser(), 1);
var log2 = (0, import_debug3.default)("automerge-repo:messagechannel");
var MessageChannelNetworkAdapter = class extends NetworkAdapter3 {
  channels = {};
  /** @hidden */
  messagePortRef;
  #ready = false;
  #readyResolver;
  #readyPromise = new Promise((resolve) => {
    this.#readyResolver = resolve;
  });
  #remotePeerId;
  isReady() {
    return this.#ready;
  }
  whenReady() {
    return this.#readyPromise;
  }
  #forceReady() {
    if (!this.#ready) {
      this.#ready = true;
      this.#readyResolver?.();
    }
  }
  constructor(messagePort, config = {}) {
    super();
    const useWeakRef = config.useWeakRef ?? false;
    this.messagePortRef = useWeakRef ? new WeakMessagePortRef(messagePort) : new StrongMessagePortRef(messagePort);
  }
  connect(peerId, peerMetadata) {
    log2("messageport connecting");
    this.peerId = peerId;
    this.peerMetadata = peerMetadata;
    this.messagePortRef.start();
    this.messagePortRef.addListener("message", (e) => {
      log2("message port received %o", e.data);
      const message = e.data;
      if ("targetId" in message && message.targetId !== this.peerId) {
        throw new Error("MessagePortNetwork should never receive messages for a different peer.");
      }
      const { senderId, type } = message;
      switch (type) {
        case "arrive":
          {
            const { peerMetadata: peerMetadata2 } = message;
            this.messagePortRef.postMessage({
              type: "welcome",
              senderId: this.peerId,
              peerMetadata: this.peerMetadata,
              targetId: senderId
            });
            this.announceConnection(senderId, peerMetadata2);
          }
          break;
        case "welcome":
          {
            const { peerMetadata: peerMetadata2 } = message;
            this.announceConnection(senderId, peerMetadata2);
          }
          break;
        case "leave":
          if (this.#remotePeerId === senderId) {
            this.emit("peer-disconnected", { peerId: senderId });
            this.emit("close");
          }
          break;
        default:
          if (!("data" in message)) {
            this.emit("message", message);
          } else {
            this.emit("message", {
              ...message,
              data: message.data ? new Uint8Array(message.data) : void 0
            });
          }
          break;
      }
    });
    this.messagePortRef.addListener("close", () => {
      this.emit("close");
    });
    this.messagePortRef.postMessage({
      senderId: this.peerId,
      type: "arrive",
      peerMetadata
    });
    setTimeout(() => {
      this.#forceReady();
    }, 100);
  }
  send(message) {
    if ("data" in message) {
      const data = message.data.buffer.slice(message.data.byteOffset, message.data.byteOffset + message.data.byteLength);
      this.messagePortRef.postMessage({
        ...message,
        data
      }, [data]);
    } else {
      this.messagePortRef.postMessage(message);
    }
  }
  announceConnection(peerId, peerMetadata) {
    this.#remotePeerId = peerId;
    this.#forceReady();
    this.emit("peer-candidate", { peerId, peerMetadata });
  }
  disconnect() {
    if (this.#remotePeerId && this.peerId) {
      this.messagePortRef.postMessage({
        type: "leave",
        senderId: this.peerId
      });
      this.emit("peer-disconnected", { peerId: this.#remotePeerId });
      this.emit("close");
    }
    this.messagePortRef.stop();
  }
};

// service-worker-template.js
var cachename = "default";
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
function log3(...args) {
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
      const wasmResponse = await fetch("https://gaios.sgai.uk/automerge.wasm");
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
    log3("received messagechannel");
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
    log3("serviceworker debugging enabled");
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
  log3("fetch event", fetchEvent.request.url);
  const request = fetchEvent.request;
  if (request.method !== "GET") return fetchEvent.respondWith(fetch(request));
  const url = new URL(fetchEvent.request.url);
  let specialURL;
  if (url.hostname == self.location.hostname && url.port == self.location.port && url.protocol == self.location.protocol) {
    try {
      specialURL = new URL(decodeURIComponent(url.pathname.slice(1)));
      log3(`received special request ${specialURL}`);
    } catch {
    }
  }
  fetchEvent.respondWith(
    (async () => {
      const cache = await caches.open(cachename);
      const match = await cache.match(request);
      try {
        if (specialURL) {
          if (match) {
            log3(`serving ${specialURL} from cache ${cachename}`);
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
            log3(`caching ${specialURL}`);
            await cache.put(request, response.clone());
          }
          return response;
        } else {
          const response = await fetch(request);
          if (response) {
            if (cacheableStatuses.includes(response.status) && response.url.match(/^https?\:/)) {
              await cache.put(request, response.clone());
            } else {
              log3(
                `skipping uncacheable response code from cache: ${response.status} for ${response.url}`
              );
            }
            return response;
          }
          if (match) return match;
          return new Response("couldnt fetch and no stale", { status: 503 });
        }
      } catch (error) {
        const message = error instanceof Error ? `${error.message}

${error.stack}` : String(error);
        console.error(
          `service worker error resolving ${request.url}${specialURL ? ` (for: ${specialURL})` : ""}.
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
