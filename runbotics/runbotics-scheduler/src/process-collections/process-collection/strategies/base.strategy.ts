export interface CollectionStrategy<T = any> {
    execute(...args: any[]): Promise<T>;
}
