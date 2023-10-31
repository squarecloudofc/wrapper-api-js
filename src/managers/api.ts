import { APICommonPayload, APIUserInfo } from "@squarecloud/api-types/v2";
import { SquareCloudAPIError } from "../structures";
import { APIApplicationEndpoints } from "../types";

export class APIManager {
  public readonly baseUrl = "https://api.squarecloud.app";
  public readonly version = "v2";

  constructor(readonly apiKey: string) {}

  user(userId?: string): Promise<APICommonPayload<APIUserInfo>> {
    return this.fetch("user" + (userId ? `/${userId}` : ""));
  }

  application<T extends keyof APIApplicationEndpoints | (string & {})>(
    path: T,
    appId?: string,
    params?: Record<string, string>,
    options?: RequestInit | "GET" | "POST" | "DELETE",
  ): Promise<APICommonPayload<T extends keyof APIApplicationEndpoints ? APIApplicationEndpoints[T] : never>> {
    if (typeof options === "string") {
      options = {
        method: options,
      };
    }

    const url =
      "apps" +
      (appId ? `/${appId}` : "") +
      (path ? `/${path}` : "") +
      (params ? `?${new URLSearchParams(params)}` : "");

    return this.fetch(url, options);
  }

  async fetch<T>(path: string, options: RequestInit = {}): Promise<APICommonPayload<T>> {
    options.method = options.method || "GET";
    options.headers = {
      ...(options.headers || {}),
      Authorization: this.apiKey,
    };

    const res = await fetch(`${this.baseUrl}/${this.version}/${path}`, options).catch((err) => {
      throw new SquareCloudAPIError(err.code, err.message);
    });

    const data = await res.json();

    if (!data || data.status === "error" || !res.ok) {
      throw new SquareCloudAPIError(data?.code || "COMMON_ERROR");
    }

    return data;
  }
}
