import { UiSchema } from '@rjsf/core';
import { JSONSchema7 } from 'json-schema';

import { ActionCredentialType } from 'runbotics-common';

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
    runFromHere?: boolean;
    credentialType?: ActionCredentialType;
    processOutput?: boolean;
    validationError?: boolean;
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
    legacy?: boolean;
    label: string;
    translateKey?: string;
    system?: ActionSystem;
    helperTextLabel?: string;
    input?: IActionInput;
    output?: IActionOutput;
    form?: IForm;
    credentialType?: ActionCredentialType;
};

export type FormState = {
    id: string;
    formData: IFormData;
}
