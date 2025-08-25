import { NextApiRequest, NextApiResponse } from 'next';
import { HttpErrorCodes } from 'runbotics-common';

export default function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    if (req.method !== 'GET') {
        return res
            .status(HttpErrorCodes.NOT_FOUND)
            .json({ error: 'Not found' });
    }
    return res.status(200).json({ health: 'OK' });
}
