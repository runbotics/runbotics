import { translate } from '#src-app/hooks/useTranslations';

import { IBpmnAction, Runner } from './types';



// eslint-disable-next-line max-lines-per-function
const getCsvActions: () => Record<string, IBpmnAction> = () => ({
    'csv.import': {
        id: 'import.csv',
        label: translate('Process.Details.Modeler.Actions.Import.Csv.Label'),
        script: 'import.csv',
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
                        title: translate('Process.Details.Modeler.Actions.Common.Input'),
                        type: 'object',
                        properties: {
                            file: {
                                type: 'string',
                                format: 'data-url',
                                title: translate('Process.Details.Modeler.Actions.Csv.Import.SingleFile'),
                            },
                        },
                        required: [],
                    },
                    output: {
                        title: translate('Process.Details.Modeler.Actions.Common.Output'),
                        type: 'object',
                        properties: {
                            variableName: {
                                title: translate('Process.Details.Modeler.Actions.Common.VariableName'),
                                description: translate('Process.Details.Modeler.Actions.Common.VariableMessage'),
                                type: 'string',
                            },
                        },
                        required: ['variableName'],
                    },
                },
            },
            uiSchema: {
                'ui:order': ['input', 'output'],
            },
            formData: {
                input: {},
                output: {
                    variableName: undefined,
                },
            },
        },
    },
    'csv.appendFile': {
        id: 'csv.appendFile',
        label: translate('Process.Details.Modeler.Actions.Csv.AppendFile.Label'),
        script: 'csv.appendFile',
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
                        title: translate('Process.Details.Modeler.Actions.Common.Input'),
                        type: 'object',
                        properties: {
                            path: {
                                title: translate('Process.Details.Modeler.Actions.Csv.AppendFile.Path'),
                                type: 'string',
                            },
                            content: {
                                title: translate('Process.Details.Modeler.Actions.Csv.AppendFile.Content'),
                                type: 'string',
                            },
                            separator: {
                                title: translate('Process.Details.Modeler.Actions.Csv.AppendFile.Separator'),
                                type: 'string',
                            },
                        },
                        required: ['path', 'content', 'separator'],
                    },
                    output: {
                        title: translate('Process.Details.Modeler.Actions.Common.Output'),
                        type: 'object',
                        properties: {
                            variableName: {
                                title: translate('Process.Details.Modeler.Actions.Common.VariableName'),
                                description: translate('Process.Details.Modeler.Actions.Common.VariableMessage'),
                                type: 'string',
                            },
                        },
                        required: ['variableName'],
                    },
                },
            },
            uiSchema: {
                'ui:order': ['input', 'output'],
            },
            formData: {
                input: {
                    path: undefined,
                    content: undefined,
                    separator: undefined,
                },
                output: {
                    variableName: undefined,
                },
            },
        },
    },
    'csv.readFile': {
        id: 'csv.readFile',
        label: translate('Process.Details.Modeler.Actions.Csv.ReadFile.Label'),
        script: 'csv.readFile',
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
                        title: translate('Process.Details.Modeler.Actions.Common.Input'),
                        type: 'object',
                        properties: {
                            path: {
                                title: translate('Process.Details.Modeler.Actions.Csv.ReadFile.Path'),
                                type: 'string',
                            },
                            separator: {
                                title: translate('Process.Details.Modeler.Actions.Csv.ReadFile.Separator'),
                                type: 'string',
                            },
                        },
                        required: ['path', 'separator'],
                    },
                    output: {
                        title: translate('Process.Details.Modeler.Actions.Common.Output'),
                        type: 'object',
                        properties: {
                            variableName: {
                                title: translate('Process.Details.Modeler.Actions.Common.VariableName'),
                                description: translate('Process.Details.Modeler.Actions.Common.VariableMessage'),
                                type: 'string',
                            },
                        },
                        required: ['variableName'],
                    },
                },
            },
            uiSchema: {
                'ui:order': ['input', 'output'],
            },
            formData: {
                input: {
                    path: undefined,
                    separator: undefined,
                },
                output: {
                    variableName: undefined,
                },
            },
        },
    },
    'csv.writeFile': {
        id: 'csv.writeFile',
        label: translate('Process.Details.Modeler.Actions.Csv.WriteFile.Label'),
        script: 'csv.writeFile',
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
                        title: translate('Process.Details.Modeler.Actions.Common.Input'),
                        type: 'object',
                        properties: {
                            path: {
                                title: translate('Process.Details.Modeler.Actions.Csv.WriteFile.Path'),
                                type: 'string',
                            },
                            content: {
                                title: translate('Process.Details.Modeler.Actions.Csv.WriteFile.Content'),
                                type: 'string',
                            },
                            separator: {
                                title: translate('Process.Details.Modeler.Actions.Csv.WriteFile.Separator'),
                                type: 'string',
                            },
                        },
                        required: ['path', 'content', 'separator'],
                    },
                    output: {
                        title: translate('Process.Details.Modeler.Actions.Common.Output'),
                        type: 'object',
                        properties: {
                            variableName: {
                                title: translate('Process.Details.Modeler.Actions.Common.VariableName'),
                                description: translate('Process.Details.Modeler.Actions.Common.VariableMessage'),
                                type: 'string',
                            },
                        },
                        required: ['variableName'],
                    },
                },
            },
            uiSchema: {
                'ui:order': ['input', 'output'],
            },
            formData: {
                input: {
                    path: undefined,
                    content: undefined,
                    separator: undefined,
                },
                output: {
                    variableName: undefined,
                },
            },
        },
    },
});

export default getCsvActions;
