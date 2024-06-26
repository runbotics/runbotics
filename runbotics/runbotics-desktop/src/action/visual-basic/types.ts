import { DesktopRunRequest } from '@runbotics/runbotics-sdk';
import { VisualBasicAction } from 'runbotics-common';

export type VisualBasicActionRequest = DesktopRunRequest<VisualBasicAction.RUN_SCRIPT, RunScriptActionInput>;

export type RunScriptActionInput = {
    scriptPath: string;
    scriptArguments: string;
};

export type RunScriptActionOutput = {
    output: any;
};
