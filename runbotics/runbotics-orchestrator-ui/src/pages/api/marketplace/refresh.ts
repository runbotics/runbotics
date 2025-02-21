import { NextApiRequest, NextApiResponse } from 'next';

import { recreateMarketplaceCache } from '#contentful/marketplace-main';
import { languages } from '#src-app/translations/translations';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    if (req.method !== 'POST') {
        return res.status(404).end();
    }

    if (process.env.API_ROUTE_SECRET && req.query.API_ROUTE_SECRET !== process.env.API_ROUTE_SECRET) {
        return res.status(401).send('Invalid secret');
    }

    await Promise.allSettled(languages.map((language) => recreateMarketplaceCache(language)));

    return res.send('RunBotics marketplace cache recreated');
};

export default handler;
