import { Injectable } from '@nestjs/common';
import { BpmnExecutionEventMessageApi } from 'bpmn-engine';
import { LoopProps } from 'runbotics-common/dist/model/api/loop-props';


@Injectable()
export class LoopHandlerService {
    private loopState: Map<string, LoopProps> = new Map();

    private getInitialLoopState(loopId: string): LoopProps{
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

    private isLoopStart(api: any): boolean {
        if (api.content?.input?.script === 'loop.loop') {
            return true;
        } else {
            return false;
        }
    }

    public isPartOfLoop(api: BpmnExecutionEventMessageApi): boolean {
        if(this.isLoopStart(api)) return true;
        if (!this.loopState.has(api.content?.parent?.id)) return false;
        return true;
    }
    
    public handleLoopElement(api: BpmnExecutionEventMessageApi) {
        if (this.isLoopStart(api))
            this.loopState.set(api.id, this.getInitialLoopState(api.id));
        if (api.type === 'bpmn:StartEvent')
            this.addIteration(api.content?.parent?.id);    
    }

    public static shouldElementBeSkipped(api: BpmnExecutionEventMessageApi): boolean {
        const isPartOfSubProcess = api.content?.parent?.type === 'bpmn:SubProcess';
        const isStartEvent = api.type === 'bpmn:StartEvent';
        const isEndEvent = api.type === 'bpmn:EndEvent';

        if(isPartOfSubProcess && (isStartEvent || isEndEvent)) return true;
        return false;
    }

    public getLoopData(api: BpmnExecutionEventMessageApi) {
        if(this.isLoopStart(api)) return this.loopState.get(api.id);
        return this.loopState.get(api.content?.parent?.id) ?? null;
    }
}
