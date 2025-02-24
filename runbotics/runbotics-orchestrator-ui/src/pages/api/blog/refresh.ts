import { NextApiRequest, NextApiResponse } from 'next';

import { recreateBlogCache } from '#contentful/blog-main';

import { languages } from '#src-app/translations/translations';
import { recreateCache } from '#contentful/common';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    if (req.method !== 'POST') {
        return res.status(404).end();
    }

    if (process.env.API_ROUTE_SECRET && req.query.API_ROUTE_SECRET !== process.env.API_ROUTE_SECRET) {
        return res.status(401).send('Invalid secret');
    }

    await Promise.allSettled(languages.map((language) => recreateCache(language)));

    return res.send('RunBotics blog cache recreated');
};

export default handler;
