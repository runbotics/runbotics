import { DesktopRunRequest } from '@runbotics/runbotics-sdk';
import { StatefulActionHandler } from '@runbotics/runbotics-sdk';
import { StatelessActionHandler } from '@runbotics/runbotics-sdk';
import { DesktopRunResponse } from '@runbotics/runbotics-sdk';
// @ts-ignore
import * as winax from 'winax';

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


    async hello(input: CustomHelloActionInput): Promise<CustomHelloActionOutput> {
        console.info("input", input);
        this.sessions['session'] = new winax.Object('PowerPoint.Application', { activate: true });

        this.sessions['session'].Presentations.Open("C:\\Downloads\\SN_INFO_BotRPAAMSProspectMonitoringStepByStep_2021_04_22_4.pptx")

        this.openedFiles['session'] = "C:\\Downloads\\SN_INFO_BotRPAAMSProspectMonitoringStepByStep_2021_04_22_4.pptx"

        return {
            testOutput: {
                "myTest": "dfgsdgf"
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
