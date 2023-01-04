import { join } from 'path';

export const PRERELEASE_ID = 'SNAPSHOT';

export const RUNBOTICS_CONFIG_RELATIVE_PATH = join('runbotics', 'common', 'config', 'runbotics.json');
export const SCHEDULER_CONFIG_RELATIVE_PATH = join('runbotics', 'runbotics-scheduler', 'package.json');
export const UI_CONFIG_RELATIVE_PATH = join('runbotics', 'runbotics-orchestrator-ui', 'package.json');
export const BOT_CONFIG_RELATIVE_PATH = join('runbotics', 'runbotics-desktop', 'package.json');
export const API_CONFIG_RELATIVE_PATH = join('runbotics-orchestrator', 'package.json');

export const CONFIGS_RELATIVE_PATHS_MAP = new Map([
    [ 'scheduler', SCHEDULER_CONFIG_RELATIVE_PATH ],
    [ 'orchestrator-ui', UI_CONFIG_RELATIVE_PATH ],
    [ 'desktop', BOT_CONFIG_RELATIVE_PATH ],
    [ 'orchestrator', API_CONFIG_RELATIVE_PATH ],
]);
