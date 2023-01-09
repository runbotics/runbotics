export type Package = 'ui' | 'api' | 'scheduler' | 'bot';

export interface RunCommandOptions {
    dev?: boolean;
    debug?: boolean;
}
