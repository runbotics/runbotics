import { translate } from '#src-app/hooks/useTranslations';

import { IBpmnAction, Runner } from './types';

const getVariablesActions: () => Record<string, IBpmnAction> = () => ({
    'variables.assign': {
        id: 'variables.assign',
        label: translate(
            'Process.Details.Modeler.Actions.Variables.Assign.Label'
        ),
        script: 'variables.assign',
        runner: Runner.DESKTOP_SCRIPT,
        form: {
            schema: {
                type: 'object',
                properties: {
                    input: {
                        title: translate(
                            'Process.Details.Modeler.Actions.Variable.Assign.Input'
                        ),
                        type: 'object',
                        properties: {
                            variable: {
                                title: translate(
                                    'Process.Details.Modeler.Actions.Variable.Assign.Variable'
                                ),
                                type: 'string',
                                pattern: '^[a-zA-Z0-9_]*$'
                            },

                            value: {
                                type: 'string',
                                title: translate(
                                    'Process.Details.Modeler.Actions.Variable.Assign.Value'
                                )
                            }
                        },
                        required: ['variable', 'value']
                    }
                }
            },
            uiSchema: {
                'ui:order': ['input']
            },
            formData: {
                input: {
                    variable: null,
                    value: null
                }
            }
        }
    },
    'variables.assignList': {
        id: 'variables.assignList',
        label: translate(
            'Process.Details.Modeler.Actions.Variables.AssignList.Label'
        ),
        script: 'variables.assignList',
        runner: Runner.DESKTOP_SCRIPT,
        form: {
            schema: {
                type: 'object',
                properties: {
                    input: {
                        title: translate(
                            'Process.Details.Modeler.Actions.Variable.AssignList.Input'
                        ),
                        type: 'object',
                        properties: {
                            variable: {
                                title: translate(
                                    'Process.Details.Modeler.Actions.Variable.AssignList.Variable'
                                ),
                                type: 'string'
                            },
                            value: {
                                title: translate(
                                    'Process.Details.Modeler.Actions.Variable.AssignList.List'
                                ),
                                type: 'array',
                                items: {
                                    type: 'string'
                                }
                            }
                        },
                        required: ['variable', 'value']
                    }
                }
            },
            uiSchema: {
                'ui:order': ['input']
            },
            formData: {
                input: {
                    variable: null,
                    value: ['']
                }
            }
        }
    },
    'variables.assignGlobalVariable': {
        id: 'variables.assignGlobalVariable',
        label: translate(
            'Process.Details.Modeler.Actions.Variables.AssignGlobalVariable.Label'
        ),
        script: 'variables.assignGlobalVariable',
        runner: Runner.DESKTOP_SCRIPT,
        form: {
            schema: {
                type: 'object',
                properties: {
                    input: {
                        title: translate(
                            'Process.Details.Modeler.Actions.Variables.AssignGlobalVariable.Input'
                        ),
                        type: 'object',
                        properties: {
                            globalVariables: {
                                title: translate(
                                    'Process.Details.Modeler.Actions.Variables.AssignGlobalVariable.GlobalVariables'
                                ),
                                type: 'array',
                                items: {
                                    type: 'string'
                                }
                            }
                        },
                        required: ['globalVariables']
                    }
                }
            },
            uiSchema: {
                'ui:order': ['input'],
                input: {
                    globalVariables: {
                        items: {
                            'ui:widget': 'GlobalVariableSelectWidget'
                        }
                    }
                }
            },
            formData: {
                input: {
                    globalVariables: []
                }
            }
        }
    }
});

export default getVariablesActions;
