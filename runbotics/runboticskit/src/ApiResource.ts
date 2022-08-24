export type ResourceMapper = {
    config: Record<string, string | string[]>;
    hardcoded?: Record<string, any>;
};

export interface ApiResource {
    url: string;
    method?: string;
    dataSelector?: string;
    mapper?: ResourceMapper;
}
