import LRUMap from 'mnemonist/lru-map';

import { recreateBlogCache } from '#contentful/blog-main';
import { recreateMarketplaceCache } from '#contentful/marketplace-main';
import { DEFAULT_LANG, Language } from '#src-app/translations/translations';

import { CacheKey } from './types';


type CacheKeys = CacheKey | string;
type ContentfulCache = Record<Language, LRUMap<CacheKeys, unknown>>;

const CONTENTFUL_CACHE_KEY = 'contentfulCache';
const contentfulCacheSymbol = Symbol.for(CONTENTFUL_CACHE_KEY);

const BLOG_CACHE_SIZE = 53;
const MARKETPLACE_CACHE_SIZE = 12;

/**
 * Cache instance singleton
 * It is hard cache, which means that there is no expiration, cache will be refreshed once server is restarted
 * Adjust size of cache accordingly to number of posts and offers
 */

function createCacheInstance() {
    return new LRUMap<CacheKeys, unknown>(BLOG_CACHE_SIZE + MARKETPLACE_CACHE_SIZE);
}

if (!global[contentfulCacheSymbol]) {
    global[contentfulCacheSymbol] = {
        en: createCacheInstance(),
        pl: createCacheInstance(),
    };
}

const contentfulCache = global[contentfulCacheSymbol] as ContentfulCache;


const isCached = (lang: Language) => contentfulCache[lang] && contentfulCache[lang].size > 0;

const recreateCache = async (language: Language = DEFAULT_LANG) => {
    createCacheInstance();
    await recreateBlogCache(language);
    await recreateMarketplaceCache(language);
};

export { contentfulCache, recreateCache, isCached, createCacheInstance };
