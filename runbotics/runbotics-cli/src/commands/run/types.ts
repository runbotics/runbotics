export type Package = 'ui' | 'api' | 'scheduler' | 'bot' | 'lp';

export interface RunCommandOptions {
    production?: boolean;
    debug?: boolean;
}
