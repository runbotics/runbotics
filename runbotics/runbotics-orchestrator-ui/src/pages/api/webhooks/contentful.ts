import _ from 'lodash';

import {
    getMarketplaceMainCache,
    recreateMarketplaceCache,
    transformContentfulResponse,
} from '#contentful/marketplace-main';
import { languages } from '#src-app/translations/translations';

enum ContentTypeId {
    MARKETPLACE_OFFER = 'marketplaceOffer'
}

interface RequestBody {
    contentTypeId: ContentTypeId;
}

export default async function handler(req, res) {
    const body = JSON.parse(req.body) as RequestBody;
    console.log(body);
    switch (body.contentTypeId) {
        case ContentTypeId.MARKETPLACE_OFFER:
            const marketplaceContentful = await transformContentfulResponse();
            for(const lang of languages) {
                const cache = getMarketplaceMainCache(lang);
                if(!_.isEqual(marketplaceContentful[lang], cache)) {
                    recreateMarketplaceCache();
                    break;
                }
            }
    }
    // console.log(contentfulCache['en']);
    // const offersPL = getAllOffers('pl');
    // const offersEN = getAllOffers('en');
    // 
    // poszukać entry type i po tym filtrować - na webhooka
    // 2 webhooki jeden prodowy - publish i  unpublish
    // drugi - save 
    return res.status(200).json({ message: 'Successful refresh' });
}
