var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
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
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);
var __publicField = (obj, key, value) => {
  __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
  return value;
};

// src/types/index.ts
var types_exports = {};
__export(types_exports, {
  TypedEventEmitter: () => TypedEventEmitter
});
module.exports = __toCommonJS(types_exports);

// src/types/client.ts
var import_events = __toESM(require("events"));
var TypedEventEmitter = class {
  constructor() {
    __publicField(this, "emitter", new import_events.default());
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
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  TypedEventEmitter
});
//# sourceMappingURL=index.js.map