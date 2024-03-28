import { Collection } from './structures/collection.mjs';
export { CollectionConstructor } from './structures/collection.mjs';
export { SquareCloudAPIError } from './structures/error.mjs';
import { APIManager } from './managers/api.mjs';
export { APIApplicationEndpoints } from './types/api.mjs';
import { UserPlan } from './types/user.mjs';
import * as _squarecloud_api_types_v2 from '@squarecloud/api-types/v2';
import { APIWebsiteApplication, ApplicationLanguage, APIApplication, APIUserApplication, APIApplicationStatusAll, ApplicationStatus as ApplicationStatus$1, APIApplicationStatus, APIUserInfo, RESTPostAPIApplicationUploadResult } from '@squarecloud/api-types/v2';
import { ApplicationStatusUsage } from './types/application.mjs';

declare class ApplicationBackupManager {
    readonly application: Application;
    constructor(application: Application);
    /** @returns The generated backup URL */
    url(): Promise<string>;
    /** @returns The generated backup buffer */
    download(): Promise<Buffer>;
}

/**
 * Represents a Square Cloud application
 *
 * @constructor
 * @param client - The client for this application
 * @param data - The data from this application
 */
declare class WebsiteApplication extends Application {
    readonly client: SquareCloudAPI;
    /** The application default domain (e.g. example.squareweb.app) */
    domain: string;
    /** The custom configured domain (e.g. yoursite.com) */
    custom?: string;
    /** Network manager for this application */
    network: ApplicationNetworkManager;
    constructor(client: SquareCloudAPI, data: APIWebsiteApplication);
}

/**
 * Represents a Square Cloud application
 *
 * @constructor
 * @param client - The client for this application
 * @param data - The data from this application
 */
declare class Application {
    readonly client: SquareCloudAPI;
    /** The application ID */
    id: string;
    /** The application display name */
    name: string;
    /** The application description */
    description?: string;
    /** The url to manage the application via web */
    url: string;
    /** The application current cluster */
    cluster: string;
    /** The application total ram */
    ram: number;
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
    language: ApplicationLanguage;
    /** Files manager for this application */
    files: ApplicationFilesManager;
    /** Backup manager for this application */
    backup: ApplicationBackupManager;
    /** Deploys manager for this application */
    deploys: ApplicationDeploysManager;
    /** Cache manager for this application */
    cache: ApplicationCacheManager;
    constructor(client: SquareCloudAPI, data: APIApplication);
    /** @returns The application current status information */
    getStatus(): Promise<ApplicationStatus>;
    /** @returns The application logs */
    getLogs(): Promise<string>;
    /**
     * Starts up the application
     * @returns `true` for success or `false` for fail
     */
    start(): Promise<boolean>;
    /**
     * Stops the application
     * @returns `true` for success or `false` for fail
     */
    stop(): Promise<boolean>;
    /**
     * Restarts the application
     * @returns `true` for success or `false` for fail
     */
    restart(): Promise<boolean>;
    /**
     * Deletes your whole application
     *
     * - This action is irreversible.
     * @returns `true` for success or `false` for fail
     */
    delete(): Promise<boolean>;
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
    commit(file: string | Buffer, fileName?: string, restart?: boolean): Promise<boolean>;
    isWebsite(): this is WebsiteApplication;
}

/**
 * Represents the base application from the user endpoint
 *
 * @constructor
 * @param client - The client for this application
 * @param data - The data from this application
 */
declare class BaseApplication {
    readonly client: SquareCloudAPI;
    id: string;
    tag: string;
    description?: string | undefined;
    url: string;
    ram: number;
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
    language: ApplicationLanguage;
    cluster: string;
    isWebsite: boolean;
    constructor(client: SquareCloudAPI, data: APIUserApplication);
    fetch(): Promise<Application>;
}

declare class SimpleApplicationStatus<R extends boolean = boolean> {
    readonly client: SquareCloudAPI;
    /** The application's ID this status came from */
    applicationId: string;
    /** Usage statuses for this application */
    usage: R extends true ? Pick<ApplicationStatusUsage, "cpu" | "ram"> : undefined;
    /** Whether the application is running or not */
    running: R;
    constructor(client: SquareCloudAPI, data: APIApplicationStatusAll);
    fetch(): Promise<ApplicationStatus>;
}
declare class ApplicationStatus {
    readonly client: SquareCloudAPI;
    /** The application's ID this status came from */
    applicationId: string;
    /** Usage statuses for this application */
    usage: ApplicationStatusUsage;
    /** Whether the application is running or not */
    running: boolean;
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
    status: ApplicationStatus$1;
    /** How many requests have been made since the last start up */
    requests: number;
    /** For how long the app is running in millisseconds */
    uptimeTimestamp?: number;
    /** For how long the app is running */
    uptime?: Date;
    constructor(client: SquareCloudAPI, data: APIApplicationStatus, applicationId: string);
}

/**
 * Represents a Square Cloud user
 *
 * @constructor
 * @param client - The client for this user
 * @param data - The data from this user
 */
declare class User {
    /** The user's id */
    id: string;
    /** The user's Discord tag */
    tag: string;
    /** The user's current plan */
    plan: UserPlan;
    /** The user's registered email */
    email: string;
    /** The user's registered applications Collection */
    applications: Collection<string, BaseApplication>;
    constructor(client: SquareCloudAPI, data: APIUserInfo);
}

