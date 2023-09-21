import { BlogPost, ContentfulCache } from '#contentful/common';
import { Language } from '#src-app/translations/translations';

export function getSinglePostCache(language: Language, valueKey: BlogPost['slug']) {
    return ContentfulCache.getContentfulCache(language).get(valueKey) as BlogPost | undefined;
}

export function setSinglePostCache(language: Language, cacheValue: BlogPost) {
    ContentfulCache.getContentfulCache(language).set(cacheValue.slug, cacheValue);
}
