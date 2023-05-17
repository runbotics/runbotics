
import { BlogPost, Category, Tag, contentfulCache } from '#contentful/common';

import { getMainPage } from './api';

function getCurrentDateString() {
    return new Date().toLocaleDateString();
}

export function getBlogPostsCache() {
    return contentfulCache.get(`posts_${getCurrentDateString()}`) as BlogPost[] | undefined;
}

export function setBlogPostsCache(cacheValue: BlogPost[]) {
    contentfulCache.set(`posts_${getCurrentDateString()}`, cacheValue);
}

export function getBlogCategoriesCache() {
    return contentfulCache.get(`categories_${getCurrentDateString()}`) as Category[] | undefined;
}

export function setBlogCategoriesCache(cacheValue: Category[]) {
    contentfulCache.set(`categories_${getCurrentDateString()}`, cacheValue);
}

export function getBlogTagsCache() {
    return contentfulCache.get(`tags_${getCurrentDateString()}`) as Tag[] | undefined;
}

export function setBlogTagsCache(cacheValue: Tag[]) {
    contentfulCache.set(`tags_${getCurrentDateString()}`, cacheValue);
}

export function getBlogMainCache(): Awaited<ReturnType<typeof getMainPage>> | null {
    if (!contentfulCache.size || !isCacheUpToDate()) return null;

    const posts = getBlogPostsCache();
    const featuredPost = posts[0];
    const categories = getBlogCategoriesCache();
    const tags = getBlogTagsCache();

    return {
        posts,
        featuredPost,
        categories,
        tags,
    };
}

export function setSinglePostCache(post: BlogPost) {
    contentfulCache.set(`${post.slug}_${getCurrentDateString()}`, post);
}

export function getSinglePostCache(cacheKey: string) {
    return contentfulCache.get(`${cacheKey}_${getCurrentDateString()}`) as BlogPost | undefined;
}

export function isCacheUpToDate() {
    const keys = Array.from(contentfulCache.keys());
    const blogKey = keys.find(key => key.includes('posts'));
    if (!blogKey) {
        return false;
    };
    const latestCacheDate = blogKey.split('_')[1];

    return latestCacheDate === new Date().toLocaleDateString();
}

export async function recreateCache() {
    contentfulCache.clear();
    const modelMap = await getMainPage();
    modelMap.posts && setBlogPostsCache(modelMap.posts);
    modelMap.categories && setBlogCategoriesCache(modelMap.categories);
    modelMap.tags && setBlogTagsCache(modelMap.tags);

    return modelMap;
}
