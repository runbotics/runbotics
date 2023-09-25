import { createServer } from 'http';
import next from 'next';

import { parse } from 'url';

import { isCached, recreateCache } from './contentful/blog-main/cache';

const dev = process.env.NODE_ENV !== 'production';
const hostname = 'localhost';
const port = 3000;
const app = next({ dev, hostname, port });
const handle = app.getRequestHandler();

app.prepare().then(async () => {
    // initiates content caching from contentful only at application startup
    await recreateCache();

    createServer(async (req, res) => {
        try {
            const parsedUrl = parse(req.url, true);

            if (!isCached('en') || !isCached('pl')) {
                await recreateCache();
            } else {
                res.setHeader('X-Cache', 'HIT');
            }

            await handle(req, res, parsedUrl);
        } catch (err) {
            console.error('Error occurred handling', req.url, err);
            res.statusCode = 500;
            res.end('Internal server error');
        }
    })
        .once('error', (err) => {
            console.error(err);
            process.exit(1);
        })
        .listen(port, () => {
            console.log(`Ready on http://${hostname}:${port}`);
        });
});
