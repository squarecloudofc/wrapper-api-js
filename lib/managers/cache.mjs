var __defProp = Object.defineProperty;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField = (obj, key, value) => {
  __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
  return value;
};

// src/managers/cache.ts
var CacheManager = class {
  constructor() {
    __publicField(this, "user");
  }
  set(key, value) {
    Reflect.set(this, key, value);
  }
  get(key) {
    return this[key];
  }
  clear() {
    Reflect.set(this, "user", void 0);
  }
};
export {
  CacheManager
};
//# sourceMappingURL=cache.mjs.map