export type ResourceMapper = {
    config: Record<string, string | string[]>;
    hardcoded?: Record<string, any>;
};

export interface ApiResource {
    url: string;
    method?: string;
    headers?: Record<string, string>;
    dataSelector?: string;
    mapper?: ResourceMapper;
    body?: any;
}
