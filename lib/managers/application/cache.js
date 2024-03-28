var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);
var __publicField = (obj, key, value) => {
  __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
  return value;
};

// src/managers/application/cache.ts
var cache_exports = {};
__export(cache_exports, {
  ApplicationCacheManager: () => ApplicationCacheManager
});
module.exports = __toCommonJS(cache_exports);
var ApplicationCacheManager = class {
  constructor() {
    __publicField(this, "status");
    __publicField(this, "backup");
    __publicField(this, "logs");
  }
  set(key, value) {
    Reflect.set(this, key, value);
  }
  get(key) {
    return this[key];
  }
  clear(key) {
    if (key) {
      Reflect.set(this, key, void 0);
    } else {
      Reflect.set(this, "status", void 0);
      Reflect.set(this, "backup", void 0);
      Reflect.set(this, "logs", void 0);
    }
  }
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  ApplicationCacheManager
});
//# sourceMappingURL=cache.js.map