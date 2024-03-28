var __defProp = Object.defineProperty;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField = (obj, key, value) => {
  __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
  return value;
};

// src/managers/application/cache.ts
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
export {
  ApplicationCacheManager
};
//# sourceMappingURL=cache.mjs.map