import { translate } from '#src-app/hooks/useTranslations';

import { IBpmnAction, Runner } from './types';



// eslint-disable-next-line max-lines-per-function
const getCsvActions: () => Record<string, IBpmnAction> = () => ({
    'import.csv': {
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
                        title: translate('Process.Details.Modeler.Actions.CSV.Import.Input'),
                        type: 'object',
                        properties: {
                            file: {
                                type: 'string',
                                format: 'data-url',
                                title: translate('Process.Details.Modeler.Actions.CSV.Import.SingleFile'),
                            },
                        },
                        required: [],
                    },
                    output: {
                        title: translate('Process.Details.Modeler.Actions.CSV.Import.Output'),
                        type: 'object',
                        properties: {
                            variableName: {
                                title: translate('Process.Details.Modeler.Actions.CSV.Import.Variable'),
                                description: translate('Process.Details.Modeler.Actions.CSV.Import.VariableText'),
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
                    variableName: '',
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
                        title: translate('Process.Details.Modeler.Actions.CSV.AppendFile.Input'),
                        type: 'object',
                        properties: {
                            path: {
                                title: translate('Process.Details.Modeler.Actions.CSV.AppendFile.Path'),
                                type: 'string',
                            },
                            content: {
                                title: translate('Process.Details.Modeler.Actions.CSV.AppendFile.Content'),
                                type: 'string',
                            },
                            separator: {
                                title: translate('Process.Details.Modeler.Actions.CSV.AppendFile.Separator'),
                                type: 'string',
                            },
                        },
                        required: ['path', 'content', 'separator'],
                    },
                    output: {
                        title: translate('Process.Details.Modeler.Actions.CSV.AppendFile.Output'),
                        type: 'object',
                        properties: {
                            variableName: {
                                title: translate('Process.Details.Modeler.Actions.CSV.AppendFile.Variable'),
                                description: translate('Process.Details.Modeler.Actions.CSV.AppendFile.VariableText'),
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
                    path: '',
                    content: '',
                    separator: '',
                },
                output: {
                    variableName: '',
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
                        title: translate('Process.Details.Modeler.Actions.CSV.ReadFile.Input'),
                        type: 'object',
                        properties: {
                            path: {
                                title: translate('Process.Details.Modeler.Actions.CSV.ReadFile.Path'),
                                type: 'string',
                            },
                            separator: {
                                title: translate('Process.Details.Modeler.Actions.CSV.ReadFile.Separator'),
                                type: 'string',
                            },
                        },
                        required: ['path', 'separator'],
                    },
                    output: {
                        title: translate('Process.Details.Modeler.Actions.CSV.ReadFile.Output'),
                        type: 'object',
                        properties: {
                            variableName: {
                                title: translate('Process.Details.Modeler.Actions.CSV.ReadFile.Variable'),
                                description: translate('Process.Details.Modeler.Actions.CSV.ReadFile.VariableText'),
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
                    path: '',
                    separator: '',
                },
                output: {
                    variableName: '',
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
                        title: translate('Process.Details.Modeler.Actions.CSV.WriteFile.Input'),
                        type: 'object',
                        properties: {
                            path: {
                                title: translate('Process.Details.Modeler.Actions.CSV.WriteFile.Path'),
                                type: 'string',
                            },
                            content: {
                                title: translate('Process.Details.Modeler.Actions.CSV.WriteFile.Content'),
                                type: 'string',
                            },
                            separator: {
                                title: translate('Process.Details.Modeler.Actions.CSV.WriteFile.Separator'),
                                type: 'string',
                            },
                        },
                        required: ['path', 'content', 'separator'],
                    },
                    output: {
                        title: translate('Process.Details.Modeler.Actions.CSV.WriteFile.Output'),
                        type: 'object',
                        properties: {
                            variableName: {
                                title: translate('Process.Details.Modeler.Actions.CSV.WriteFile.Variable'),
                                description: translate('Process.Details.Modeler.Actions.CSV.WriteFile.VariableText'),
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
                    path: '',
                    content: '',
                    separator: '',
                },
                output: {
                    variableName: '',
                },
            },
        },
    },
});

export default getCsvActions;
