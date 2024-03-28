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

// src/structures/index.ts
var structures_exports = {};
__export(structures_exports, {
  Application: () => Application3,
  ApplicationStatus: () => ApplicationStatus,
  BaseApplication: () => BaseApplication2,
  Collection: () => Collection2,
  SimpleApplicationStatus: () => SimpleApplicationStatus,
  SquareCloudAPIError: () => SquareCloudAPIError,
  User: () => User,
  WebsiteApplication: () => WebsiteApplication
});
module.exports = __toCommonJS(structures_exports);

// src/assertions/application.ts
var import_v2 = require("@squarecloud/api-types/v2");
var z = __toESM(require("zod"));

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

// src/assertions/application.ts
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

// src/assertions/literal.ts
var z2 = __toESM(require("zod"));
var stringSchema = z2.coerce.string();
var booleanSchema = z2.coerce.boolean();
var pathLikeSchema = z2.string().or(z2.instanceof(Buffer));
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

// src/managers/application/index.ts
var import_form_data = __toESM(require("form-data"));

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
var import_path = require("path");
var import_promises = require("fs/promises");
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
      file = await (0, import_promises.readFile)(file);
    }
    path = (0, import_path.join)(path, fileName).replaceAll("\\", "/");
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

// src/structures/application/application.ts
var import_form_data2 = __toESM(require("form-data"));
var import_promises2 = require("fs/promises");
var Application3 = class {
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
      file = await (0, import_promises2.readFile)(file);
    }
    const formData = new import_form_data2.default();
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
var WebsiteApplication = class extends Application3 {
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
var BaseApplication2 = class {
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
    return new Application3(this.client, data.response);
  }
};

// src/structures/collection.ts
var Collection2 = class extends Map {
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
    this.applications = new Collection2(
      applications.map((app) => [app.id, new BaseApplication2(client, app)])
    );
  }
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  Application,
  ApplicationStatus,
  BaseApplication,
  Collection,
  SimpleApplicationStatus,
  SquareCloudAPIError,
  User,
  WebsiteApplication
});
//# sourceMappingURL=index.js.map