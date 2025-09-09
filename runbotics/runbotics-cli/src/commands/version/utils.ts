import { join } from 'path';

export const PRERELEASE_ID = 'SNAPSHOT';
export const PRERELEASE = 'prerelease';

export const RUNBOTICS_CONFIG_RELATIVE_PATH = join('runbotics', 'common', 'config', 'runbotics.json');
export const SCHEDULER_CONFIG_RELATIVE_PATH = join('runbotics', 'runbotics-scheduler', 'package.json');
export const UI_CONFIG_RELATIVE_PATH = join('runbotics', 'runbotics-orchestrator-ui', 'package.json');
export const BOT_CONFIG_RELATIVE_PATH = join('runbotics', 'runbotics-desktop', 'package.json');
export const LP_CONFIG_RELATIVE_PATH = join('runbotics', 'runbotics-lp', 'package.json');

export const MONOREPO_CONFIGS_RELATIVE_PATHS = [
    { name: 'scheduler', path: SCHEDULER_CONFIG_RELATIVE_PATH },
    { name: 'orchestrator-ui', path: UI_CONFIG_RELATIVE_PATH },
    { name: 'desktop', path: BOT_CONFIG_RELATIVE_PATH },
    { name: 'lp', path: LP_CONFIG_RELATIVE_PATH },
];

export const LISTR_RENDERER_OPTIONS = { showErrorMessage: false, showTimer: true, collapseErrors: false };

export const containsVersion = (
    json: unknown | null
): json is { version: string } => json !== null
    && typeof json === 'object'
    && 'version' in json && typeof json.version === 'string';
