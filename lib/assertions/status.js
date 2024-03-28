var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
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

// src/assertions/status.ts
var status_exports = {};
__export(status_exports, {
  assertSimpleStatus: () => assertSimpleStatus,
  assertStatus: () => assertStatus
});
module.exports = __toCommonJS(status_exports);
var import_v23 = require("@squarecloud/api-types/v2");
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

// src/assertions/literal.ts
var z2 = __toESM(require("zod"));
var stringSchema = z2.coerce.string();
var booleanSchema = z2.coerce.boolean();
var pathLikeSchema = z2.string().or(z2.instanceof(Buffer));

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

// src/assertions/user.ts
var import_v22 = require("@squarecloud/api-types/v2");
var z3 = __toESM(require("zod"));
var userSchema = z3.object({
  id: z3.string(),
  tag: z3.string(),
  email: z3.string(),
  plan: z3.object({
    name: z3.nativeEnum(import_v22.UserPlanName),
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
  lang: z3.nativeEnum(import_v22.ApplicationLanguage),
  cluster: z3.string(),
  isWebsite: z3.boolean()
}).passthrough();
var userInfoSchema = z3.object({
  user: userSchema,
  applications: z3.array(userApplicationSchema)
});

// src/assertions/common.ts
function handleAPIObjectAssertion({
  schema,
  value,
  code,
  route
}) {
  const name = code.toLowerCase().replaceAll("_", " ");
  try {
    schema.parse(value);
  } catch (err) {
    const cause = err.errors?.map((err2) => ({
      ...err2,
      path: err2.path.join(" > ")
    }));
    throw new SquareCloudAPIError(
      `INVALID_API_${code}`,
      `Invalid ${name} object received from API ${route}`,
      { cause }
    );
  }
}

// src/assertions/status.ts
var simpleStatusSchema = z4.object({
  id: z4.string(),
  cpu: z4.string(),
  ram: z4.string(),
  running: z4.literal(true)
}).passthrough().or(
  z4.object({
    id: z4.string(),
    running: z4.literal(false)
  }).passthrough()
);
var statusSchema = z4.object({
  cpu: z4.string(),
  ram: z4.string(),
  status: z4.nativeEnum(import_v23.ApplicationStatus),
  running: z4.boolean(),
  storage: z4.string(),
  network: z4.object({
    total: z4.string(),
    now: z4.string()
  }),
  requests: z4.number(),
  uptime: z4.number().nullable().optional()
}).passthrough();
function assertSimpleStatus(value) {
  handleAPIObjectAssertion({
    schema: simpleStatusSchema,
    value,
    code: "STATUS_ALL",
    route: "/apps/all/status"
  });
}
function assertStatus(value) {
  handleAPIObjectAssertion({
    schema: statusSchema,
    value,
    code: "STATUS",
    route: "/apps/{app_id}/status"
  });
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  assertSimpleStatus,
  assertStatus
});
//# sourceMappingURL=status.js.map