import { Injectable } from '@nestjs/common';
import { StatefulActionHandler, StatelessActionHandler } from 'runbotics-sdk';
import { DesktopRunRequest } from 'runbotics-sdk';
import { DesktopRunResponse } from 'runbotics-sdk';
import * as vm from 'vm';
import * as fs from 'fs';

export type LoopActionRequest<I> = DesktopRunRequest<any> & {
    script: 'loop.init';
};

export type LoopInitActionInput = {
    list?: any[];
    variable?: string;
    stepIdx: string;
};
export type LoopInitActionOutput = any;

@Injectable()
export class LoopActionHandler extends StatelessActionHandler {
    async initLoop(input: LoopInitActionInput): Promise<LoopInitActionOutput> {
        const list = input.variable ? input.variable : input.list;
        const result = {
            stepsCount: list.length,
            list: list,
        };

        return result;
    }

    async run(request: LoopActionRequest<any>): Promise<DesktopRunResponse<any>> {
        let output = {};
        switch (request.script) {
            case 'loop.init':
                output = await this.initLoop(request.input);
                break;
        }
        return {
            status: 'ok',
            output: output,
        };
    }
}
