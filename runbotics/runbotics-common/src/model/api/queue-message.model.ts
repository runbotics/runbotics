import { IProcess } from "./process.model";
import { ProcessInput } from "./queue.model";
import { WsMessage } from "./websocket.model";

type JobId = string | number;

export interface BaseQueueMessageBody {
    initialDate: string;
    updateDate: string;
    processQueueId: JobId;
    input: ProcessInput;
    processId: IProcess["id"];
}

export interface GeneralQueueMessageBody extends BaseQueueMessageBody {
    type: "ACTIVE" | "REMOVE" | "TIMEOUT" | "FAILED";
}

export interface UpdateQueueMessageBody extends BaseQueueMessageBody {
    type: "UPDATE";
    queuePosition: number;
}

export type QueueMessageBody = GeneralQueueMessageBody | UpdateQueueMessageBody;

export interface StartProcessResponse {
    orchestratorProcessInstanceId: string;
}

export interface ProcessQueueMessage {
    [WsMessage.PROCESS_COMPLETED]: {
        orchestratorProcessInstanceId: StartProcessResponse['orchestratorProcessInstanceId'];
        processId: IProcess['id'];
    };

    [WsMessage.PROCESS_FAILED]: {
        error: Error['message'];
        processId: IProcess['id'];
    };
}
