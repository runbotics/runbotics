
import { BlogPost, Category, Tag, contentfulCache, createCacheInstance } from '#contentful/common';

import { getMainPage } from './api';

function getCurrentDateString() {
    return new Date().toLocaleDateString();
}

export function getBlogPostsCache() {
    return contentfulCache.current.get(`posts_${getCurrentDateString()}`) as BlogPost[] | undefined;
}

export function setBlogPostsCache(cacheValue: BlogPost[]) {
    contentfulCache.current.set(`posts_${getCurrentDateString()}`, cacheValue);
}

export function getBlogCategoriesCache() {
    return contentfulCache.current.get(`categories_${getCurrentDateString()}`) as Category[] | undefined;
}

export function setBlogCategoriesCache(cacheValue: Category[]) {
    contentfulCache.current.set(`categories_${getCurrentDateString()}`, cacheValue);
}

export function getBlogTagsCache() {
    return contentfulCache.current.get(`tags_${getCurrentDateString()}`) as Tag[] | undefined;
}

export function setBlogTagsCache(cacheValue: Tag[]) {
    contentfulCache.current.set(`tags_${getCurrentDateString()}`, cacheValue);
}

export function getBlogMainCache(): Awaited<ReturnType<typeof getMainPage>> | null {
    if (!contentfulCache.current.size || !isCacheUpToDate()) return null;

    const posts = getBlogPostsCache();
    const featuredPost = posts[0];
    const categories = getBlogCategoriesCache() ?? [];
    const tags = getBlogTagsCache() ?? [];

    return {
        posts,
        featuredPost,
        categories,
        tags,
    };
}

export function setSinglePostCache(post: BlogPost) {
    contentfulCache.current.set(`${post.slug}_${getCurrentDateString()}`, post);
}

export function getSinglePostCache(cacheKey: string) {
    return contentfulCache.current.get(`${cacheKey}_${getCurrentDateString()}`) as BlogPost | undefined;
}

export function isCacheUpToDate() {
    const keys = Array.from(contentfulCache.current.keys());
    const blogKey = keys.find(key => key.includes('posts'));
    if (!blogKey) {
        return false;
    };
    const latestCacheDate = blogKey.split('_')[1];

    return latestCacheDate === new Date().toLocaleDateString();
}

export async function recreateCache() {
    contentfulCache.current = createCacheInstance();
    const modelMap = await getMainPage();

    if (modelMap.posts) {
        setBlogPostsCache(modelMap.posts);
    }
    if (modelMap.categories) {
        setBlogCategoriesCache(modelMap.categories);
    }
    if (modelMap.tags) {
        setBlogTagsCache(modelMap.tags);
    }

    return {
        ...modelMap,
        posts: modelMap.posts ?? [],
        categories: modelMap.categories ?? [],
        tags: modelMap.tags ?? [],
    };
}
