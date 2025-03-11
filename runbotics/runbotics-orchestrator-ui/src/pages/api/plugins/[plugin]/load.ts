/* eslint-disable no-console */
import axios from 'axios';
import fs from 'fs';
import { NextApiRequest, NextApiResponse } from 'next';
import getConfig from 'next/config';
import path from 'path';
import { HttpErrorCodes } from 'runbotics-common';

const { serverRuntimeConfig } = getConfig();

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    if (req.method !== 'POST') {
        return res
            .status(HttpErrorCodes.NOT_FOUND)
            .json({ error: 'Not found' });
    }

    try {
        const entrypointUrl = serverRuntimeConfig.runboticsEntrypointUrl;
        const tenantId = req.body.tenantId;
        const accessToken = req.headers.authorization;

        const tenantAvailablePlugins = (
            await axios.get<string[]>(
                `${entrypointUrl}/api/scheduler/tenants/${tenantId}/licenses/plugins/available`,
                { headers: { authorization: accessToken } }
            )
        ).data;

        const pluginsPath = serverRuntimeConfig.runboticsPluginsDir;
        if (!pluginsPath) {
            return res.status(HttpErrorCodes.BAD_REQUEST).json({
                error: 'Plugins directory was not provided',
            });
        }

        const { plugin } = req.query;
        if (!plugin || Array.isArray(plugin)) {
            return res.status(HttpErrorCodes.BAD_REQUEST).json({
                error: 'Provided invalid plugin name',
            });
        }

        if (!tenantAvailablePlugins.includes(plugin)) {
            return res
                .status(HttpErrorCodes.BAD_REQUEST)
                .json({ error: 'No plugin available' });
        }

        const pluginPath = path.join(
            pluginsPath,
            plugin,
            'ui',
            'dist',
            'index.js'
        );

        if (!fs.existsSync(pluginPath)) {
            return res.status(HttpErrorCodes.NOT_FOUND).json({
                error: `Plugin ${plugin} is missing required ui/dist/index.js file`,
            });
        }

        res.setHeader('Content-Type', 'application/javascript');
        const fileStream = fs.createReadStream(pluginPath);
        return fileStream.pipe(res);
    } catch (error) {
        if (axios.isAxiosError(error)) {
            console.log('Error:', error.response?.data);
        } else if (error instanceof Error) {
            console.log('Error:', error.message);
        } else {
            console.log('Error:', error);
        }

        return res.status(HttpErrorCodes.INTERNAL_SERVER_ERROR).json({
            error: 'Failed to load plugin',
        });
    }
}
