// src/assertions/application.ts
import { ApplicationLanguage } from "@squarecloud/api-types/v2";
import * as z from "zod";
var applicationSchema = z.object({
  id: z.string(),
  name: z.string(),
  desc: z.string().optional(),
  cluster: z.string(),
  ram: z.number(),
  language: z.nativeEnum(ApplicationLanguage),
  isWebsite: z.boolean()
}).passthrough();
var websiteApplicationSchema = applicationSchema.extend({
  isWebsite: z.literal(true),
  domain: z.string(),
  custom: z.string().nullable().optional()
}).passthrough();

// src/assertions/literal.ts
import * as z2 from "zod";
var stringSchema = z2.coerce.string();
var booleanSchema = z2.coerce.boolean();
var pathLikeSchema = z2.string().or(z2.instanceof(Buffer));

// src/managers/application/index.ts
import FormData from "form-data";

// src/structures/application/application.ts
import FormData2 from "form-data";

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
import { ApplicationStatus as ApplicationStatus2 } from "@squarecloud/api-types/v2";
import * as z3 from "zod";
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
  status: z3.nativeEnum(ApplicationStatus2),
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
import { ApplicationLanguage as ApplicationLanguage2, UserPlanName } from "@squarecloud/api-types/v2";
import * as z4 from "zod";
var userSchema = z4.object({
  id: z4.string(),
  tag: z4.string(),
  email: z4.string(),
  plan: z4.object({
    name: z4.nativeEnum(UserPlanName),
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
  lang: z4.nativeEnum(ApplicationLanguage2),
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
export {
  handleAPIObjectAssertion,
  handleLiteralAssertion
};
//# sourceMappingURL=common.mjs.map