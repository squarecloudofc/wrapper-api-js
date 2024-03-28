import { APIVersion, APIPayload, APIUserInfo } from '@squarecloud/api-types/v2';
import { APIApplicationEndpoints } from '../types/api.js';

declare class APIManager {
    readonly apiKey: string;
    readonly baseUrl = "https://api.squarecloud.app";
    readonly version: APIVersion<1 | 2>;
    constructor(apiKey: string);
    user(userId?: string): Promise<APIPayload<APIUserInfo>>;
    application<T extends keyof APIApplicationEndpoints | (string & {})>(path: T, appId?: string, params?: Record<string, string>, options?: RequestInit | "GET" | "POST" | "DELETE"): Promise<APIPayload<T extends keyof APIApplicationEndpoints ? APIApplicationEndpoints[T] : never>>;
    fetch<T>(path: string, options?: RequestInit): Promise<APIPayload<T>>;
}

export { APIManager };
