import { getPost, setSinglePostCache } from '#contentful/blog-post';
import { BlogPost, CacheKey, Category, contentfulCache, isCached, Tag } from '#contentful/common';
import { getOffer } from '#contentful/marketplace-post';
import { DEFAULT_LANG, Language, languages } from '#src-app/translations/translations';

import { getMainPage } from './api';
import { BlogMainCache } from './types';


export function getBlogPostsCache(language: Language = DEFAULT_LANG) {
    return contentfulCache[language].get(CacheKey.Posts) as BlogPost[] | undefined;
}

export function setBlogPostsCache(language: Language, cacheValue: BlogPost[]) {
    contentfulCache[language].set(CacheKey.Posts, cacheValue);
}

export function getBlogCategoriesCache(language: Language) {
    return contentfulCache[language].get(CacheKey.Categories) as Category[] | undefined;
}

export function setBlogCategoriesCache(language: Language, cacheValue: Category[]) {
    contentfulCache[language].set(CacheKey.Categories, cacheValue);
}

export function getBlogTagsCache(language: Language) {
    return contentfulCache[language].get(CacheKey.Tags) as Tag[] | undefined;
}

export function setBlogTagsCache(language: Language, cacheValue: Tag[]) {
    contentfulCache[language].set(CacheKey.Tags, cacheValue);
}

export function getBlogMainCache(
    language: Language = DEFAULT_LANG,
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

export async function transformContentfulResponse() {
    const result: { en: Partial<BlogMainCache>; pl: Partial<BlogMainCache> } = {
        en: {},
        pl: {}
    };

    await Promise.allSettled(languages.map(async (lang) => {
        const modelMap = await getMainPage(lang);

        if (modelMap.posts) {
            result[lang].posts = modelMap.posts;

            await Promise.allSettled(modelMap.posts.map(async (post) => {
                const singlePost = await getOffer(lang, { slug: post.slug });

                if (!result[lang]) {
                    result[lang] = {};
                }

                result[lang][post.slug] = singlePost;
            }));
        }

        if (modelMap.tags) {
            result[lang].tags = modelMap.tags;
        }

        if (modelMap.categories) {
            result[lang].categories = modelMap.categories;
        }
    }));

    return result;
}

export async function recreateBlogCache(language: Language = DEFAULT_LANG) {
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
