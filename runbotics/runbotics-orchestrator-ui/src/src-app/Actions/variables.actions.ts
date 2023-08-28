import { VariableAction } from 'runbotics-common';

import { translate } from '#src-app/hooks/useTranslations';

import { IBpmnAction, Runner, RegexPatterns } from './types';

const getVariablesActions: () => Record<string, IBpmnAction> = () => ({
    'variables.assign': {
        id: VariableAction.ASSIGN,
        label: translate(
            'Process.Details.Modeler.Actions.Variables.Assign.Label'
        ),
        script: VariableAction.ASSIGN,
        runner: Runner.DESKTOP_SCRIPT,
        form: {
            schema: {
                type: 'object',
                properties: {
                    input: {
                        title: translate(
                            'Process.Details.Modeler.Actions.Common.Input'
                        ),
                        type: 'object',
                        properties: {
                            variable: {
                                title: translate(
                                    'Process.Details.Modeler.Actions.Common.VariableName'
                                ),
                                type: 'string',
                                pattern: RegexPatterns.VARIABLE_NAME,
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
                    variable: undefined,
                    value: undefined
                }
            }
        }
    },
    'variables.assignList': {
        id: VariableAction.ASSIGN_LIST,
        label: translate(
            'Process.Details.Modeler.Actions.Variables.AssignList.Label'
        ),
        script: VariableAction.ASSIGN_LIST,
        runner: Runner.DESKTOP_SCRIPT,
        form: {
            schema: {
                type: 'object',
                properties: {
                    input: {
                        title: translate(
                            'Process.Details.Modeler.Actions.Common.Input'
                        ),
                        type: 'object',
                        properties: {
                            variable: {
                                title: translate(
                                    'Process.Details.Modeler.Actions.Common.VariableName'
                                ),
                                type: 'string',
                                pattern: VARIABLE_NAME_PATTERN,
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
                    variable: undefined,
                    value: ['']
                }
            }
        }
    },
    'variables.assignGlobalVariable': {
        id: VariableAction.ASSIGN_GLOBAL,
        label: translate(
            'Process.Details.Modeler.Actions.Variables.AssignGlobalVariable.Label'
        ),
        script: VariableAction.ASSIGN_LIST,
        runner: Runner.DESKTOP_SCRIPT,
        form: {
            schema: {
                type: 'object',
                properties: {
                    input: {
                        title: translate(
                            'Process.Details.Modeler.Actions.Common.Input'
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
