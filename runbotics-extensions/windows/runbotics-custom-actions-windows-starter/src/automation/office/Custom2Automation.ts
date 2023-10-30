import { DesktopRunRequest } from '@runbotics/runbotics-sdk';
import { StatefulActionHandler } from '@runbotics/runbotics-sdk';
import { StatelessActionHandler } from '@runbotics/runbotics-sdk';
import { DesktopRunResponse } from '@runbotics/runbotics-sdk';
// @ts-ignore
import * as winax from 'winax';

export type CustomActionRequest<I> = DesktopRunRequest<any> & {
    script: 'external.myother.hello';
}

export type CustomHelloActionInput = {
}
export type CustomHelloActionOutput = {
}


class CustomAutomation extends StatelessActionHandler {
    private sessions: Record<string, any> = {};
    private openedFiles: Record<string, any> = {}

    constructor() {
        super();
    }


    async hello(input: CustomHelloActionInput): Promise<CustomHelloActionOutput> {
        console.info("this.sessions", this.sessions);

        this.sessions = {
            "test": "test"
        }


        return {
            testOutput: {
                "myTest": "adadmm"
            }
        };
    }


    getType(): string {
        return "StatefulActionHandler"
    }

    async run(request: DesktopRunRequest<any>): Promise<DesktopRunResponse<any>> {
        const customAction: CustomActionRequest<any> = request as CustomActionRequest<any>;
        let output: any = {};
        switch (customAction.script) {
            case 'external.myother.hello':
                output = await this.hello(customAction.input);
                break;
            default:
                throw new Error('Action not found');
        }

        return {
            status: 'ok',
            output: output,
        };
    }
}

export default CustomAutomation;
