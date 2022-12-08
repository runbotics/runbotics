import { translate } from '#src-app/hooks/useTranslations';

import { IBpmnAction, Runner } from './types';



const getGeneralActions: () => Record<string, IBpmnAction> = () => ({
    'general.console.log': {
        id: 'general.console.log',
        label: translate('Process.Details.Modeler.Actions.General.Console.Log.Label'),
        script: 'general.console.log',
        runner: Runner.DESKTOP_SCRIPT,
        form: {
            schema: {
                type: 'object',
                properties: {
                    input: {
                        title: '',
                        properties: {
                            variables: {
                                title: translate('Process.Details.Modeler.Actions.General.ConsoleLog.Input'),
                                type: 'object',
                                additionalProperties: {
                                    mainFieldLabel: translate('Process.Details.Modeler.Actions.General.ConsoleLog.Message'),
                                    subFieldLabel: translate('Process.Details.Modeler.Actions.General.ConsoleLog.Variable'),
                                    isRequired: true,
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
        id: 'general.delay',
        label: translate('Process.Details.Modeler.Actions.General.Delay.Label'),
        script: 'general.delay',
        runner: Runner.DESKTOP_SCRIPT,
        form: {
            schema: {
                type: 'object',
                properties: {
                    input: {
                        title: translate('Process.Details.Modeler.Actions.General.Delay.Input'),
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
        id: 'general.startProcess',
        label: translate('Process.Details.Modeler.Actions.General.StartProcess.Label'),
        script: 'general.startProcess',
        runner: Runner.DESKTOP_SCRIPT,
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
                        title: translate('Process.Details.Modeler.Actions.General.StartProcess.Input'),
                        type: 'object',
                        properties: {
                            processName: {
                                title: translate('Process.Details.Modeler.Actions.General.StartProcess.ProcessName'),
                                type: 'string',
                            },
                            variables: {
                                title: translate(
                                    'Process.Details.Modeler.Actions.General.StartProcess.VariablesPassedToProcess',
                                ),
                                type: 'object',
                                additionalProperties: {
                                    type: 'string',
                                },
                            },
                        },
                        required: ['processName'],
                    },
                    output: {
                        title: translate('Process.Details.Modeler.Actions.General.StartProcess.Ouput'),
                        type: 'object',
                        properties: {
                            variableName: {
                                title: translate('Process.Details.Modeler.Actions.General.StartProcess.Variable'),
                                description: translate(
                                    'Process.Details.Modeler.Actions.General.StartProcess.VariableText',
                                ),
                                type: 'string',
                            },
                        },
                        required: [],
                    },
                },
            },
            uiSchema: {
                'ui:order': ['input', 'output'],
                input: {
                    processName: {
                        'ui:widget': 'ProcessNameSuggestionWidget',
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
});

export default getGeneralActions;
