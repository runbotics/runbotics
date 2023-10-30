import { Injectable } from '@nestjs/common';
import { StatelessActionHandler, DesktopRunRequest, DesktopRunResponse } from '@runbotics/runbotics-sdk';

export type LoopActionRequest =
| DesktopRunRequest<'loop.init', LoopInitActionInput>;

export type LoopInitActionInput = {
    list?: any[];
    variable?: string;
    stepIdx: string;
};
export type LoopInitActionOutput = any;

@Injectable()
export default class LoopActionHandler extends StatelessActionHandler {
    async initLoop(input: LoopInitActionInput): Promise<LoopInitActionOutput> {
        const list = input.variable ? input.variable : input.list;
        const result = {
            stepsCount: list.length,
            list: list,
        };

        return result;
    }

    run(request: LoopActionRequest) {
        switch (request.script) {
            case 'loop.init':
                return this.initLoop(request.input);
            default:
                throw new Error('Action not found');
        }
    }
}
