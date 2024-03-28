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

// src/assertions/application.ts
var application_exports = {};
__export(application_exports, {
  assertApplication: () => assertApplication,
  assertWebsiteApplication: () => assertWebsiteApplication
});
module.exports = __toCommonJS(application_exports);
var import_v23 = require("@squarecloud/api-types/v2");
var z4 = __toESM(require("zod"));

// src/assertions/literal.ts
var z = __toESM(require("zod"));
var stringSchema = z.coerce.string();
var booleanSchema = z.coerce.boolean();
var pathLikeSchema = z.string().or(z.instanceof(Buffer));

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
var import_v2 = require("@squarecloud/api-types/v2");
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
  status: z2.nativeEnum(import_v2.ApplicationStatus),
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

// src/assertions/application.ts
var applicationSchema = z4.object({
  id: z4.string(),
  name: z4.string(),
  desc: z4.string().optional(),
  cluster: z4.string(),
  ram: z4.number(),
  language: z4.nativeEnum(import_v23.ApplicationLanguage),
  isWebsite: z4.boolean()
}).passthrough();
var websiteApplicationSchema = applicationSchema.extend({
  isWebsite: z4.literal(true),
  domain: z4.string(),
  custom: z4.string().nullable().optional()
}).passthrough();
function assertApplication(value) {
  handleAPIObjectAssertion({
    schema: applicationSchema,
    value,
    code: "APPLICATION",
    route: "/apps/{app_id}"
  });
}
function assertWebsiteApplication(value) {
  handleAPIObjectAssertion({
    schema: websiteApplicationSchema,
    value,
    code: "WEBSITE_APPLICATION",
    route: "/apps/{app_id}"
  });
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  assertApplication,
  assertWebsiteApplication
});
//# sourceMappingURL=application.js.map