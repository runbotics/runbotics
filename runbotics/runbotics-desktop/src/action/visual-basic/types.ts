import { DesktopRunRequest } from 'runbotics-sdk';
import { VisualBasicAction } from 'runbotics-common';

export type VisualBasicActionRequest = DesktopRunRequest<VisualBasicAction.RUN_MACRO, RunScriptActionInput>;

export type RunScriptActionInput = {
    scriptPath: string;
    scriptArguments: string;
};

export type RunScriptActionOutput = {
    output: any;
};
