import { BlogPost, contentfulCache } from '#contentful/common';
import { Language } from '#src-app/translations/translations';

export function getSinglePostCache(language: Language, valueKey: BlogPost['slug']) {
    return contentfulCache[language].get(valueKey) as BlogPost | undefined;
}

export function setSinglePostCache(language: Language, cacheValue: BlogPost) {
    contentfulCache[language].set(cacheValue.slug, cacheValue);
}
