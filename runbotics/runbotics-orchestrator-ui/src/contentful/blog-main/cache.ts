import {
    BlogPost,
    BlogPostsBySlug,
    Category,
    Tag,
    contentfulCache,
    createCacheInstance,
} from '#contentful/common';
import { Language } from '#src-app/translations/translations';

import { getMainPage } from './api';
import { GetBlogMainCache } from './types';

export function getBlogPostsCache(language: Language = 'en') {
    return contentfulCache[language].get('posts') as BlogPost[] | undefined;
}

export function setBlogPostsCache(language: Language, cacheValue: BlogPost[]) {
    contentfulCache[language].set('posts', cacheValue);
}

export function getSinglePostCacheBySlug(language: Language, cacheKey: string) {
    return contentfulCache[language].get('postsBySlug')[cacheKey] as BlogPost | undefined;
}

export function getBlogPostsCacheBySlug(language: Language = 'en') {
    return contentfulCache[language].get('postsBySlug') as BlogPostsBySlug | undefined;
}

export function setBlogPostsCacheBySlug(language: Language, cacheValue: BlogPostsBySlug) {
    contentfulCache[language].set('postsBySlug', cacheValue);
}

export function getBlogCategoriesCache(language: Language) {
    return contentfulCache[language].get('categories') as Category[] | undefined;
}

export function setBlogCategoriesCache(language: Language, cacheValue: Category[]) {
    contentfulCache[language].set('categories', cacheValue);
}

export function getBlogTagsCache(language: Language) {
    return contentfulCache[language].get('tags') as Tag[] | undefined;
}

export function setBlogTagsCache(language: Language, cacheValue: Tag[]) {
    contentfulCache[language].set('tags', cacheValue);
}

export function getBlogMainCache(
    language: Language = 'en'
): GetBlogMainCache | null {
    if (!isCached(language)) {
        return null;
    }

    const posts = getBlogPostsCache(language) ?? [];
    const postsBySlug = getBlogPostsCacheBySlug(language) ?? {};
    const featuredPost = posts ? posts[0] : null;
    const categories = getBlogCategoriesCache(language) ?? [];
    const tags = getBlogTagsCache(language) ?? [];

    return {
        posts,
        postsBySlug,
        featuredPost,
        categories,
        tags,
    };
}

export function isCached(language: Language) {
    if (contentfulCache[language] && contentfulCache[language].size > 0) return true;
    return false;
}

export async function recreateCache(language: Language) {
    contentfulCache[language] = createCacheInstance();
    const modelMap = await getMainPage(language);

    if (modelMap.posts) {
        const posts = modelMap.posts;
        const postsBySlug = posts.reduce((prevPost, currPost) => ({
            ...prevPost,
            [currPost.slug]: currPost
        }), {});

        setBlogPostsCache(language, posts);
        setBlogPostsCacheBySlug(language, postsBySlug);
    }
    if (modelMap.categories) {
        setBlogCategoriesCache(language, modelMap.categories);
    }
    if (modelMap.tags) {
        setBlogTagsCache(language, modelMap.tags);
    }

    return getBlogMainCache(language);
}
