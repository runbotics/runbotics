import LRUMap from 'mnemonist/lru-map';

import { Language } from '#src-app/translations/translations';

import { CacheKey } from './types';

type CacheKeys = CacheKey | string;
type ContentfulCache = Record<Language, LRUMap<CacheKeys, unknown>>;

const CONTENTFUL_CACHE_KEY = 'contentfulCache';
const contentfulCacheSymbol = Symbol.for(CONTENTFUL_CACHE_KEY);

/**
 * Cache instance singleton
 * It is hard cache, which means that there is no expiration, cache will be refreshed once server is restarted
 * Adjust size of cache accordingly to number of posts
 */

function createCacheInstance() {
    return new LRUMap<CacheKeys, unknown>(53);
}

function createMarketplaceCacheInstance() {
    return new LRUMap<CacheKeys, unknown>(5);
}

if (!global[contentfulCacheSymbol]) {
    global[contentfulCacheSymbol] = {
        en: createCacheInstance(),
        pl: createCacheInstance(),
    };
}

const contentfulCache = global[contentfulCacheSymbol] as ContentfulCache;

export { contentfulCache, createMarketplaceCacheInstance, createCacheInstance };
