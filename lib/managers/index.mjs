var __defProp = Object.defineProperty;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField = (obj, key, value) => {
  __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
  return value;
};

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

// src/structures/application/application.ts
import FormData from "form-data";
import { readFile } from "fs/promises";
var Application = class {
  constructor(client, data) {
    this.client = client;
    /** The application ID */
    __publicField(this, "id");
    /** The application display name */
    __publicField(this, "name");
    /** The application description */
    __publicField(this, "description");
    /** The url to manage the application via web */
    __publicField(this, "url");
    /** The application current cluster */
    __publicField(this, "cluster");
    /** The application total ram */
    __publicField(this, "ram");
    /**
     * The application programming language
     *
     * - `javascript`
     * - `typescript`
     * - `python`
     * - `java`
     * - `elixir`
     * - `rust`
     * - `go`
     * - `php`
     */
    __publicField(this, "language");
    /** Files manager for this application */
    __publicField(this, "files", new ApplicationFilesManager(this));
    /** Backup manager for this application */
    __publicField(this, "backup", new ApplicationBackupManager(this));
    /** Deploys manager for this application */
    __publicField(this, "deploys", new ApplicationDeploysManager(this));
    /** Cache manager for this application */
    __publicField(this, "cache", new ApplicationCacheManager());
    assertApplication(data);
    const { id, name, desc, cluster, ram, language } = data;
    this.id = id;
    this.name = name;
    this.description = desc;
    this.cluster = cluster;
    this.ram = ram;
    this.language = language;
    this.url = `https://squarecloud.app/dashboard/app/${id}`;
  }
  /** @returns The application current status information */
  async getStatus() {
    const data = await this.client.api.application("status", this.id);
    const status = new ApplicationStatus(this.client, data.response, this.id);
    this.client.emit("statusUpdate", this, this.cache.status, status);
    this.cache.set("status", status);
    return status;
  }
  /** @returns The application logs */
  async getLogs() {
    const data = await this.client.api.application("logs", this.id);
    const { logs } = data.response;
    this.client.emit("logsUpdate", this, this.cache.logs, logs);
    this.cache.set("logs", logs);
    return logs;
  }
  /**
   * Starts up the application
   * @returns `true` for success or `false` for fail
   */
  async start() {
    const data = await this.client.api.application(
      "start",
      this.id,
      void 0,
      "POST"
    );
    return data?.status === "success";
  }
  /**
   * Stops the application
   * @returns `true` for success or `false` for fail
   */
  async stop() {
    const data = await this.client.api.application(
      "stop",
      this.id,
      void 0,
      "POST"
    );
    return data?.status === "success";
  }
  /**
   * Restarts the application
   * @returns `true` for success or `false` for fail
   */
  async restart() {
    const data = await this.client.api.application(
      "restart",
      this.id,
      void 0,
      "POST"
    );
    return data?.status === "success";
  }
  /**
   * Deletes your whole application
   *
   * - This action is irreversible.
   * @returns `true` for success or `false` for fail
   */
  async delete() {
    const data = await this.client.api.application(
      "delete",
      this.id,
      void 0,
      "DELETE"
    );
    return data?.status === "success";
  }
  /**
   * Commit files to your application folder
   *
   * - This action is irreversible.
   *
   * - Tip: use this to get an absolute path.
   * ```ts
   * require('path').join(__dirname, 'fileName')
   * ```
   * - Tip2: use a zip file to commit more than one archive
   *
   * @param file - Buffer or absolute path to the file
   * @param fileName - The file name (e.g.: "index.js")
   * @param restart - Whether the application should be restarted after the commit
   * @returns `true` for success or `false` for fail
   */
  async commit(file, fileName, restart) {
    assertPathLike(file, "COMMIT_DATA");
    if (fileName) {
      assertString(fileName, "FILE_NAME");
    }
    if (typeof file === "string") {
      file = await readFile(file);
    }
    const formData = new FormData();
    formData.append("file", file, { filename: fileName || "app.zip" });
    const data = await this.client.api.application(
      "commit",
      this.id,
      {
        restart: `${Boolean(restart)}`
      },
      {
        method: "POST",
        body: formData.getBuffer(),
        headers: formData.getHeaders()
      }
    );
    return data?.status === "success";
  }
  isWebsite() {
    const domain = Reflect.get(this, "domain");
    return Boolean(domain);
  }
};

