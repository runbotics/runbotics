export interface ById<T> {
    [Key: string]: T;
}

export interface Dictionary<T> {
    byId: ById<T>;
    allIds: string[];
}
