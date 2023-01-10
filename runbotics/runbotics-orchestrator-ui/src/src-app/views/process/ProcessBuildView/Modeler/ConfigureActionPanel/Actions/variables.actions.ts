import { translate } from '#src-app/hooks/useTranslations';

import { IBpmnAction, Runner } from './types';



const getVariablesActions: () => Record<string, IBpmnAction> = () => ({
    'variables.assign': {
        id: 'variables.assign',
        label: translate('Process.Details.Modeler.Actions.Variables.Assign.Label'),
        script: 'variables.assign',
        runner: Runner.DESKTOP_SCRIPT,
        form: {
            schema: {
                type: 'object',
                properties: {
                    input: {
                        title: translate('Process.Details.Modeler.Actions.Variable.Assign.Input'),
                        type: 'object',
                        properties: {
                            variable: {
                                title: translate('Process.Details.Modeler.Actions.Variable.Assign.Variable'),
                                type: 'string',
                                pattern: '^[a-zA-Z0-9_]*$',
                            },

                            value: {
                                type: 'string',
                                title: translate('Process.Details.Modeler.Actions.Variable.Assign.Value'),
                            },
                        },
                        required: ['variable', 'value'],
                    },
                },
            },
            uiSchema: {
                'ui:order': ['input'],
            },
            formData: {
                input: {
                    variable: undefined,
                    value: undefined,
                },
            },
        },
    },
    'variables.assignList': {
        id: 'variables.assignList',
        label: translate('Process.Details.Modeler.Actions.Variables.AssignList.Label'),
        script: 'variables.assignList',
        runner: Runner.DESKTOP_SCRIPT,
        form: {
            schema: {
                type: 'object',
                properties: {
                    input: {
                        title: translate('Process.Details.Modeler.Actions.Variable.AssignList.Input'),
                        type: 'object',
                        properties: {
                            variable: {
                                title: translate('Process.Details.Modeler.Actions.Variable.AssignList.Variable'),
                                type: 'string',
                            },
                            value: {
                                title: translate('Process.Details.Modeler.Actions.Variable.AssignList.List'),
                                type: 'array',
                                items: {
                                    type: 'string',
                                },
                            },
                        },
                        required: ['variable', 'value'],
                    },
                },
            },
            uiSchema: {
                'ui:order': ['input'],
            },
            formData: {
                input: {
                    variable: undefined,
                    value: [''],
                },
            },
        },
    },
    'variables.assignGlobalVariable': {
        id: 'variables.assignGlobalVariable',
        label: translate('Process.Details.Modeler.Actions.Variables.AssignGlobalVariable.Label'),
        script: 'variables.assignGlobalVariable',
        legacy: true,
        runner: Runner.DESKTOP_SCRIPT,
        form: {
            schema: {
                type: 'object',
                properties: {
                    input: {
                        title: translate('Process.Details.Modeler.Actions.Variable.AssignGlobal.Input'),
                        type: 'object',
                        properties: {
                            globalVariable: {
                                title: translate(
                                    'Process.Details.Modeler.Actions.Variable.AssignGlobal.GlobalVariable',
                                ),
                                type: 'number',
                            },
                        },
                        required: ['globalVariable'],
                    },
                },
            },
            uiSchema: {
                input: {
                    globalVariable: {
                        'ui:widget': 'GlobalVariableSelectWidget',
                    },
                },
            },
            formData: {
                input: {
                    globalVariable: undefined,
                },
            },
        },
    },

    'variables.assignMultipleGlobalVariable': {
        id: 'variables.assignMultipleGlobalVariable',
        label: translate('Process.Details.Modeler.Actions.Variables.AssignMultipleGlobalVariable.Label'),
        script: 'variables.assignMultipleGlobalVariable',
        runner: Runner.DESKTOP_SCRIPT,
        form: {
            schema: {
                type: 'object',
                properties: {
                    input: {
                        title: translate('Process.Details.Modeler.Actions.Variable.AssignGlobal.Input'),
                        type: 'object',
                        properties: {
                            globalVariables: {
                                title: translate(
                                    'Process.Details.Modeler.Actions.Variables.AssignMultipleGlobalVariable.GlobalVariables',
                                ),
                                type: 'array',
                                items: {
                                    type: 'string',
                                }
                            },
                        },
                        required: ['globalVariables'],
                    },
                },
            },
            uiSchema: {
                'ui:order': ['input'],
                input: {
                    globalVariables: {
                        items: {
                            'ui:widget': 'GlobalVariableSelectWidget',
                        }
                    },
                },
            },
            formData: {
                input: {
                    globalVariables: [],
                },
            },
        },
    },
});

export default getVariablesActions;
