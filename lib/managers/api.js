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

// src/managers/api.ts
var api_exports = {};
__export(api_exports, {
  APIManager: () => APIManager
});
module.exports = __toCommonJS(api_exports);

// src/assertions/literal.ts
var z4 = __toESM(require("zod"));

// src/assertions/application.ts
var import_v2 = require("@squarecloud/api-types/v2");
var z = __toESM(require("zod"));
var applicationSchema = z.object({
  id: z.string(),
  name: z.string(),
  desc: z.string().optional(),
  cluster: z.string(),
  ram: z.number(),
  language: z.nativeEnum(import_v2.ApplicationLanguage),
  isWebsite: z.boolean()
}).passthrough();
var websiteApplicationSchema = applicationSchema.extend({
  isWebsite: z.literal(true),
  domain: z.string(),
  custom: z.string().nullable().optional()
}).passthrough();

// src/managers/application/index.ts
var import_form_data = __toESM(require("form-data"));

// src/structures/application/application.ts
var import_form_data2 = __toESM(require("form-data"));

// src/structures/error.ts
var SquareCloudAPIError = class extends TypeError {
  constructor(code, message, options) {
    super(code);
    this.name = "SquareCloudAPIError";
    this.message = (code?.replaceAll("_", " ").toLowerCase().replace(/(^|\s)\S/g, (L) => L.toUpperCase()) || "UNKNOWN_CODE") + (message ? `: ${message}` : "");
    if (options?.stack) {
      this.stack = options.stack;
    }
    if (options?.cause) {
      this.cause = options.cause;
    }
  }
};

// src/assertions/status.ts
var import_v22 = require("@squarecloud/api-types/v2");
var z2 = __toESM(require("zod"));
var simpleStatusSchema = z2.object({
  id: z2.string(),
  cpu: z2.string(),
  ram: z2.string(),
  running: z2.literal(true)
}).passthrough().or(
  z2.object({
    id: z2.string(),
    running: z2.literal(false)
  }).passthrough()
);
var statusSchema = z2.object({
  cpu: z2.string(),
  ram: z2.string(),
  status: z2.nativeEnum(import_v22.ApplicationStatus),
  running: z2.boolean(),
  storage: z2.string(),
  network: z2.object({
    total: z2.string(),
    now: z2.string()
  }),
  requests: z2.number(),
  uptime: z2.number().nullable().optional()
}).passthrough();

// src/assertions/user.ts
var import_v23 = require("@squarecloud/api-types/v2");
var z3 = __toESM(require("zod"));
var userSchema = z3.object({
  id: z3.string(),
  tag: z3.string(),
  email: z3.string(),
  plan: z3.object({
    name: z3.nativeEnum(import_v23.UserPlanName),
    memory: z3.object({
      limit: z3.number(),
      available: z3.number(),
      used: z3.number()
    }),
    duration: z3.number().nullable().optional()
  })
}).passthrough();
var userApplicationSchema = z3.object({
  id: z3.string(),
  tag: z3.string(),
  desc: z3.string().optional(),
  ram: z3.number(),
  lang: z3.nativeEnum(import_v23.ApplicationLanguage),
  cluster: z3.string(),
  isWebsite: z3.boolean()
}).passthrough();
var userInfoSchema = z3.object({
  user: userSchema,
  applications: z3.array(userApplicationSchema)
});

// src/assertions/literal.ts
var stringSchema = z4.coerce.string();
var booleanSchema = z4.coerce.boolean();
var pathLikeSchema = z4.string().or(z4.instanceof(Buffer));

// src/managers/api.ts
var APIManager = class {
  constructor(apiKey) {
    this.apiKey = apiKey;
    __publicField(this, "baseUrl", "https://api.squarecloud.app");
    __publicField(this, "version", "v2");
  }
  user(userId) {
    return this.fetch(`user${userId ? `/${userId}` : ""}`);
  }
  application(path, appId, params, options) {
    if (typeof options === "string") {
      options = {
        method: options
      };
    }
    const url = `apps${appId ? `/${appId}` : ""}${path ? `/${path}` : ""}${params ? `?${new URLSearchParams(params)}` : ""}`;
    return this.fetch(url, options);
  }
  async fetch(path, options = {}) {
    options.method = options.method || "GET";
    options.headers = {
      ...options.headers || {},
      Authorization: this.apiKey
    };
    const res = await fetch(
      `${this.baseUrl}/${this.version}/${path}`,
      options
    ).catch((err) => {
      throw new SquareCloudAPIError(err.code, err.message);
    });
    const data = await res.json();
    if (!data || data.status === "error" || !res.ok) {
      throw new SquareCloudAPIError(data?.code || "COMMON_ERROR");
    }
    return data;
  }
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  APIManager
});
//# sourceMappingURL=api.js.map