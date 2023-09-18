export enum WorkerMessageType {
    RUN = 'RUN',
    EXIT = 'EXIT',
}

export type WorkerMessage =
    | { type: WorkerMessageType.RUN, stringRequest: string }
    | { type: WorkerMessageType.EXIT };