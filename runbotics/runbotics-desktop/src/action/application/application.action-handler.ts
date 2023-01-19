import { DesktopRunRequest } from 'runbotics-sdk';
import { StatefulActionHandler } from 'runbotics-sdk';
import { DesktopRunResponse } from 'runbotics-sdk';
import child from 'child_process';
import { promisify } from 'util';
import { RunboticsLogger } from '#logger';
import {
    ApplicationActionRequest, ApplicationLaunchActionInput, ApplicationLaunchActionOutput,
} from './types';

export default class ApplicationActionHandler extends StatefulActionHandler {
    private sessions: Record<string, child.ChildProcess> = {};
    private readonly logger = new RunboticsLogger(ApplicationActionHandler.name);

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

    async close() {
        this.logger.error('Close action is not supported yet');
        // this.sessions["session"].kill('SIGKILL');
        delete this.sessions['session'];
    }

    run(request: ApplicationActionRequest) {
        switch (request.script) {
            case 'application.launch':
                return this.launch(request.input);
            case 'application.close':
                return this.close();
            default:
                throw new Error('Action not found');
        }
    }

    async tearDown() {
        delete this.sessions;
    }
}
