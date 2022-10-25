import { JSONSchema7 } from 'json-schema';
import { UiSchema } from '@rjsf/core';

export enum Runner {
    BROWSER_BACKGROUND_SCRIPT = '${environment.services.backgroundScript()}',
    BROWSER_FRONTEND_SCRIPT = '${environment.services.run()}',
    DESKTOP_SCRIPT = '${environment.services.desktop()}',
    BPMN = '',
    NO_RUNNER = '',
}

export enum ActionSystem {
    WINDOWS = 'Windows',
    LINUX = 'Linux',
}

export enum CloudPath {
    ROOT = 'root',
    SITE = 'site',
}

export type IActionField = {
    id: string;
    label: string;
    defaultValue: string;
};

export type IActionOutput = {
    assignVariables: boolean;
    outputMethods: Record<string, string>;
};

export type IActionInput = Record<string, unknown>;

export type IFormData = Record<string, any> & {
    input?: Record<string, any>;
    output?: Record<string, any>;
    disabled?: boolean;
};
export type IForm = {
    schema: JSONSchema7;
    uiSchema: UiSchema;
    formData: IFormData;
};

export type IBpmnAction = {
    id: string;
    runner: Runner;
    script: string;
    label: string;
    translateKey?: string;
    system?: ActionSystem;
    input?: IActionInput;
    output?: IActionOutput;
    form?: IForm;
};
