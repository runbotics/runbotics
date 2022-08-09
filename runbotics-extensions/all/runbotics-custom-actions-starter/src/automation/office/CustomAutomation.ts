import { DesktopRunRequest } from 'runbotics-sdk';
import { StatelessActionHandler } from 'runbotics-sdk';
import { DesktopRunResponse } from 'runbotics-sdk';

export type CustomActionRequest<I> = DesktopRunRequest<any> & {
    script: 'external.custom.hello';
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


    getType(): string {
        return 'StatefulActionHandler'
    }

    async hello(input: CustomHelloActionInput): Promise<CustomHelloActionOutput> {
        console.info("sessions", this.sessions);
        this.sessions = {
            "test": "test"
        }
        return {
            testOutput: {
                "myTest": "123"
            }
        };
    }


    async run(request: DesktopRunRequest<any>): Promise<DesktopRunResponse<any>> {
        const customAction: CustomActionRequest<any> = request as CustomActionRequest<any>;
        let output: any = {};
        switch (customAction.script) {
            case 'external.custom.hello':
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
