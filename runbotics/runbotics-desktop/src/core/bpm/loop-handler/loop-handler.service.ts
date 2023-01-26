import { RunboticsLogger } from '#logger';
import { Injectable } from '@nestjs/common';
import {
    BpmnExecutionEventMessageApi,
} from 'bpmn-engine';
interface LoopHandlerState {
    iteration: number;
    loopId: string;
}

@Injectable()
export class LoopHandlerService {
    private readonly logger = new RunboticsLogger(LoopHandlerService.name);
    private loopState: LoopHandlerState;

    private addIteration() {
        this.loopState.iteration++;
    }

    // isPartOfLoop(api:BpmnExecutionEventMessageApi ):boolean{
    //     return api.execution.environment.variables.loopId !== undefined;
    // }

    getInnerState() {
        return this.loopState;
    }
}
