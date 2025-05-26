/* eslint-disable max-lines-per-function */
import { GeneralAction, ActionRegex } from 'runbotics-common';

import { translate } from '#src-app/hooks/useTranslations';

import { IBpmnAction, Runner } from './types';

const getGeneralActions: () => Record<string, IBpmnAction> = () => ({
    'general.console.log': {
        id: GeneralAction.CONSOLE_LOG,
        label: translate('Process.Details.Modeler.Actions.General.Console.Log.Label'),
        script: GeneralAction.CONSOLE_LOG,
        runner: Runner.DESKTOP_SCRIPT,
        form: {
            schema: {
                type: 'object',
                properties: {
                    input: {
                        title: '',
                        properties: {
                            variables: {
                                title: translate('Process.Details.Modeler.Actions.Common.Input'),
                                type: 'object',
                                additionalProperties: {
                                    mainFieldLabel: translate('Process.Details.Modeler.Actions.General.ConsoleLog.Message'),
                                    subFieldLabel: translate('Process.Details.Modeler.Actions.Common.VariableName'),
                                    isRequired: false,
                                    type: 'string',
                                },
                            },
                        },
                        required: [],
                    },
                },
            },
            uiSchema: {
                'ui:order': ['input'],
            },
            formData: {},
        },
    },
    'general.delay': {
        id: GeneralAction.DELAY,
        label: translate('Process.Details.Modeler.Actions.General.Delay.Label'),
        script: GeneralAction.DELAY,
        runner: Runner.DESKTOP_SCRIPT,
        form: {
            schema: {
                type: 'object',
                properties: {
                    input: {
                        title: translate('Process.Details.Modeler.Actions.Common.Input'),
                        type: 'object',
                        properties: {
                            delay: {
                                title: translate('Process.Details.Modeler.Actions.General.Delay.Delay'),
                                type: 'string',
                            },
                            unit: {
                                type: 'string',
                                title: translate('Process.Details.Modeler.Actions.General.Delay.Unit'),
                                enum: ['Milliseconds', 'Seconds'],
                            },
                        },
                        required: ['delay', 'unit'],
                    },
                },
            },
            uiSchema: {
                'ui:order': ['input'],
                unit: {
                    'ui:widget': 'radio',
                },
            },
            formData: {
                input: {
                    delay: undefined,
                    unit: 'Milliseconds',
                },
            },
        },
    },
    'general.startProcess': {
        id: GeneralAction.START_PROCESS,
        label: translate('Process.Details.Modeler.Actions.General.StartProcess.Label'),
        script: GeneralAction.START_PROCESS,
        runner: Runner.DESKTOP_SCRIPT,
        helperTextLabel: translate('Process.Details.Modeler.Actions.General.StartProcess.HelperTextLabel'),
        output: {
            assignVariables: true,
            outputMethods: {
                variableName: '${content.output[0]}',
            },
        },
        form: {
            schema: {
                type: 'object',
                properties: {
                    input: {
                        title: translate('Process.Details.Modeler.Actions.Common.Input'),
                        type: 'object',
                        properties: {
                            processId: {
                                title: translate('Process.Details.Modeler.Actions.General.StartProcess.Process'),
                                type: 'number',
                            },
                            variables: {
                                title: translate(
                                    'Process.Details.Modeler.Actions.General.StartProcess.ProcessInput',
                                ),
                                type: 'object',
                                additionalProperties: {
                                    type: 'string',
                                    subFieldInfo: translate('Process.Details.Modeler.Actions.General.StartProcess.ProcessInput.Tooltip'),
                                },
                            },
                        },
                        required: ['processId'],
                    },
                    output: {
                        title: translate('Process.Details.Modeler.Actions.Common.Output'),
                        type: 'object',
                        properties: {
                            variableName: {
                                title: translate('Process.Details.Modeler.Actions.Common.VariableName'),
                                type: 'string',
                                pattern: ActionRegex.VARIABLE_NAME,
                            },
                        },
                        required: [],
                    },
                },
            },
            uiSchema: {
                'ui:order': ['input', 'output'],
                input: {
                    processId: {
                        'ui:widget': 'ProcessNameSuggestionWidget',
                    },
                },
                output: {
                    variableName: {
                        'ui:options': {
                            info: translate('Process.Details.Modeler.Actions.Common.VariableName.Info'),
                        },
                    },
                },
            },
            formData: {
                input: {},
                output: {
                    variableName: undefined,
                },
            },
        },
    },
    'general.throwError': {
        id: GeneralAction.THROW_ERROR,
        label: translate('Process.Details.Modeler.Actions.General.ThrowError.Label'),
        script: GeneralAction.THROW_ERROR,
        runner: Runner.DESKTOP_SCRIPT,
        form: {
            schema: {
                type: 'object',
                properties: {
                    input: {
                        title: translate('Process.Details.Modeler.Actions.Common.Input'),
                        type: 'object',
                        properties: {
                            message: {
                                title: translate('Process.Details.Modeler.Actions.General.ThrowError.Message'),
                                type: 'string'
                            }
                        }
                    }
                }
            },
            formData: {
                input: {
                    message: undefined
                }
            },
            uiSchema: {
                'ui:order': ['input'],
            }
        }
    }
});

export default getGeneralActions;
