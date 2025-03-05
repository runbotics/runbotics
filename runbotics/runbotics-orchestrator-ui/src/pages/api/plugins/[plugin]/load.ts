import fs from 'fs';
import { NextApiRequest, NextApiResponse } from 'next';
import getConfig from 'next/config';
import path from 'path';

const { serverRuntimeConfig } = getConfig();

export default function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'GET') {
        return res.status(404).json({ error: 'Not found' });
    }

    const pluginsPath = serverRuntimeConfig.runboticsPluginsDir;
    if (!pluginsPath) {
        return res.status(400).json({
            error: 'Plugins directory was not provided',
        });
    }

    const { plugin } = req.query;
    if (!plugin || Array.isArray(plugin)) {
        return res.status(400).json({
            error: 'Provided invalid plugin name',
        });
    }

    const pluginPath = path.join(pluginsPath, plugin, 'ui', 'dist', 'index.js');

    if (!fs.existsSync(pluginPath)) {
        return res.status(404).json({
            error: `Plugin ${plugin} is missing required ui/dist/index.js file`,
        });
    }

    res.setHeader('Content-Type', 'application/javascript');
    const fileStream = fs.createReadStream(pluginPath);
    return fileStream.pipe(res);
}
