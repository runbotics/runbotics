import { Injectable } from '@nestjs/common';
import { BpmnEngineActivity, BpmnExecutionEventMessageApi } from 'bpmn-engine';
import { BpmnTask } from 'runbotics-common';

@Injectable()
export class LoopHandlerService {
    private readonly iteratorMap = new Map<string, string>();

    public setIteratorName(loopId: string, iteratorName: string) {
        this.iteratorMap.set(loopId, iteratorName);
    }

    public getIteratorNameById(loopId: string): string | undefined {
        // Execution id is in format: activity_id_executionId or activity_id_executionId_iterationNumber
        // we need to remove iterationNumber from execution id to get executionId we need to get iterator name
        if (loopId?.split('_').length > 3) {
            loopId = loopId?.split('_').slice(0, 3).join('_');
            return this.iteratorMap.get(loopId);
        }
        return this.iteratorMap.get(loopId);
    }

    public shouldSkipElement(api: BpmnExecutionEventMessageApi): boolean {
        return (
            this.isSubProcessEvent(api) &&
            (this.isStartEvent(api) || this.isEndEvent(api))
        );
    }

    public cleanUp(): void {
        this.iteratorMap.clear();
    }

    public getLoopId(api: BpmnExecutionEventMessageApi): string {
        return api.environment.variables.content.parent.executionId;
    }

    public getIterationNumber(api: BpmnExecutionEventMessageApi): number {
        return api.environment.variables.content.index + 1;
    }
    
    public getIteratorElement(api: BpmnExecutionEventMessageApi, iteratorName: string): any | null {
        return JSON.stringify(
            api.environment.variables
                .content[iteratorName]
        ) ?? '';
    }

    public getIteratorFromElement({ owner }): string {
        return (owner as BpmnEngineActivity).behaviour?.loopCharacteristics?.behaviour.elementVariable;
    }

    public isLoopEvent(api: BpmnExecutionEventMessageApi): boolean {
        return (
            api.environment.variables.content.parent.type ===
                BpmnTask.SUBPROCESS &&
            api.environment.variables.content.loopCardinality
        );
    }
    
    private isSubProcessEvent(api: BpmnExecutionEventMessageApi): boolean {
        return api.content?.parent?.type === BpmnTask.SUBPROCESS;
    }

    private isStartEvent(api: BpmnExecutionEventMessageApi): boolean {
        return api.content?.type === BpmnTask.START_EVENT;
    }

    private isEndEvent(api: BpmnExecutionEventMessageApi): boolean {
        return api.content?.type === BpmnTask.END_EVENT;
    }
}
