import { Job } from '#/utils/process';
import { Injectable } from '@nestjs/common';
import Axios from 'axios';
import {
    BaseQueueMessageBody,
    GeneralQueueMessageBody,
    UpdateQueueMessageBody,
    TriggerQueueMessage,
    QueueEventType
} from 'runbotics-common';

@Injectable()
export class QueueMessageService {
    public async sendQueueMessage(eventType: GeneralQueueMessageBody['type'], job: Job): Promise<void>;
    public async sendQueueMessage(eventType: UpdateQueueMessageBody['type'], job: Job, queuePosition: UpdateQueueMessageBody['queuePosition']): Promise<void>;
    public async sendQueueMessage(eventType: TriggerQueueMessage['type'], job: Job, queuePosition?: number) {
        const queueCallbackUrl = job?.data?.input?.queueCallbackUrl;
        if (queueCallbackUrl) {
            const baseQueueMessageBody = this.getBaseQueueMessageBody(job);

            switch (eventType) {
                case QueueEventType.UPDATE:
                    await Axios.post<unknown, unknown, TriggerQueueMessage>(queueCallbackUrl, {
                        ...baseQueueMessageBody,
                        type: eventType,
                        queuePosition,
                    });
                    break;
                default:
                    await Axios.post<unknown, unknown, TriggerQueueMessage>(queueCallbackUrl, {
                        ...baseQueueMessageBody,
                        type: eventType,
                    });
                    break;
            }
        }
    }

    private getBaseQueueMessageBody(job: Job): BaseQueueMessageBody {
        return {
            initialDate: new Date(job?.timestamp).toISOString(),
            updateDate: new Date().toISOString(),
            input: job?.data?.input,
            processId: job?.data?.process?.id,
            processQueueId: job?.id,
        };
    }
}
