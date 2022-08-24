import {
    BpmnEngineExecutionEnvironment,
    BpmnExecutionEventMessageApi,
    BpmnExecutionEventMessageContent,
} from 'bpmn-engine';

import {
    IProcess,
    ProcessInstanceEventStatus,
    ProcessInstanceStatus,
    IProcessInstance,
} from 'runbotics-common';

export interface BpmnProcessInstance extends IProcessInstance {
    params: IProcessParams;
    variables: Record<string, any>;
    output?: any;
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
}

export interface DesktopTask extends BpmnExecutionEventMessageContent {
    input?: Record<string, string> & {
        script: string;
    };
    output?: Record<string, string> & {
        script: string;
    };
}

export interface RunBoticsExecutionEnvironment extends BpmnEngineExecutionEnvironment {
    runbotic?: {
        disabled: boolean;
    };
}

export interface IProcessParams {
    variables: Record<string, any>;
}

export interface IStartProcessInstance {
    process: IProcess;
    params: IProcessParams;
    userId: number;
    orchestratorProcessInstanceId: string;
    rootProcessInstanceId?: string;
    scheduled: boolean;
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
}

export interface BpmnExecutionEventMessageExtendedApi extends BpmnExecutionEventMessageApi {
    readonly content: BpmnExecutionEventMessageExtendedContent;
}

export interface IBpmnEngineEvent<T> {
    subscribe(handler: { (data: T): void }): ISubscription;
    unsubscribe(handler: { (data: T): void }): void;
}

export interface ISubscription {
    unsubscribe(): void;
}