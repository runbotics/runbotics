/* eslint-disable no-console */
import axios from 'axios';
import fs from 'fs';
import { NextApiRequest, NextApiResponse } from 'next';
import getConfig from 'next/config';
import path from 'path';

const { serverRuntimeConfig } = getConfig();

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    if (req.method !== 'POST') {
        return res.status(404).json({ error: 'Not found' });
    }

    try {
        const entrypointUrl = serverRuntimeConfig.runboticsEntrypointUrl;
        const tenantId = req.body.tenantId;
        const accessToken = req.headers.authorization;

        axios.defaults.headers.common.Authorization = accessToken;

        const tenantAvailablePlugins = (
            await axios.get<string[]>(
                `${entrypointUrl}/api/scheduler/tenants/${tenantId}/licenses/plugins/available`
            )
        ).data;

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

        if (!tenantAvailablePlugins.includes(plugin)) {
            return res.status(400).json({ error: 'No plugin available' });
        }

        const pluginPath = path.join(
            pluginsPath,
            plugin,
            'ui',
            'dist',
            'index.js'
        );

        if (!fs.existsSync(pluginPath)) {
            return res.status(404).json({
                error: `Plugin ${plugin} is missing required ui/dist/index.js file`,
            });
        }

        res.setHeader('Content-Type', 'application/javascript');
        const fileStream = fs.createReadStream(pluginPath);
        return fileStream.pipe(res);
    } catch (error) {
        console.log(error);

        return res.status(500).json({
            error: 'Failed to load plugin',
        });
    }
}
