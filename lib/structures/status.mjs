var __defProp = Object.defineProperty;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField = (obj, key, value) => {
  __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
  return value;
};

// src/assertions/status.ts
import { ApplicationStatus as ApplicationStatus2 } from "@squarecloud/api-types/v2";
import * as z4 from "zod";

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

// src/assertions/user.ts
import { ApplicationLanguage as ApplicationLanguage2, UserPlanName } from "@squarecloud/api-types/v2";
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
  lang: z3.nativeEnum(ApplicationLanguage2),
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
  status: z4.nativeEnum(ApplicationStatus2),
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

// src/structures/status.ts
var SimpleApplicationStatus = class {
  constructor(client, data) {
    this.client = client;
    /** The application's ID this status came from */
    __publicField(this, "applicationId");
    /** Usage statuses for this application */
    __publicField(this, "usage");
    /** Whether the application is running or not */
    __publicField(this, "running");
    assertSimpleStatus(data);
    const { id, running } = data;
    this.applicationId = id;
    this.running = running;
    if (running) {
      const { cpu, ram } = data;
      this.usage = { cpu, ram };
    }
  }
  async fetch() {
    const data = await this.client.api.application(
      "status",
      this.applicationId
    );
    return new ApplicationStatus(
      this.client,
      data.response,
      this.applicationId
    );
  }
};
var ApplicationStatus = class {
  constructor(client, data, applicationId) {
    this.client = client;
    /** The application's ID this status came from */
    __publicField(this, "applicationId");
    /** Usage statuses for this application */
    __publicField(this, "usage");
    /** Whether the application is running or not */
    __publicField(this, "running");
    /**
     * The status of the application
     *
     * - 'exited' (stopped)
     * - 'created' (being created)
     * - 'running'
     * - 'starting'
     * - 'restarting'
     * - 'deleting'
     */
    __publicField(this, "status");
    /** How many requests have been made since the last start up */
    __publicField(this, "requests");
    /** For how long the app is running in millisseconds */
    __publicField(this, "uptimeTimestamp");
    /** For how long the app is running */
    __publicField(this, "uptime");
    assertStatus(data);
    const { cpu, ram, network, storage, running, status, requests, uptime } = data;
    this.applicationId = applicationId;
    this.usage = { cpu, ram, network, storage };
    this.running = running;
    this.status = status;
    this.requests = requests;
    this.uptime = uptime ? new Date(uptime) : void 0;
    this.uptimeTimestamp = uptime ?? void 0;
  }
};
export {
  ApplicationStatus,
  SimpleApplicationStatus
};
//# sourceMappingURL=status.mjs.map