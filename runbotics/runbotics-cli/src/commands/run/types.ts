export type Package = 'ui' | 'api' | 'scheduler' | 'bot';

export interface RunCommandOptions {
    production?: boolean;
    debug?: boolean;
}
