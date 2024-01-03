export enum ProcessOutputType {
    JSON = 'JSON',
    TEXT = 'TEXT'
}

export interface ProcessOutput {
    type: ProcessOutputType;
}
