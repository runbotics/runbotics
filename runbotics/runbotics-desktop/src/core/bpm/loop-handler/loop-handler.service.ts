import { Injectable } from '@nestjs/common';
import { BpmnExecutionEventMessageApi } from 'bpmn-engine';
import { LoopProps } from 'runbotics-common/dist/model/api/loop-props';

@Injectable()
export class LoopHandlerService {
    private loopState: Map<string, LoopProps> = new Map();

    private getInitialLoopState(loopId: string): LoopProps {
        return {
            iteration: 0,
            loopId: loopId,
            iterationsData: {},
        };
    }

    private addIteration(id) {
        this.loopState.set(id, {
            ...this.loopState.get(id),
            iteration: this.loopState.get(id).iteration + 1,
        });
    }

    private findElementInMap(partOfId: string) {
        return Array.from(this.loopState.keys()).find((key) =>
            key.includes(partOfId)
        );
    }

    private isLoopStart(api: any): boolean {
        if (api.content?.input?.script === 'loop.loop') {
            return true;
        } else {
            return false;
        }
    }

    loopActivityStart(api: BpmnExecutionEventMessageApi) {
        if (this.isLoopStart(api))
            this.loopState.set(
                api.executionId,
                this.getInitialLoopState(api.executionId)
            );
        if (api.type === 'bpmn:StartEvent') {
            this.addIteration(this.findElementInMap(api.content?.parent?.id));
        }
    }

    loopActivityEnd(api: BpmnExecutionEventMessageApi) {
        if(this.isLoopStart(api)){
            this.loopState.delete(this.findElementInMap(api.id));
        }
    }

    public isPartOfLoop(api: BpmnExecutionEventMessageApi): boolean {
        if (this.isLoopStart(api)) return true;
        if (!this.loopState.has(this.findElementInMap(api.content?.parent?.id)))
            return false;
        return true;
    }

    public shouldElementBeSkipped(api: BpmnExecutionEventMessageApi): boolean {
        const isPartOfSubProcess =
            api.content?.parent?.type === 'bpmn:SubProcess';
        const isStartEvent = api.type === 'bpmn:StartEvent';
        const isEndEvent = api.type === 'bpmn:EndEvent';

        if (isPartOfSubProcess && (isStartEvent || isEndEvent)) return true;
        return false;
    }

    public getLoopData(api: BpmnExecutionEventMessageApi) {
        // if(this.isLoopStart(api)) return this.loopState.get(api.id);
        return (
            this.loopState.get(
                this.findElementInMap(api.content?.parent?.id)
            ) ?? null
        );
    }

    public cleanUp() {
        this.loopState.clear();
    }
}
