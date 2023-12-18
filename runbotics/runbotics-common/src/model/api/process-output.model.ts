export enum ProcessOutputType {
    JSON_OBJECT = 'JSON_OBJECT',
    PLAIN_TEXT = 'PLAIN_TEXT'
}

export interface ProcessOutput {
    type: ProcessOutputType;
}
