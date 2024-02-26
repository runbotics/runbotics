import { WsMessage } from "./websocket.model"

type JobId = string | number;

export interface ProcessQueueMessage {
  [WsMessage.PROCESS_WAITING]: {
      jobId: JobId;
      jobIndex: number;
  };

  [WsMessage.PROCESS_PROCESSING]: {
      jobId: JobId;
  };

  [WsMessage.PROCESS_COMPLETED]: {
      jobId: JobId;
      orchestratorProcessInstanceId: string;
  };

  [WsMessage.PROCESS_FAILED]: {
      message: string;
      jobId?: JobId;
  };

  [WsMessage.PROCESS_REMOVED]: {
      jobId: JobId;
  };

  [WsMessage.PROCESS_QUEUE_UPDATE]: {
      jobId: JobId;
  }
}