type ApplicationCacheKey = "status" | "backup" | "logs";
declare class ApplicationCacheManager {
    readonly status?: ApplicationStatus;
    readonly backup?: string;
    readonly logs?: string;
    set<T extends ApplicationCacheKey>(key: T, value: ApplicationCacheManager[T]): void;
    get<T extends ApplicationCacheKey>(key: T): ApplicationCacheManager[T];
    clear(key?: ApplicationCacheKey): void;
}

declare class ApplicationDeploysManager {
    readonly application: Application;
    constructor(application: Application);
    /**
     * Integrates Square Cloud with GitHub webhooks
     *
     * @param accessToken - The access token for your GitHub repository. You can find this in your [GitHub Tokens Classic](https://github.com/settings/tokens/new)
     */
    getGithubWebhook(accessToken: string): Promise<string>;
    /**
     * Gets the last 10 deployments of an application from the last 24 hours
     */
    list(): Promise<_squarecloud_api_types_v2.APIDeploy[]>;
}

declare class ApplicationFilesManager {
    readonly application: Application;
    constructor(application: Application);
    /**
     * Lists the files inside a directory
     *
     * @param path - The absolute directory path
     */
    list(path?: string): Promise<_squarecloud_api_types_v2.APIListedFile[]>;
    /**
     * Reads the specified file content
     *
     * @param path - The absolute file path
     */
    read(path: string): Promise<Buffer | undefined>;
    /**
     * Creates a new file
     *
     * @param file - The file content
     * @param fileName - The file name with extension
     * @param path - The absolute file path
     */
    create(file: string | Buffer, fileName: string, path?: string): Promise<boolean>;
    /**
     * Deletes the specified file or directory
     *
     * @param path - The absolute file or directory path
     */
    delete(path: string): Promise<boolean>;
}

declare class ApplicationNetworkManager {
    readonly application: WebsiteApplication;
    constructor(application: WebsiteApplication);
    /**
     * Integrates your website with a custom domain
     * - Requires [Senior plan](https://squarecloud.app/plans) or higher
     *
     * @param domain - The custom domain you want to use (e.g. yoursite.com)
     */
    setCustomDomain(domain: string): Promise<boolean>;
    /**
     * Gets analytics for a custom domain
     * - Requires [Senior plan](https://squarecloud.app/plans) or higher
     * - Requires the application to have an integrated custom domain
     */
    analytics(): Promise<_squarecloud_api_types_v2.APINetworkAnalytics>;
}

declare class ApplicationManager {
    readonly client: SquareCloudAPI;
    constructor(client: SquareCloudAPI);
    /**
     * If the ID is provided, it will return an application that you can manage or get information
     * If the ID is not provided, it will return a collection of applications
     *
     * @param appId - The application ID, you must own the application
     */
    get(): Promise<Collection<string, BaseApplication>>;
    get(applicationId: string): Promise<Application>;
    /**
     * Uploads an application
     *
     * @param file - The zip file path or Buffer
     * @returns The uploaded application data
     */
    create(file: string | Buffer): Promise<RESTPostAPIApplicationUploadResult>;
    /**
     * Returns the status for all your applications
     */
    status(): Promise<SimpleApplicationStatus[]>;
}

type CacheKey = "user";
declare class CacheManager {
    readonly user?: User;
    set<T extends CacheKey>(key: T, value: CacheManager[T]): void;
    get<T extends CacheKey>(key: T): CacheManager[T];
    clear(): void;
}

declare class UserManager {
    readonly client: SquareCloudAPI;
    constructor(client: SquareCloudAPI);
    /**
     * Gets a user's informations
     *
     * @param userId - The user ID, if not provided it will get your own information
     */
    get(): Promise<User>;
}

declare class TypedEventEmitter<TEvents extends Record<string, any>> {
    private emitter;
    emit<TEventName extends keyof TEvents & string>(eventName: TEventName, ...eventArg: TEvents[TEventName]): void;
    on<TEventName extends keyof TEvents & string>(eventName: TEventName, handler: (...eventArg: TEvents[TEventName]) => void): void;
    off<TEventName extends keyof TEvents & string>(eventName: TEventName, handler: (...eventArg: TEvents[TEventName]) => void): void;
}
interface ClientEvents {
    logsUpdate: [
        application: Application,
        before: string | undefined,
        after: string
    ];
    backupUpdate: [
        application: Application,
        before: string | undefined,
        after: string
    ];
    statusUpdate: [
        application: Application,
        before: ApplicationStatus | undefined,
        after: ApplicationStatus
    ];
    userUpdate: [before: User | undefined, after: User];
}

declare class SquareCloudAPI extends TypedEventEmitter<ClientEvents> {
    static apiInfo: {
        latestVersion: string;
        baseUrl: string;
    };
    readonly api: APIManager;
    /** The applications manager */
    applications: ApplicationManager;
    /** The users manager */
    users: UserManager;
    /** The global cache manager */
    cache: CacheManager;
    /**
     * Creates an API instance
     *
     * @param apiKey - Your API Token (generate at [Square Cloud Dashboard](https://squarecloud.app/dashboard))
     * @param options.experimental - Whether to enable experimental features
     */
    constructor(apiKey: string);
}

export { APIManager, Application, ApplicationBackupManager, type ApplicationCacheKey, ApplicationCacheManager, ApplicationDeploysManager, ApplicationFilesManager, ApplicationManager, ApplicationNetworkManager, ApplicationStatus, BaseApplication, type CacheKey, CacheManager, type ClientEvents, Collection, SimpleApplicationStatus, SquareCloudAPI, TypedEventEmitter, User, UserManager, WebsiteApplication };
