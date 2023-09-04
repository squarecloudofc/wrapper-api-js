import FormData from 'form-data';
import { readFile } from 'fs/promises';
import { validatePathLike, validateString } from '../assertions';
import Application from '../structures/application';
import Collection from '../structures/collection';
import SquareCloudAPIError from '../structures/error';
import { FullUser } from '../structures/user';
import { APIResponse, UploadedApplicationResponse } from '../types';
import APIManager from './api';

export default class ApplicationManager {
  constructor(private readonly apiManager: APIManager) {}

  /**
   * If the ID is provided, it will return an application that you can manage or get information
   * If the ID is not provided, it will return a collection of applications
   *
   * @param appId - The application ID, you must own the application
   */
  async get(): Promise<Collection<string, Application>>;
  async get(appId: string): Promise<Application>;
  async get(
    appId?: string,
  ): Promise<Application | Collection<string, Application>> {
    const { response } = await this.apiManager.user();
    const { applications } = new FullUser(this.apiManager, response);

    if (appId) {
      validateString(appId, 'APP_ID');
      const application = applications.get(appId);

      if (!application) {
        throw new SquareCloudAPIError('APP_NOT_FOUND');
      }

      return application;
    }

    return applications;
  }

  /**
   * Uploads an application
   *
   * @param file - The zip file path or Buffer
   * @returns The uploaded application data
   */
  async create(file: string | Buffer): Promise<UploadedApplicationResponse> {
    validatePathLike(file, 'COMMIT_DATA');

    if (typeof file === 'string') {
      file = await readFile(file);
    }

    const formData = new FormData();
    formData.append('file', file, { filename: 'app.zip' });

    const data = <APIResponse<UploadedApplicationResponse>>(
      await this.apiManager.fetch('apps/upload', {
        method: 'POST',
        body: formData.getBuffer(),
        headers: formData.getHeaders(),
      })
    );

    return data?.response;
  }
}
