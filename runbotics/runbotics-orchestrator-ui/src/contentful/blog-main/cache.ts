
import { contentfulCache } from '#contentful/common';

import { getAllCategories, getAllPosts } from './api';

type BlogPostsCache = Awaited<ReturnType<typeof getAllPosts>> & {
    categories: Awaited<ReturnType<typeof getAllCategories>>;
};

const BLOG_POSTS_CACHE_KEY = 'blog';

export function getBlogPostsCache() {
    return contentfulCache.get(BLOG_POSTS_CACHE_KEY) as BlogPostsCache | undefined;
}

export function setBlogPostsCache(cacheValue: BlogPostsCache) {
    contentfulCache.set(BLOG_POSTS_CACHE_KEY, cacheValue);
}
