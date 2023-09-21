import LRUMap from 'mnemonist/lru-map';

import { Language } from '#src-app/translations/translations';

import { CacheKey } from './types';

type CacheKeys = CacheKey | string;
type ContentfulCacheContent = Record<Language, LRUMap<CacheKeys, unknown>>;
type GlobalContentfulCache = typeof globalThis & { [key: symbol]: ContentfulCacheContent };

const CONTENTFUL_CACHE_KEY = 'contentfulCache';

/**
 * Cache instance singleton
 * It is hard cache, which means that there is no expiration, cache will be refreshed once server is restarted
 * Adjust size of cache accordingly to number of posts
 */

export class ContentfulCache {
    private static instance: ContentfulCache;
    private static globalContentfulCache: GlobalContentfulCache = global;
    private static sym: symbol = Symbol.for(CONTENTFUL_CACHE_KEY);

    private constructor() {}

    public static initialize() {
        if (!ContentfulCache.instance) {
            ContentfulCache.instance = new ContentfulCache();
            ContentfulCache.createCacheInstance();
        }
    }

    private static createInstance() {
        return new LRUMap<CacheKeys, unknown>(53);
    }

    private static createCacheInstance() {
        ContentfulCache.globalContentfulCache[ContentfulCache.sym] = {
            en: ContentfulCache.createInstance(),
            pl: ContentfulCache.createInstance(),
        };
    }

    public static recreateCacheInstance() {
        ContentfulCache.createCacheInstance();
    }

    public static getContentfulCache(language: Language) {
        return ContentfulCache.globalContentfulCache[ContentfulCache.sym][language];
    }
}
