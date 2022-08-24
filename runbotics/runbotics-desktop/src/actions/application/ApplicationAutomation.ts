import { Injectable } from '@nestjs/common';
import { DesktopRunRequest } from 'runbotics-sdk';
import { StatefulActionHandler } from 'runbotics-sdk';
import { DesktopRunResponse } from 'runbotics-sdk';
import child from 'child_process';
import { Expressions } from 'bpmn-elements';
import { RunboticsLogger } from '../../logger/RunboticsLogger';

export type ApplicationActionRequest<I> = DesktopRunRequest<any> & {
    script: 'application.launch' | 'application.close';
};

export type ApplicationLaunchActionInput = {
    sid: string;
};
export type ApplicationLaunchActionOutput = {};

export class ApplicationAutomation extends StatefulActionHandler {
    private sessions: Record<string, child.ChildProcess> = {};
    private readonly logger = new RunboticsLogger(ApplicationAutomation.name);

    constructor() {
        super();
    }

    async launch(input: ApplicationLaunchActionInput): Promise<ApplicationLaunchActionOutput> {
        const replacedPath = '"' + input.sid + '"';

        const session: child.ChildProcess = child.exec(replacedPath, (error, stdout, stderr) => {
            if (error != null) {
                this.logger.log(stderr);
                // error handling & exit
            }

            // normal
        });

        this.sessions['session'] = session;

        return {};
    }

    async close(input: ApplicationLaunchActionInput): Promise<ApplicationLaunchActionOutput> {
        this.logger.error('Close action is not supported yet');
        // process.kill(this.sessions["session"].pid)
        delete this.sessions['session'];

        return {};
    }

    async run(request: DesktopRunRequest<any>): Promise<DesktopRunResponse<any>> {
        const action: ApplicationActionRequest<any> = request as ApplicationActionRequest<any>;
        let output: any = {};
        switch (action.script) {
            case 'application.launch':
                output = await this.launch(action.input);
                break;
            case 'application.close':
                output = await this.close(action.input);
                break;

            default:
                throw new Error('Action not found');
        }

        return {
            status: 'ok',
            output: output,
        };
    }

    async tearDown() {
        delete this.sessions;
    }
}
