import { CacheKey, contentfulCache, Industry, isCached, MarketplaceOffer, Tag } from '#contentful/common';
import { MarketplaceMainCache } from '#contentful/marketplace-main/types';
import { getOffer, setSingleOfferCache } from '#contentful/marketplace-post';
import { DEFAULT_LANG, Language, languages } from '#src-app/translations/translations';

import { getMainPage } from './api';

export function getMarketplaceOffersCache(language: Language = DEFAULT_LANG) {
    return contentfulCache[language].get(CacheKey.Offers) as MarketplaceOffer[] | undefined;
}

export function setMarketplaceOffersCache(language: Language, cacheValue: MarketplaceOffer[]) {
    contentfulCache[language].set(CacheKey.Offers, cacheValue);
}

export function getMarketplaceIndustriesCache(language: Language) {
    return contentfulCache[language].get(CacheKey.Industries) as Industry[] | undefined;
}

export function setMarketplaceIndustriesCache(language: Language, cacheValue: Industry[]) {
    contentfulCache[language].set(CacheKey.Industries, cacheValue);
}

export function getMarketplaceTagsCache(language: Language) {
    return contentfulCache[language].get(CacheKey.MarketplaceTags) as Tag[] | undefined;
}

export function setMarketplaceTagsCache(language: Language, cacheValue: Tag[]) {
    contentfulCache[language].set(CacheKey.MarketplaceTags, cacheValue);
}

export function getMarketplaceMainCache(
    language: Language = DEFAULT_LANG,
): MarketplaceMainCache {
    if (!isCached(language)) {
        return null;
    }

    const offers = getMarketplaceOffersCache(language) ?? [];
    //featuredOffer left as null in case future requirements will contain to do featured offer card
    const featuredOffer = null;
    const industries = getMarketplaceIndustriesCache(language) ?? [];
    const tags = getMarketplaceTagsCache(language) ?? [];

    return {
        offers,
        featuredOffer,
        industries,
        tags,
    };
}

export async function transformContentfulResponse(language: Language = DEFAULT_LANG) {
    const result: { en: Partial<MarketplaceMainCache>; pl: Partial<MarketplaceMainCache> } = {
        en: {},
        pl: {}
    };

    await Promise.allSettled(languages.map(async (lang) => {
        const modelMap = await getMainPage(lang);

        if (modelMap.offers) {
            result[lang].offers = modelMap.offers;

            await Promise.allSettled(modelMap.offers.map(async (offer) => {
                const singleOffer = await getOffer(lang, { slug: offer.slug });

                if (!result[lang]) {
                    result[lang] = {};
                }

                result[lang][offer.slug] = singleOffer;
            }));
        }

        if (modelMap.industries) {
            result[lang].industries = modelMap.industries;
        }

        if (modelMap.tags) {
            result[lang].tags = modelMap.tags;
        }
    }));

    return result;
}

export async function recreateMarketplaceCache(language: Language = DEFAULT_LANG) {
    await Promise.allSettled(languages.map(async (lang) => {
        const modelMap = await getMainPage(lang);
        if (modelMap.offers) {
            const offers = modelMap.offers;

            setMarketplaceOffersCache(lang, offers);

            await Promise.allSettled(offers.map(async (offer) => {
                const singleOffer = await getOffer(lang, { slug: offer.slug });
                setSingleOfferCache(lang, singleOffer);
            }));
        }
        if (modelMap.industries) {
            setMarketplaceIndustriesCache(lang, modelMap.industries);
        }
        if (modelMap.tags) {
            setMarketplaceTagsCache(lang, modelMap.tags);
        }
    }));

    return getMarketplaceMainCache(language);
}