// src/structures/application/website.ts
var WebsiteApplication = class extends Application {
  constructor(client, data) {
    super(client, data);
    this.client = client;
    /** The application default domain (e.g. example.squareweb.app) */
    __publicField(this, "domain");
    /** The custom configured domain (e.g. yoursite.com) */
    __publicField(this, "custom");
    /** Network manager for this application */
    __publicField(this, "network", new ApplicationNetworkManager(this));
    assertWebsiteApplication(data);
    const { domain, custom } = data;
    this.domain = domain;
    this.custom = custom || void 0;
  }
};

// src/structures/application/base.ts
var BaseApplication = class {
  constructor(client, data) {
    this.client = client;
    __publicField(this, "id");
    __publicField(this, "tag");
    __publicField(this, "description");
    __publicField(this, "url");
    __publicField(this, "ram");
    /**
     * The application programming language
     *
     * - `javascript`
     * - `typescript`
     * - `python`
     * - `java`
     * - `elixir`
     * - `rust`
     * - `go`
     * - `php`
     */
    __publicField(this, "language");
    __publicField(this, "cluster");
    __publicField(this, "isWebsite");
    const { id, tag, desc, ram, lang, cluster, isWebsite } = data;
    this.id = id;
    this.tag = tag;
    this.description = desc;
    this.ram = ram;
    this.language = lang;
    this.cluster = cluster;
    this.isWebsite = isWebsite;
    this.url = `https://squarecloud.app/dashboard/app/${id}`;
  }
  async fetch() {
    const data = await this.client.api.application("", this.id);
    if (data.response.isWebsite) {
      return new WebsiteApplication(
        this.client,
        data.response
      );
    }
    return new Application(this.client, data.response);
  }
};

