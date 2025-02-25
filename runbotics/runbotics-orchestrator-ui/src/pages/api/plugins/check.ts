/* eslint-disable no-console */
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

    if (!fs.existsSync(pluginsPath)) {
        return res.status(400).json({
            error: 'Plugins directory does not exist',
        });
    }

    const pluginDirs = fs
        .readdirSync(pluginsPath, { withFileTypes: true })
        .filter((dir) => dir.isDirectory() && !dir.name.startsWith('.'))
        .map((dir) => dir.name);

    if (pluginDirs.length === 0) {
        return res
            .status(400)
            .json({ error: 'No plugin directories to be loaded' });
    }

    const foundPlugins = [];

    for (const plugin of pluginDirs) {
        const uiDistPath = path.join(
            pluginsPath,
            plugin,
            'ui',
            'dist',
            'index.js'
        );

        if (!fs.existsSync(uiDistPath)) {
            console.log(
                `Plugin ${plugin} is missing required ui/dist/index.js file`
            );
            continue;
        }

        foundPlugins.push(plugin);
    }

    if (foundPlugins.length === 0) {
        return res
            .status(400)
            .json({ error: 'No valid plugin directories found' });
    }

    console.log(
        `Found ${foundPlugins.length} plugins: ${foundPlugins.join(', ')}`
    );

    return res.status(200).json({ plugins: foundPlugins });
}
