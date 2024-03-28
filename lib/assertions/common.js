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

// src/assertions/common.ts
var common_exports = {};
__export(common_exports, {
  handleAPIObjectAssertion: () => handleAPIObjectAssertion,
  handleLiteralAssertion: () => handleLiteralAssertion
});
module.exports = __toCommonJS(common_exports);

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

// src/assertions/status.ts
var import_v22 = require("@squarecloud/api-types/v2");
var z3 = __toESM(require("zod"));
var simpleStatusSchema = z3.object({
  id: z3.string(),
  cpu: z3.string(),
  ram: z3.string(),
  running: z3.literal(true)
}).passthrough().or(
  z3.object({
    id: z3.string(),
    running: z3.literal(false)
  }).passthrough()
);
var statusSchema = z3.object({
  cpu: z3.string(),
  ram: z3.string(),
  status: z3.nativeEnum(import_v22.ApplicationStatus),
  running: z3.boolean(),
  storage: z3.string(),
  network: z3.object({
    total: z3.string(),
    now: z3.string()
  }),
  requests: z3.number(),
  uptime: z3.number().nullable().optional()
}).passthrough();

// src/assertions/user.ts
var import_v23 = require("@squarecloud/api-types/v2");
var z4 = __toESM(require("zod"));
var userSchema = z4.object({
  id: z4.string(),
  tag: z4.string(),
  email: z4.string(),
  plan: z4.object({
    name: z4.nativeEnum(import_v23.UserPlanName),
    memory: z4.object({
      limit: z4.number(),
      available: z4.number(),
      used: z4.number()
    }),
    duration: z4.number().nullable().optional()
  })
}).passthrough();
var userApplicationSchema = z4.object({
  id: z4.string(),
  tag: z4.string(),
  desc: z4.string().optional(),
  ram: z4.number(),
  lang: z4.nativeEnum(import_v23.ApplicationLanguage),
  cluster: z4.string(),
  isWebsite: z4.boolean()
}).passthrough();
var userInfoSchema = z4.object({
  user: userSchema,
  applications: z4.array(userApplicationSchema)
});

// src/assertions/common.ts
function handleLiteralAssertion({
  schema,
  value,
  expect,
  code
}) {
  try {
    schema.parse(value);
  } catch {
    throw new SquareCloudAPIError(
      code ? `INVALID_${code}` : "VALIDATION_ERROR",
      `Expect ${expect}, got ${typeof value}`
    );
  }
}
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
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  handleAPIObjectAssertion,
  handleLiteralAssertion
});
//# sourceMappingURL=common.js.map