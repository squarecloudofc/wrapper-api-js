// src/managers/application/files.ts
import { join } from "path";

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

// src/assertions/literal.ts
var stringSchema = z4.coerce.string();
var booleanSchema = z4.coerce.boolean();
var pathLikeSchema = z4.string().or(z4.instanceof(Buffer));
function assertString(value, code) {
  handleLiteralAssertion({
    schema: stringSchema,
    expect: "string",
    value,
    code
  });
}
function assertPathLike(value, code) {
  handleLiteralAssertion({
    schema: pathLikeSchema,
    expect: "string or Buffer",
    value,
    code
  });
}

// src/managers/application/files.ts
import { readFile } from "fs/promises";
var ApplicationFilesManager = class {
  constructor(application) {
    this.application = application;
  }
  /**
   * Lists the files inside a directory
   *
   * @param path - The absolute directory path
   */
  async list(path = "/") {
    assertString(path, "LIST_FILES_PATH");
    const { response } = await this.application.client.api.application(
      "files/list",
      this.application.id,
      { path }
    );
    return response;
  }
  /**
   * Reads the specified file content
   *
   * @param path - The absolute file path
   */
  async read(path) {
    assertString(path, "READ_FILE_PATH");
    const { response } = await this.application.client.api.application(
      "files/read",
      this.application.id,
      { path }
    );
    if (!response) {
      return;
    }
    return Buffer.from(response.data);
  }
  /**
   * Creates a new file
   *
   * @param file - The file content
   * @param fileName - The file name with extension
   * @param path - The absolute file path
   */
  async create(file, fileName, path = "/") {
    assertPathLike(file, "CREATE_FILE");
    if (typeof file === "string") {
      file = await readFile(file);
    }
    path = join(path, fileName).replaceAll("\\", "/");
    const { status } = await this.application.client.api.application(
      "files/create",
      this.application.id,
      void 0,
      {
        method: "POST",
        body: JSON.stringify({
          buffer: file.toJSON(),
          path
        })
      }
    );
    return status === "success";
  }
  /**
   * Deletes the specified file or directory
   *
   * @param path - The absolute file or directory path
   */
  async delete(path) {
    assertString(path, "DELETE_FILE_PATH");
    const { status } = await this.application.client.api.application(
      "files/delete",
      this.application.id,
      { path },
      "DELETE"
    );
    return status === "success";
  }
};
export {
  ApplicationFilesManager
};
//# sourceMappingURL=files.mjs.map