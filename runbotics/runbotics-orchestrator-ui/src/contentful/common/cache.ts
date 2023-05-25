import LRUMap from 'mnemonist/lru-map';

type CacheKeys = `posts_${string}` | `categories_${string}` | `tags_${string}` | string;

/**
 * Cache instance singleton
 * It is hard cache, which means that there is no expiration, cache will be refreshed once server is restarted
 * Adjust size of cache accordingly to number of posts
 */
export function createCacheInstance() {
    return new LRUMap<CacheKeys, unknown>(53);
}

export const contentfulCache = {
    current: createCacheInstance(),
};
