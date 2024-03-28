import { APIApplication, APIWebsiteApplication, RESTPostAPIApplicationUploadResult, APIApplicationStatus, APIApplicationLogs, APIApplicationBackup, APIListedFile, APIReadFile, APIApplicationStatusAll, APINetworkAnalytics, APIDeploy, RESTPostAPIGithubWebhookResult } from '@squarecloud/api-types/v2';

interface APIApplicationEndpoints {
    "": APIApplication | APIWebsiteApplication;
    upload: RESTPostAPIApplicationUploadResult;
    status: APIApplicationStatus;
    logs: APIApplicationLogs;
    backup: APIApplicationBackup;
    "files/list": APIListedFile[];
    "files/read": APIReadFile;
    "all/status": APIApplicationStatusAll[];
    "network/analytics": APINetworkAnalytics;
    "deploys/list": APIDeploy[];
    "deploy/git-webhook": RESTPostAPIGithubWebhookResult;
}

export type { APIApplicationEndpoints };
