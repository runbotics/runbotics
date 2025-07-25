import _ from 'lodash';

import {
    getBlogMainCache, recreateBlogCache,
    transformContentfulResponse as transformBlogContentfulResponse,
} from '#contentful/blog-main';
import {
    getMarketplaceMainCache,
    recreateMarketplaceCache,
    transformContentfulResponse as transformMarketplaceContentfulResponse,
} from '#contentful/marketplace-main';
import { languages } from '#src-app/translations/translations';

enum ContentTypeId {
    MARKETPLACE_OFFER = 'marketplaceOffer',
    MARKETPLACE_INDUSTRY = 'industry',
    MARKETPLACE_TAG = 'marketplaceTag',
    BLOG_POST = 'blogPost',
    BLOG_AUTHOR = 'author',
    BLOG_TAG = 'tag',
}

interface RequestBody {
    contentTypeId: ContentTypeId;
}

export default async function handler(req, res) {
    const body = JSON.parse(req.body) as RequestBody;
    switch (body.contentTypeId) {
        case ContentTypeId.MARKETPLACE_OFFER:
        case ContentTypeId.MARKETPLACE_TAG:
        case ContentTypeId.MARKETPLACE_INDUSTRY:
            const marketplaceContentful = await transformMarketplaceContentfulResponse();
            for(const lang of languages) {
                const cache = getMarketplaceMainCache(lang);
                if(!_.isEqual(marketplaceContentful[lang], cache)) {
                    // eslint-disable-next-line no-await-in-loop
                    await recreateMarketplaceCache();
                    return res.status(200).json({ message: 'Marketplace cache refreshed'});
                }
            }
            break;
        case ContentTypeId.BLOG_AUTHOR:
        case ContentTypeId.BLOG_POST:
        case ContentTypeId.BLOG_TAG:
            const blogContentful = await transformBlogContentfulResponse();
            for (const lang of Object.values(languages)) {
                const cache = getBlogMainCache(lang);
                if(!_.isEqual(blogContentful[lang], cache)) {
                    // eslint-disable-next-line no-await-in-loop
                    await recreateBlogCache();
                    return  res.status(200).json({message: 'Blog cache refreshed'});
                }
            }
            break;
        default: 
            return res.status(304).json({ message: 'Cache not modified' });
    }
    return res.status(304).json({ message: 'Cache not modified' });
}
