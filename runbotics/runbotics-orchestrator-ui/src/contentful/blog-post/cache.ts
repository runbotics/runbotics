import { BlogPost, BlogPostCacheKey, contentfulCache } from '#contentful/common';

export function getPostCache(cacheKey: BlogPostCacheKey) {
    return contentfulCache.get(cacheKey) as BlogPost | undefined;
}

export function setPostCache(cacheKey: BlogPostCacheKey, cacheValue: BlogPost) {
    contentfulCache.set(cacheKey, cacheValue);
}
