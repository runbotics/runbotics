import { NextApiRequest, NextApiResponse } from 'next';
import { HttpErrorCodes } from 'runbotics-common';

import { recreateCache } from '#contentful/common';
import { languages } from '#src-app/translations/translations';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'POST') {
        return res.status(HttpErrorCodes.NOT_FOUND).end();
    }

    if (process.env.API_ROUTE_SECRET && req.query.API_ROUTE_SECRET !== process.env.API_ROUTE_SECRET) {
        return res.status(401).send('Invalid secret');
    }

    await Promise.allSettled(languages.map((language) => recreateCache(language)));

    return res.send('RunBotics cache recreated');
}