// src/structures/collection.ts
var Collection = class extends Map {
  first(amount) {
    if (typeof amount === "undefined") {
      return this.values().next().value;
    }
    if (amount < 0) {
      return this.last(amount * -1);
    }
    amount = Math.min(this.size, amount);
    return Array.from({ length: amount }, () => this.values().next().value);
  }
  last(amount) {
    const arr = [...this.values()];
    if (typeof amount === "undefined")
      return arr[arr.length - 1];
    if (amount < 0)
      return this.first(amount * -1);
    if (!amount)
      return [];
    return arr.slice(-amount);
  }
  /**
   * Identical to {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/reverse Array.reverse()}
   * but returns a Collection instead of an Array.
   */
  reverse() {
    const entries = [...this.entries()].reverse();
    this.clear();
    for (const [key, value] of entries) {
      this.set(key, value);
    }
    return this;
  }
  find(fn, thisArg) {
    if (typeof fn !== "function") {
      throw new TypeError(`${fn} is not a function`);
    }
    if (typeof thisArg !== "undefined") {
      fn = fn.bind(thisArg);
    }
    for (const [key, val] of this) {
      if (fn(val, key, this))
        return val;
    }
  }
  filter(fn, thisArg) {
    if (typeof fn !== "function") {
      throw new TypeError(`${fn} is not a function`);
    }
    if (typeof thisArg !== "undefined") {
      fn = fn.bind(thisArg);
    }
    const results = new this.constructor[Symbol.species]();
    for (const [key, val] of this) {
      if (fn(val, key, this))
        results.set(key, val);
    }
    return results;
  }
  map(fn, thisArg) {
    if (typeof fn !== "function") {
      throw new TypeError(`${fn} is not a function`);
    }
    if (typeof thisArg !== "undefined") {
      fn = fn.bind(thisArg);
    }
    return Array.from({ length: this.size }, () => {
      const [key, value] = this.entries().next().value;
      return fn(value, key, this);
    });
  }
  some(fn, thisArg) {
    if (typeof fn !== "function") {
      throw new TypeError(`${fn} is not a function`);
    }
    if (typeof thisArg !== "undefined") {
      fn = fn.bind(thisArg);
    }
    for (const [key, val] of this) {
      if (fn(val, key, this))
        return true;
    }
    return false;
  }
  every(fn, thisArg) {
    if (typeof fn !== "function") {
      throw new TypeError(`${fn} is not a function`);
    }
    if (typeof thisArg !== "undefined") {
      fn = fn.bind(thisArg);
    }
    for (const [key, val] of this) {
      if (!fn(val, key, this))
        return false;
    }
    return true;
  }
  /**
   * Applies a function to produce a single value. Identical in behavior to
   * {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/reduce Array.reduce()}.
   *
   * @param fn - Function used to reduce, taking four arguments; `accumulator`, `currentValue`, `currentKey`,
   * and `collection`
   * @param initialValue - Starting value for the accumulator
   * @example
   * ```ts
   * collection.reduce((acc, guild) => acc + guild.memberCount, 0);
   * ```
   */
  reduce(fn, initialValue) {
    if (typeof fn !== "function") {
      throw new TypeError(`${fn} is not a function`);
    }
    let accumulator;
    if (typeof initialValue !== "undefined") {
      accumulator = initialValue;
      for (const [key, val] of this) {
        accumulator = fn(accumulator, val, key, this);
      }
      return accumulator;
    }
    let first = true;
    for (const [key, val] of this) {
      if (first) {
        accumulator = val;
        first = false;
        continue;
      }
      accumulator = fn(accumulator, val, key, this);
    }
    if (first) {
      throw new TypeError("Reduce of empty collection with no initial value");
    }
    return accumulator;
  }
  each(fn, thisArg) {
    if (typeof fn !== "function") {
      throw new TypeError(`${fn} is not a function`);
    }
    this.forEach(fn, thisArg);
    return this;
  }
  /**
   * Creates an identical shallow copy of this collection.
   *
   * @example
   * ```ts
   * const newColl = someColl.clone();
   * ```
   */
  clone() {
    return new this.constructor[Symbol.species](this);
  }
  toJSON() {
    return [...this.values()];
  }
};

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
function assertUserInfo(value) {
  handleAPIObjectAssertion({
    schema: userInfoSchema,
    value,
    code: "USER_INFO",
    route: "/user"
  });
}

// src/structures/user.ts
var User = class {
  constructor(client, data) {
    /** The user's id */
    __publicField(this, "id");
    /** The user's Discord tag */
    __publicField(this, "tag");
    /** The user's current plan */
    __publicField(this, "plan");
    /** The user's registered email */
    __publicField(this, "email");
    /** The user's registered applications Collection */
    __publicField(this, "applications");
    assertUserInfo(data);
    const { user, applications } = data;
    const { id, tag, plan, email } = user;
    const { duration } = plan;
    this.id = id;
    this.tag = tag;
    this.email = email;
    this.plan = {
      ...plan,
      expiresInTimestamp: duration ?? void 0,
      expiresIn: duration ? new Date(duration) : void 0
    };
    this.applications = new Collection(
      applications.map((app) => [app.id, new BaseApplication(client, app)])
    );
  }
};

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

// src/managers/application/index.ts
import FormData2 from "form-data";
import { readFile as readFile3 } from "fs/promises";

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

// src/managers/application/cache.ts
var ApplicationCacheManager = class {
  constructor() {
    __publicField(this, "status");
    __publicField(this, "backup");
    __publicField(this, "logs");
  }
  set(key, value) {
    Reflect.set(this, key, value);
  }
  get(key) {
    return this[key];
  }
  clear(key) {
    if (key) {
      Reflect.set(this, key, void 0);
    } else {
      Reflect.set(this, "status", void 0);
      Reflect.set(this, "backup", void 0);
      Reflect.set(this, "logs", void 0);
    }
  }
};

