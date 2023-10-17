import { DesktopRunRequest } from 'runbotics-sdk';

export type VisualBasicActionRequest = DesktopRunRequest<'vBasic.runMacro', RunMacroActionInput>;

export type RunMacroActionInput = {
    scriptPath: string;
    scriptArguments: string;
};

export type RunMacroActionOutput = {
    output: any;
};
