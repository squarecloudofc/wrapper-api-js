// src/assertions/literal.ts
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

// src/assertions/literal.ts
var stringSchema = z4.coerce.string();
var booleanSchema = z4.coerce.boolean();
var pathLikeSchema = z4.string().or(z4.instanceof(Buffer));

// src/managers/application/backup.ts
var ApplicationBackupManager = class {
  constructor(application) {
    this.application = application;
  }
  /** @returns The generated backup URL */
  async url() {
    const data = await this.application.client.api.application(
      "backup",
      this.application.id
    );
    const backup = data.response.downloadURL;
    this.application.client.emit(
      "backupUpdate",
      this.application,
      this.application.cache.backup,
      backup
    );
    this.application.cache.set("backup", backup);
    return backup;
  }
  /** @returns The generated backup buffer */
  async download() {
    const url = await this.url();
    const registryUrl = url.replace(
      "https://squarecloud.app/dashboard/backup/",
      "https://registry.squarecloud.app/v1/backup/download/"
    );
    const res = await fetch(registryUrl).then((res2) => res2.arrayBuffer()).catch(() => void 0);
    if (!res) {
      throw new SquareCloudAPIError("BACKUP_DOWNLOAD_FAILED");
    }
    return Buffer.from(res);
  }
};
export {
  ApplicationBackupManager
};
//# sourceMappingURL=backup.mjs.map