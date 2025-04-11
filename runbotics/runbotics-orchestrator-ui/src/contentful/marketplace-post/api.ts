import { fetchGraphQL, IS_PREVIEW_MODE } from '#contentful/common';

import { Language } from '#src-app/translations/translations';

import { extractMarketplaceOffer } from './extractors';
import { buildOfferQuery } from './queries';
import { GetOfferOptions, GetOfferResponse } from './types';

export async function getOffer(locale: Language, options: GetOfferOptions) {
    const entry = await fetchGraphQL<GetOfferResponse>(
        buildOfferQuery({
            preview: IS_PREVIEW_MODE,
            language: locale,
            ...options,
        }),
    );

    return extractMarketplaceOffer(entry);
}
