import LRUMap from 'mnemonist/lru-map';

/**
 * Cache instance singleton
 * It is hard cache, which means that there is no expiration, cache will be refreshed once server is restarted
 * Adjust size of cache accordingly to number of posts
 */
export const contentfulCache = new LRUMap<string, unknown>(50);
