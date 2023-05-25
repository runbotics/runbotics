import { NextApiRequest, NextApiResponse } from 'next';

import { recreateCache } from '#contentful/blog-main';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    if (req.method !== 'POST') {
        return res.status(404).end();
    }

    if (process.env.API_ROUTE_SECRET && req.query.API_ROUTE_SECRET !== process.env.API_ROUTE_SECRET) {
        return res.status(401).send('Invalid secret');
    }

    await recreateCache();

    return res.send('RunBotics blog cache recreated');
};

export default handler;
