export type Package = 'ui' | 'api' | 'scheduler' | 'bot' | 'lp' | 'proxy';

export interface RunCommandOptions {
    production?: boolean;
    debug?: boolean;
}
