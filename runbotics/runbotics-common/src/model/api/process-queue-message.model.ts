import { WsMessage } from "./websocket.model"

type JobId = string | number;

export interface ProcessQueueMessage {
  [WsMessage.PROCESS_WAITING]: {
      jobId: JobId;
      jobIndex: number;
      processId: number;
  };

  [WsMessage.PROCESS_PROCESSING]: {
      jobId: JobId;
      processId: number;
  };

  [WsMessage.PROCESS_COMPLETED]: {
      jobId: JobId;
      orchestratorProcessInstanceId: string;
      processId: number;
  };

  [WsMessage.PROCESS_FAILED]: {
      message: string;
      processId: number;
      jobId?: JobId;
  };

  [WsMessage.PROCESS_REMOVED]: {
      jobId: JobId;
      processId: number;
  };

  [WsMessage.PROCESS_QUEUE_UPDATE]: {
      jobId: JobId;
  };

  [WsMessage.TERMINATE_JOB]: {
      jobId: JobId;
      message: string;
  };
}
