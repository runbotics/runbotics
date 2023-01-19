import { DesktopRunRequest } from 'runbotics-sdk';
import { StatefulActionHandler } from 'runbotics-sdk';
import { DesktopRunResponse } from 'runbotics-sdk';
import child from 'child_process';
import { promisify } from 'util';
import { RunboticsLogger } from '../../logger/RunboticsLogger';

export type ApplicationActionRequest<I> = DesktopRunRequest<any> & {
    script: 'application.launch' | 'application.close';
};

export type ApplicationLaunchActionInput = {
    location: string;
};
export type ApplicationLaunchActionOutput = {};

class ApplicationAutomation extends StatefulActionHandler {
    private sessions: Record<string, child.ChildProcess> = {};
    private readonly logger = new RunboticsLogger(ApplicationAutomation.name);

    constructor() {
        super();
    }

    async launch(input: ApplicationLaunchActionInput): Promise<ApplicationLaunchActionOutput> {
        let command = '';

        if (input.location.includes('"', 0) && input.location.includes('"', -1)) {
            command = input.location;
        } else {
            command = '"' + input.location + '"';
        }

        const asyncExec = promisify(child.exec);

        const execPromise = asyncExec(command);
        this.sessions['session'] = execPromise.child;

        execPromise.catch((error) => {
            throw new Error(error.stderr);
        });

        return {};
    }

    async close(input: ApplicationLaunchActionInput): Promise<ApplicationLaunchActionOutput> {
        this.logger.error('Close action is not supported yet');
        // this.sessions["session"].kill('SIGKILL');
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

export default ApplicationAutomation;
