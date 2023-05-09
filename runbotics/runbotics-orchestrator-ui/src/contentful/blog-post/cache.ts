import { contentfulCache } from '#contentful/common';

import { getPost } from './api';

type PostCache = Awaited<ReturnType<typeof getPost>>

export function getPostCache(cacheKey: string) {
    return contentfulCache.get(cacheKey) as PostCache | undefined;
}

export function setPostCache(cacheKey: string, cacheValue: PostCache) {
    contentfulCache.set(cacheKey, cacheValue);
}
