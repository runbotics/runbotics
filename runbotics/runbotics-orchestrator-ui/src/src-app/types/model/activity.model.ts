import { IProcessInstance } from 'runbotics-common';

export interface IActivity {
    executionId?: string;
    input?: string | null;
    output?: string | null;
    processInstance?: IProcessInstance | null;
}

export const defaultValue: Readonly<IActivity> = {};
