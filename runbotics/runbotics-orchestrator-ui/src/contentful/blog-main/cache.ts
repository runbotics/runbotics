import { getPost, setSinglePostCache } from '#contentful/blog-post';
import {
    BlogPost,
    CacheKey,
    Category,
    Tag,
    ContentfulCache,
} from '#contentful/common';
import { DEFAULT_LANG, Language, languages } from '#src-app/translations/translations';

import { getMainPage } from './api';
import { BlogMainCache } from './types';

export function getBlogPostsCache(language: Language = DEFAULT_LANG) {
    return ContentfulCache.getContentfulCache(language).get(CacheKey.Posts) as BlogPost[] | undefined;
}

export function setBlogPostsCache(language: Language, cacheValue: BlogPost[]) {
    ContentfulCache.getContentfulCache(language).set(CacheKey.Posts, cacheValue);
}

export function getBlogCategoriesCache(language: Language) {
    return ContentfulCache.getContentfulCache(language).get(CacheKey.Categories) as Category[] | undefined;
}

export function setBlogCategoriesCache(language: Language, cacheValue: Category[]) {
    ContentfulCache.getContentfulCache(language).set(CacheKey.Categories, cacheValue);
}

export function getBlogTagsCache(language: Language) {
    return ContentfulCache.getContentfulCache(language).get(CacheKey.Tags) as Tag[] | undefined;
}

export function setBlogTagsCache(language: Language, cacheValue: Tag[]) {
    ContentfulCache.getContentfulCache(language).set(CacheKey.Tags, cacheValue);
}

export function getBlogMainCache(
    language: Language = DEFAULT_LANG
): BlogMainCache {
    if (!isCached(language)) {
        return null;
    }

    const posts = getBlogPostsCache(language) ?? [];
    const featuredPost = posts ? posts[0] : null;
    const categories = getBlogCategoriesCache(language) ?? [];
    const tags = getBlogTagsCache(language) ?? [];

    return {
        posts,
        featuredPost,
        categories,
        tags,
    };
}

export function isCached(language: Language) {
    const contentfulCache = ContentfulCache.getContentfulCache(language);
    if (contentfulCache && contentfulCache.size > 0) return true;
    return false;
}

export async function recreateCache(language: Language = DEFAULT_LANG) {
    ContentfulCache.recreateCacheInstance();

    await Promise.allSettled(languages.map(async (lang) => {
        const modelMap = await getMainPage(lang);

        if (modelMap.posts) {
            const posts = modelMap.posts;

            setBlogPostsCache(lang, posts);

            await Promise.allSettled(posts.map(async (post) => {
                const singlePost = await getPost(lang, { slug: post.slug });
                setSinglePostCache(lang, singlePost);
            }));
        }
        if (modelMap.categories) {
            setBlogCategoriesCache(lang, modelMap.categories);
        }
        if (modelMap.tags) {
            setBlogTagsCache(lang, modelMap.tags);
        }
    }));

    return getBlogMainCache(language);
}

export function initializeContentfulCache() {
    ContentfulCache.initialize();
}
