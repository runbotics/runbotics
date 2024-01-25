export enum ProcessOutputType {
    JSON = 'JSON',
    TEXT = 'TEXT',
    HTML = 'HTML'
}

export interface ProcessOutput {
    type: ProcessOutputType;
}
