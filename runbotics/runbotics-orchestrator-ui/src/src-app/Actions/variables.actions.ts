import { translate } from '#src-app/hooks/useTranslations';

import { IBpmnAction, Runner } from './types';



const getVariablesActions: () => Record<string, IBpmnAction> = () => ({
    'variable.assign': {
        id: 'variable.assign',
        label: translate('Process.Details.Modeler.Actions.Variables.Assign.Label'),
        script: 'variable.assign',
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
    'variable.assignList': {
        id: 'variable.assignList',
        label: translate('Process.Details.Modeler.Actions.Variables.AssignList.Label'),
        script: 'variable.assignList',
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
    'variable.assignGlobalVariable': {
        id: 'variable.assignGlobalVariable',
        label: translate('Process.Details.Modeler.Actions.Variables.AssignGlobalVariable.Label'),
        script: 'variable.assignGlobalVariable',
        runner: Runner.DESKTOP_SCRIPT,
        form: {
            schema: {
                type: 'object',
                properties: {
                    input: {
                        title: translate('Process.Details.Modeler.Actions.Variables.AssignGlobalVariable.Input'),
                        type: 'object',
                        properties: {
                            globalVariables: {
                                title: translate(
                                    'Process.Details.Modeler.Actions.Variables.AssignGlobalVariable.GlobalVariables',
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
