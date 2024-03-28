var __defProp = Object.defineProperty;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField = (obj, key, value) => {
  __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
  return value;
};

// src/types/client.ts
import EventEmitter from "events";
var TypedEventEmitter = class {
  constructor() {
    __publicField(this, "emitter", new EventEmitter());
  }
  emit(eventName, ...eventArg) {
    this.emitter.emit(eventName, ...eventArg);
  }
  on(eventName, handler) {
    this.emitter.on(eventName, handler);
  }
  off(eventName, handler) {
    this.emitter.off(eventName, handler);
  }
};
export {
  TypedEventEmitter
};
//# sourceMappingURL=client.mjs.map