import { DesktopRunRequest } from '@runbotics/runbotics-sdk';

export type ResourceMapper = {
    config: Record<string, string | string[]>;
    hardcoded?: Record<string, any>;
};

export interface ApiRequestInput {
    url: string;
    method?: string;
    headers?: Record<string, string>;
    dataSelector?: string;
    mapper?: ResourceMapper;
    body?: any;
}

export type ApiRequestActionRequest =
| DesktopRunRequest<'api.request', ApiRequestInput>
| DesktopRunRequest<'api.downloadFile', ApiDownloadFileInput>;

export type ApiRequestOutput<T> = {
    data: T;
    status: number;
    statusText: string;
};

export type ApiDownloadFileOutput = string;

export type ApiDownloadFileInput = {
    url: string;
};
