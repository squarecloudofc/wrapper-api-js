import { Application, Collection, SquareCloudAPI, SquareCloudAPIError, User } from "@";
import { validatePathLike, validateString } from "@/assertions";
import { BaseApplication } from "@/structures/application/base";
import { APIApplicationStatusAll, RESTPostAPIApplicationUploadResult } from "@squarecloud/api-types/v2";
import FormData from "form-data";
import { readFile } from "fs/promises";

export class ApplicationManager {
  constructor(public readonly client: SquareCloudAPI) {}

  /**
   * If the ID is provided, it will return an application that you can manage or get information
   * If the ID is not provided, it will return a collection of applications
   *
   * @param appId - The application ID, you must own the application
   */
  async get(): Promise<Collection<string, BaseApplication>>;
  async get(applicationId: string): Promise<Application>;
  async get(applicationId?: string): Promise<Application | Collection<string, BaseApplication>> {
    const { response } = await this.client.api.user();
    const user = new User(this.client, response);

    this.client.emit("userUpdate", this.client.cache.user, user);
    this.client.cache.set("user", user);

    if (applicationId) {
      validateString(applicationId, "APP_ID");
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
  async create(file: string | Buffer): Promise<RESTPostAPIApplicationUploadResult> {
    validatePathLike(file, "COMMIT_DATA");

    if (typeof file === "string") {
      file = await readFile(file);
    }

    const formData = new FormData();
    formData.append("file", file, { filename: "app.zip" });

    const data = await this.client.api.application("upload", undefined, undefined, {
      method: "POST",
      body: formData.getBuffer(),
      headers: formData.getHeaders(),
    });

    return data.response;
  }

  /**
   * Returns the status for all your applications
   */
  async status(): Promise<APIApplicationStatusAll[]> {
    const data = await this.client.api.application("all/status");

    return data.response;
  }
}

export * from "./backup";
export * from "./cache";
export * from "./deploys";
export * from "./files";
export * from "./network";
