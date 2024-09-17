import {
    BpmnEngineExecutionEnvironment,
    BpmnExecutionEventMessageApi,
    BpmnExecutionEventMessageContent,
} from 'bpmn-engine';

import { IProcess, ProcessInstanceEventStatus, ProcessInstanceStatus, IProcessInstance } from 'runbotics-common';
import { StartProcessMessageBody } from '#core/websocket/listeners/process.listener.types';
import { ActivityOwner } from '#core/bpm/bpmn.types';

export interface BpmnProcessInstance extends IProcessInstance, IProcessParams {
    output?: any;
    processOutput?: Record<string, unknown>;
}

export interface IProcessEventData {
    processInstanceId: string;
    processInstance: BpmnProcessInstance;
    eventType: ProcessInstanceStatus;
}

export interface IActivityEventData {
    processInstance: IProcessInstance;
    eventType: ProcessInstanceEventStatus;
    activity: BpmnExecutionEventMessageExtendedApi;
    iteratorName?: string;
}

export interface DesktopTask extends BpmnExecutionEventMessageContent {
    name?: string;
    sourceId?: string;
    input?: Record<string, string> & {
        script: string;
    };
    output?: Record<string, string> & {
        script: string;
    } | BpmnExecutionEventMessageContentError;
}

export interface RunBoticsExecutionEnvironment extends BpmnEngineExecutionEnvironment {
    runbotic?: {
        disabled: boolean;
        processOutput: boolean;
        credentialType?: string;
    };
}

export interface IProcessParams {
    variables: Record<string, any>;
    callbackUrl?: string;
}

export interface IStartProcessInstance extends IProcessParams, Omit<StartProcessMessageBody, 'processId' | 'input'> {
    process: IProcess;
    rootProcessInstanceId?: string;
    parentProcessInstanceId?: string;
}

export interface BpmnExecutionEventMessageContentError {
    description: string;
    name: string;
    source: {
        content: BpmnExecutionEventMessageContent;
        fields: {
            consumerTag: string;
            exchange: string;
            routingKey: string;
        };
        properties: {
            messageId: string;
            timestamp: number;
        };
    };
    type: string;
}

export interface BpmnExecutionEventMessageExtendedContent extends BpmnExecutionEventMessageContent {
    error?: BpmnExecutionEventMessageContentError;
    isSequenceFlow: boolean;
    sequenceId: string;
    sourceId: string;
}

export interface BpmnExecutionEventMessageExtendedApi extends BpmnExecutionEventMessageApi {
    readonly content: BpmnExecutionEventMessageExtendedContent;
    readonly owner: ActivityOwner;
}

export interface IBpmnEngineEvent<T> {
    subscribe(handler: { (data: T): void }): ISubscription;
    unsubscribe(handler: { (data: T): void }): void;
}

export interface ISubscription {
    unsubscribe(): void;
}
