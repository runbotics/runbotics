import { Injectable } from '@nestjs/common';
import { BpmnExecutionEventMessageApi } from 'bpmn-engine';
import { LoopProps } from './loop-handler.types';

@Injectable()
export class LoopHandlerService {
    private loopState = new Map<string, LoopProps>();

    public handleActivityStart(api: BpmnExecutionEventMessageApi) {
        if (this.isLoopElement(api)) {
            this.createLoop(api);
        }

        if (this.isStartEvent(api)) {
            this.incrementIterationNumber(
                this.getLoopExecutionId(api.content?.parent?.id)
            );
        }
    }

    public handleActivityEnd(api: BpmnExecutionEventMessageApi) {
        if (this.isLoopElement(api)) {
            this.deleteLoop(api.id);
        }
    }

    public isInLoop(api: BpmnExecutionEventMessageApi): boolean {
        return (
            this.isLoopElement(api) ||
            this.loopState.has(this.getLoopExecutionId(api.content?.parent?.id))
        );
    }

    public shouldSkipElement(api: BpmnExecutionEventMessageApi): boolean {
        return (
            this.isSubProcessEvent(api) &&
            (this.isStartEvent(api) || this.isEndEvent(api))
        );
    }

    public getLoopData(api: BpmnExecutionEventMessageApi): LoopProps | null {
        return (
            this.loopState.get(
                this.getLoopExecutionId(api.content?.parent?.id)
            ) ?? null
        );
    }

    public cleanUp() {
        this.loopState.clear();
    }

    private getLoopProps(loopId: string, iteratorName: string): LoopProps {
        return {
            iterationNumber: 0,
            loopId,
            iteratorElement: null,
            iteratorName
        };
    }

    private incrementIterationNumber(loopId: string) {
        const loop = this.loopState.get(loopId);
        if (!loop) return;

        this.loopState.set(loopId, {
            ...loop,
            iterationNumber: loop.iterationNumber + 1,
        });
    }

    /***
     * Returns the executionId of the loop element inside the state
     * @param activityId - the id of the activity (e.g. 'Activity_112123')
     * @returns the executionId of the loop element (e.g. 'Activity_112123_672123')
     * @example getLoopExecutionId('Activity_112123') => 'Activity_112123_672123'
     */
    private getLoopExecutionId(activityId: string): string | undefined {
        return Array.from(this.loopState.keys()).find((key) =>
            key.includes(activityId)
        );
    }

    private isLoopElement(api: any): boolean {
        return api.content?.input?.script === 'loop.loop';
    }

    private createLoop(api: BpmnExecutionEventMessageApi) {
        console.log((api as any).broker.owner.behaviour.loopCharacteristics.behaviour.elementVariable);
        this.loopState.set(api.executionId, this.getLoopProps(api.executionId, (api as any).broker.owner.behaviour.loopCharacteristics.behaviour.elementVariable));
    }

    private deleteLoop(activityId: string) {
        this.loopState.delete(this.getLoopExecutionId(activityId));
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
