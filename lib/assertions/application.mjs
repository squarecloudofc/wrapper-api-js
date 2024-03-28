// src/assertions/application.ts
import { ApplicationLanguage as ApplicationLanguage2 } from "@squarecloud/api-types/v2";
import * as z4 from "zod";

// src/assertions/literal.ts
import * as z from "zod";
var stringSchema = z.coerce.string();
var booleanSchema = z.coerce.boolean();
var pathLikeSchema = z.string().or(z.instanceof(Buffer));

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
import * as z2 from "zod";
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
  status: z2.nativeEnum(ApplicationStatus2),
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
import { ApplicationLanguage, UserPlanName } from "@squarecloud/api-types/v2";
import * as z3 from "zod";
var userSchema = z3.object({
  id: z3.string(),
  tag: z3.string(),
  email: z3.string(),
  plan: z3.object({
    name: z3.nativeEnum(UserPlanName),
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
  lang: z3.nativeEnum(ApplicationLanguage),
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
  language: z4.nativeEnum(ApplicationLanguage2),
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
export {
  assertApplication,
  assertWebsiteApplication
};
//# sourceMappingURL=application.mjs.map