import { BlogPost, contentfulCache } from '#contentful/common';
import { Language } from '#src-app/translations/translations';

export function getPostCache(cacheKey: string, language: Language) {
    return contentfulCache[language].get(cacheKey) as BlogPost | undefined;
}

export function setPostCache(cacheKey: string, cacheValue: BlogPost, language: Language) {
    contentfulCache[language].set(cacheKey, cacheValue);
}
