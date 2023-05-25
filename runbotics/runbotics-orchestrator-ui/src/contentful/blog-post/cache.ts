import { BlogPost, contentfulCache } from '#contentful/common';

export function getPostCache(cacheKey: string) {
    return contentfulCache.current.get(cacheKey) as BlogPost | undefined;
}

export function setPostCache(cacheKey: string, cacheValue: BlogPost) {
    contentfulCache.current.set(cacheKey, cacheValue);
}
