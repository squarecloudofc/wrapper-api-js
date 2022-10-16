import { RawApplicationData, ApplicationStatusData } from '../typings';
import { APIManager } from '../APIManager';
export declare class Application {
    private apiManager;
    /** The application id */
    id: string;
    /** The application Discord tag */
    tag: string;
    /** The application total ram */
    ram: number;
    /**
     * The application programming language
     *
     * - 'javascript'
     * - 'typescript'
     * - 'python'
     * - 'java'
     */
    lang: 'javascript' | 'typescript' | 'python' | 'java';
    /** The application plan type (free' or 'paid') */
    type: 'free' | 'paid';
    /** The application avatar URL */
    avatar: string;
    /** The application current cluster */
    cluster: string;
    /** Whether the application is a website or not */
    isWebsite: boolean;
    constructor(apiManager: APIManager, data: RawApplicationData);
    /** Gets the application's current information */
    getStatus(): Promise<ApplicationStatusData>;
    /** Gets the application logs
     *
     * @param complete - Whether you want the complete logs (true) or the recent ones (false)
     */
    getLogs(complete?: boolean): Promise<any>;
    /** Generates the backup download URL */
    backup(): Promise<string>;
    /** Starts up the application */
    start(): Promise<boolean>;
    /** Stops the application */
    stop(): Promise<boolean>;
    /** Restarts the application */
    restart(): Promise<boolean>;
}