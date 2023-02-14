import { Injectable } from '@nestjs/common';
import { BpmnExecutionEventMessageApi } from 'bpmn-engine';

@Injectable()
export class LoopHandlerService {
    private iteratorMap = new Map<string, string>();

    public setIteratorName(loopId: string, iteratorName: string) {
        this.iteratorMap.set(loopId, iteratorName);
    }

    public getIteratorNameById(loopId: string): string | undefined {
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
    
    public getIteratorElement(api: BpmnExecutionEventMessageApi, iteratorName: string): any {
        return JSON.stringify(
            api.environment.variables
                .content[iteratorName]
        ) ?? '';
    }

    public getIteratorFromElement(api: BpmnExecutionEventMessageApi): string {
        return (api as any).broker.owner.behaviour?.loopCharacteristics?.behaviour.elementVariable;
    }

    public isLoopEvent(api: BpmnExecutionEventMessageApi): boolean {
        return (
            api.environment.variables.content.parent.type ===
                'bpmn:SubProcess' &&
            api.environment.variables.content.loopCardinality
        );
    }
    
    private isSubProcessEvent(api: BpmnExecutionEventMessageApi): boolean {
        return api.content?.parent?.type === 'bpmn:SubProcess';
    }

    private isStartEvent(api: BpmnExecutionEventMessageApi): boolean {
        return api.content?.type === 'bpmn:StartEvent';
    }

    private isEndEvent(api: BpmnExecutionEventMessageApi): boolean {
        return api.content?.type === 'bpmn:EndEvent';
    }
}