// src/managers/application/deploys.ts
var ApplicationDeploysManager = class {
  constructor(application) {
    this.application = application;
  }
  /**
   * Integrates Square Cloud with GitHub webhooks
   *
   * @param accessToken - The access token for your GitHub repository. You can find this in your [GitHub Tokens Classic](https://github.com/settings/tokens/new)
   */
  async getGithubWebhook(accessToken) {
    assertString(accessToken);
    const data = await this.application.client.api.application(
      "deploy/git-webhook",
      this.application.id,
      void 0,
      {
        method: "POST",
        body: JSON.stringify({ access_token: accessToken })
      }
    );
    return data.response.webhook;
  }
  /**
   * Gets the last 10 deployments of an application from the last 24 hours
   */
  async list() {
    const data = await this.application.client.api.application(
      "deploys/list",
      this.application.id
    );
    return data?.response;
  }
};

// src/managers/application/files.ts
import { join } from "path";
import { readFile as readFile2 } from "fs/promises";
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
      file = await readFile2(file);
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

// src/managers/application/network.ts
var ApplicationNetworkManager = class {
  constructor(application) {
    this.application = application;
  }
  /**
   * Integrates your website with a custom domain
   * - Requires [Senior plan](https://squarecloud.app/plans) or higher
   *
   * @param domain - The custom domain you want to use (e.g. yoursite.com)
   */
  async setCustomDomain(domain) {
    assertString(domain, "CUSTOM_DOMAIN");
    const data = await this.application.client.api.application(
      `network/custom/${encodeURIComponent(domain)}`,
      this.application.id,
      void 0,
      "POST"
    );
    return data.status === "success";
  }
  /**
   * Gets analytics for a custom domain
   * - Requires [Senior plan](https://squarecloud.app/plans) or higher
   * - Requires the application to have an integrated custom domain
   */
  async analytics() {
    const data = await this.application.client.api.application(
      "network/analytics",
      this.application.id
    );
    return data?.response;
  }
};

// src/managers/application/index.ts
var ApplicationManager = class {
  constructor(client) {
    this.client = client;
  }
  async get(applicationId) {
    const { response } = await this.client.api.user();
    const user = new User(this.client, response);
    this.client.emit("userUpdate", this.client.cache.user, user);
    this.client.cache.set("user", user);
    if (applicationId) {
      assertString(applicationId, "APP_ID");
      const application = user.applications.get(applicationId);
      if (!application) {
        throw new SquareCloudAPIError("APP_NOT_FOUND");
      }
      return application.fetch();
    }
    return user.applications;
  }
  /**
   * Uploads an application
   *
   * @param file - The zip file path or Buffer
   * @returns The uploaded application data
   */
  async create(file) {
    assertPathLike(file, "COMMIT_DATA");
    if (typeof file === "string") {
      file = await readFile3(file);
    }
    const formData = new FormData2();
    formData.append("file", file, { filename: "app.zip" });
    const data = await this.client.api.application(
      "upload",
      void 0,
      void 0,
      {
        method: "POST",
        body: formData.getBuffer(),
        headers: formData.getHeaders()
      }
    );
    return data.response;
  }
  /**
   * Returns the status for all your applications
   */
  async status() {
    const data = await this.client.api.application("all/status");
    return data.response.map(
      (status) => new SimpleApplicationStatus(this.client, status)
    );
  }
};

// src/managers/cache.ts
var CacheManager = class {
  constructor() {
    __publicField(this, "user");
  }
  set(key, value) {
    Reflect.set(this, key, value);
  }
  get(key) {
    return this[key];
  }
  clear() {
    Reflect.set(this, "user", void 0);
  }
};

// src/managers/user.ts
var UserManager = class {
  constructor(client) {
    this.client = client;
  }
  /**
   * Gets a user's informations
   *
   * @param userId - The user ID, if not provided it will get your own information
   */
  async get() {
    const { response } = await this.client.api.user();
    const user = new User(this.client, response);
    this.client.emit("userUpdate", this.client.cache.user, user);
    this.client.cache.set("user", user);
    return user;
  }
};
export {
  APIManager,
  ApplicationBackupManager,
  ApplicationCacheManager,
  ApplicationDeploysManager,
  ApplicationFilesManager,
  ApplicationManager,
  ApplicationNetworkManager,
  CacheManager,
  UserManager
};
//# sourceMappingURL=index.mjs.map