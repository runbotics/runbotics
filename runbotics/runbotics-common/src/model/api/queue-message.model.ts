import { IProcess } from './process.model';
import { ProcessInput } from './queue.model';
import { WsMessage } from './websocket.model';

type JobId = string | number;

export enum QueueEventType {
    UPDATE = 'UPDATE',
    ACTIVE = 'ACTIVE',
    REMOVE = 'REMOVE',
    TIMEOUT = 'TIMEOUT',
    FAILED = 'FAILED'
}

export interface BaseQueueMessageBody {
    initialDate: string;
    updateDate: string;
    processQueueId: JobId;
    input: ProcessInput;
    processId: IProcess['id'];
}

export interface GeneralQueueMessageBody extends BaseQueueMessageBody {
    type: Exclude<QueueEventType, QueueEventType.UPDATE>;
}

export interface UpdateQueueMessageBody extends BaseQueueMessageBody {
    type: Extract<QueueEventType, QueueEventType.UPDATE>;
    queuePosition: number;
}

export type TriggerQueueMessage = GeneralQueueMessageBody | UpdateQueueMessageBody;

export interface StartProcessResponse {
    orchestratorProcessInstanceId: string;
}

export interface WsQueueMessage {
    [WsMessage.PROCESS_START]: {
        processId: IProcess['id'];
        processInput: ProcessInput;
    }
    [WsMessage.PROCESS_START_COMPLETED]: {
        processId: IProcess['id'];
        orchestratorProcessInstanceId: StartProcessResponse['orchestratorProcessInstanceId'];
    }
    [WsMessage.PROCESS_START_FAILED]: {
        processId: IProcess['id'];
        errorMessage: string;
    }

    [WsMessage.JOB_REMOVE]: {
        processId: IProcess['id'];
        jobId: JobId;
    }
    [WsMessage.JOB_REMOVE_COMPLETED]: {
        processId: IProcess['id'];
    }
    [WsMessage.JOB_REMOVE_FAILED]: {
        processId: IProcess['id'];
        errorMessage: string;
    }

    [WsMessage.JOB_WAITING]: {
        processId: IProcess['id'];
        queuePosition: number;
        jobId: JobId;
    };
    [WsMessage.JOB_ACTIVE]: {
        processId: IProcess['id'];
        jobId: JobId;
    };
    [WsMessage.JOB_FAILED]: {
        processId: IProcess['id'];
        errorMessage: string;
    }
}
