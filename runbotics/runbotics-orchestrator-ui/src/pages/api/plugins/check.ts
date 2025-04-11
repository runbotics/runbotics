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

        if (!fs.existsSync(pluginsPath)) {
            return res.status(HttpErrorCodes.BAD_REQUEST).json({
                error: 'Plugins directory does not exist',
            });
        }

        const pluginDirs = fs
            .readdirSync(pluginsPath, { withFileTypes: true })
            .filter((dir) => dir.isDirectory() && !dir.name.startsWith('.'))
            .map((dir) => dir.name);

        if (pluginDirs.length === 0) {
            return res
                .status(HttpErrorCodes.BAD_REQUEST)
                .json({ error: 'No plugin directories to be loaded' });
        }

        const foundPlugins: string[] = [];

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

        const filteredPlugins = foundPlugins.filter((plugin) =>
            tenantAvailablePlugins.includes(plugin)
        );

        if (filteredPlugins.length === 0) {
            return res
                .status(HttpErrorCodes.BAD_REQUEST)
                .json({ error: 'No valid plugin directories found' });
        }

        console.log(
            `Found ${filteredPlugins.length} plugins: ${filteredPlugins.join(
                ', '
            )}`
        );

        return res.status(200).json({ plugins: filteredPlugins });
    } catch (error) {
        if (axios.isAxiosError(error)) {
            console.log('Error:', error.response?.data);
        } else if (error instanceof Error) {
            console.log('Error:', error.message);
        } else {
            console.log('Error:', error);
        }

        return res.status(HttpErrorCodes.INTERNAL_SERVER_ERROR).json({
            error: 'Failed to check available plugins',
        });
    }
}
