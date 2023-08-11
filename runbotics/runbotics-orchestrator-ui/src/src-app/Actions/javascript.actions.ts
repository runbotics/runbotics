import { translate } from '#src-app/hooks/useTranslations';

import { IBpmnAction, Runner, Patterns } from './types';


// eslint-disable-next-line max-lines-per-function
const getJavascriptActions: () => Record<string, IBpmnAction> = () => ({
    'typescript.run': {
        id: 'typescript.run',
        label: translate('Process.Details.Modeler.Actions.Typescript.Run.Label'),
        script: 'typescript.run',
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
                            code: {
                                title: translate('Process.Details.Modeler.Actions.Javascript.RunTypescript.Code'),
                                type: 'string',
                            },
                            functionParams: {
                                title: translate(
                                    'Process.Details.Modeler.Actions.Javascript.RunTypescript.FunctionParams',
                                ),
                                type: 'object',
                                additionalProperties: {
                                    type: 'string',
                                },
                            },
                        },
                        required: ['code'],
                    },
                    output: {
                        title: translate('Process.Details.Modeler.Actions.Common.Output'),
                        type: 'object',
                        properties: {
                            variableName: {
                                title: translate('Process.Details.Modeler.Actions.Common.VariableName'),

                                type: 'string',
                                pattern: Patterns.VARIABLE_INPUT,
                            },
                        },
                        required: ['variableName'],
                    },
                },
            },
            uiSchema: {
                'ui:order': ['input', 'output'],
                input: {
                    code: {
                        'ui:widget': 'EditorWidget',
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
                input: {
                    code: `export = async function(params: Record<string, any>) {
    console.log('params ', params);
    return {
        "test": "test"
    }
}`,
                    functionParams: {},
                },
                output: {
                    variableName: undefined,
                },
            },
        },
    },
    'javascript.run': {
        id: 'javascript.run',
        label: translate('Process.Details.Modeler.Actions.Javascript.Run.Label'),
        script: 'javascript.run',
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
                            code: {
                                title: translate('Process.Details.Modeler.Actions.Javascript.RunJavascript.Code'),
                                type: 'string',
                            },
                            functionName: {
                                title: translate(
                                    'Process.Details.Modeler.Actions.Javascript.RunJavascript.FunctionName',
                                ),
                                type: 'string',
                            },
                            functionParams: {
                                title: translate(
                                    'Process.Details.Modeler.Actions.Javascript.RunJavascript.FunctionParams',
                                ),
                                type: 'object',
                                additionalProperties: {
                                    type: 'string',
                                },
                            },
                        },
                        required: ['code', 'functionName'],
                    },
                    output: {
                        title: translate('Process.Details.Modeler.Actions.Common.Output'),
                        type: 'object',
                        properties: {
                            variableName: {
                                title: translate('Process.Details.Modeler.Actions.Common.VariableName'),

                                type: 'string',
                                pattern: Patterns.VARIABLE_INPUT,
                            },
                        },
                        required: ['variableName'],
                    },
                },
            },
            uiSchema: {
                'ui:order': ['input', 'output'],
                input: {
                    code: {
                        'ui:widget': 'EditorWidget',
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
                input: {
                    code: `function myFunction(params) {
    console.log(params)
    return {
        "test": "asd"
    }
}`,
                    functionName: 'myFunction',
                    functionParams: {},
                },
                output: {
                    variableName: undefined,
                },
            },
        },
    },
});

export default getJavascriptActions;
