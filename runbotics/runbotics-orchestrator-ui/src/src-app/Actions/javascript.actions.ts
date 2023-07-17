import { translate } from '#src-app/hooks/useTranslations';

import { IBpmnAction, Runner } from './types';



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
                        title: translate('Process.Details.Modeler.Actions.Javascript.RunTypescript.Input'),
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
                        title: translate('Process.Details.Modeler.Actions.Javascript.RunTypescript.Output'),
                        type: 'object',
                        properties: {
                            variableName: {
                                title: translate('Process.Details.Modeler.Actions.Javascript.RunTypescript.Variable'),
                                description: translate(
                                    'Process.Details.Modeler.Actions.Javascript.RunTypescript.VariableText',
                                ),
                                type: 'string',
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
                    variableName: null,
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
                        title: translate('Process.Details.Modeler.Actions.Javascript.RunJavascript.Input'),
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
                        title: translate('Process.Details.Modeler.Actions.Javascript.RunJavascript.Output'),
                        type: 'object',
                        properties: {
                            variableName: {
                                title: translate('Process.Details.Modeler.Actions.Javascript.RunJavascript.Variable'),
                                description: translate(
                                    'Process.Details.Modeler.Actions.Javascript.RunJavascript.VariableText',
                                ),
                                type: 'string',
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
                    variableName: null,
                },
            },
        },
    },
});

export default getJavascriptActions;
