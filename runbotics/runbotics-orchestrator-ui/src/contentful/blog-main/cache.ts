import {
    BlogPost,
    Category,
    Tag,
    contentfulCache,
    createCacheInstance,
} from '#contentful/common';
import { Language } from '#src-app/translations/translations';

import { getMainPage } from './api';

function getCurrentDateString() {
    return new Date().toLocaleDateString();
}

export function getBlogPostsCache(language: Language = 'en') {
    return contentfulCache[language].get(`posts_${getCurrentDateString()}`) as
        | BlogPost[]
        | undefined;
}

export function setBlogPostsCache(language: Language, cacheValue: BlogPost[]) {
    contentfulCache[language].set(
        `posts_${getCurrentDateString()}`,
        cacheValue
    );
}

export function getBlogCategoriesCache(language: Language) {
    return contentfulCache[language].get(
        `categories_${getCurrentDateString()}`
    ) as Category[] | undefined;
}

export function setBlogCategoriesCache(
    language: Language,
    cacheValue: Category[]
) {
    contentfulCache[language].set(
        `categories_${getCurrentDateString()}`,
        cacheValue
    );
}

export function getBlogTagsCache(language: Language) {
    return contentfulCache[language].get(`tags_${getCurrentDateString()}`) as
        | Tag[]
        | undefined;
}

export function setBlogTagsCache(language: Language, cacheValue: Tag[]) {
    contentfulCache[language].set(`tags_${getCurrentDateString()}`, cacheValue);
}

export function getBlogMainCache(
    language: Language = 'en'
): Awaited<ReturnType<typeof getMainPage>> | null {
    if (!contentfulCache[language]) {
        return null;
    }

    if (!contentfulCache[language].size || !isCacheUpToDate(language)) {
        return null;
    }

    const posts = getBlogPostsCache(language);
    const featuredPost = posts[0];
    const categories = getBlogCategoriesCache(language) ?? [];
    const tags = getBlogTagsCache(language) ?? [];

    return {
        posts,
        featuredPost,
        categories,
        tags,
    };
}

export function setSinglePostCache(language: Language, post: BlogPost) {
    contentfulCache[language].set(
        `${post.slug}_${getCurrentDateString()}`,
        post
    );
}

export function getSinglePostCache(language: Language, cacheKey: string) {
    return contentfulCache[language].get(
        `${cacheKey}_${getCurrentDateString()}`
    ) as BlogPost | undefined;
}

export function isCacheUpToDate(language: Language) {
    const keys = Array.from(contentfulCache[language].keys());
    const blogKey = keys.find((key) => key.includes('posts'));
    if (!blogKey) {
        return false;
    }
    const latestCacheDate = blogKey.split('_')[1];

    return latestCacheDate === new Date().toLocaleDateString();
}

export async function recreateCache(language: Language) {
    contentfulCache[language] = createCacheInstance();
    const modelMap = await getMainPage(language);

    if (modelMap.posts) {
        setBlogPostsCache(language, modelMap.posts);
    }
    if (modelMap.categories) {
        setBlogCategoriesCache(language, modelMap.categories);
    }
    if (modelMap.tags) {
        setBlogTagsCache(language, modelMap.tags);
    }

    return {
        ...modelMap,
        posts: modelMap.posts ?? [],
        categories: modelMap.categories ?? [],
        tags: modelMap.tags ?? [],
    };
}
