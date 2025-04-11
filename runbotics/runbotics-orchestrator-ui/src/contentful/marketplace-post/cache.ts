import { contentfulCache, MarketplaceOffer } from '#contentful/common';
import { Language } from '#src-app/translations/translations';

export function getSingleMarketplaceOfferCache(language: Language, valueKey: MarketplaceOffer['slug']) {
    return contentfulCache[language].get(valueKey) as MarketplaceOffer | undefined;
}

export function setSingleOfferCache(language: Language, cacheValue: MarketplaceOffer) {
    contentfulCache[language].set(cacheValue.slug, cacheValue);
}
