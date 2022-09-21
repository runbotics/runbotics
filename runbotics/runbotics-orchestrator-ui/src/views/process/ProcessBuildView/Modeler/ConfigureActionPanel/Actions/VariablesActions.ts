import { translate } from 'src/hooks/useTranslations';
import { IBpmnAction, Runner } from './types';

const variablesActions: Readonly<Record<string, IBpmnAction>> = {
    'variables.assign': {
        id: 'variables.assign',
        label: translate('Process.Details.Modeler.Actions.Variable.Assign.Label'),
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
                            variables: {
                                title: translate('Process.Details.Modeler.Actions.Variable.Assign.Variables'),
                                type: 'array',
                                minItems: 1,
                                items: {
                                    type: 'object',
                                    properties: {
                                        name: {
                                            title: translate('Process.Details.Modeler.Actions.Variable.Assign.Name'),
                                            type: 'string',
                                        },
                                        value: {
                                            type: 'string',
                                            title: translate('Process.Details.Modeler.Actions.Variable.Assign.Value'),
                                        },
                                    },
                                    required: ['name', 'value'],
                                },
                            },
                        },
                        required: ['variables'],
                    },
                },
            },
            uiSchema: {
                'ui:order': ['input'],
            },
            formData: {
                input: {
                    variables: undefined,
                },
            },
        },
    },
    'variables.assignList': {
        id: 'variables.assignList',
        label: translate('Process.Details.Modeler.Actions.Variable.AssignList.Label'),
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
                            name: {
                                title: translate('Process.Details.Modeler.Actions.Variable.AssignList.Name'),
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
                        required: ['name', 'value'],
                    },
                },
            },
            uiSchema: {
                'ui:order': ['input'],
            },
            formData: {
                input: {
                    name: undefined,
                    value: [''],
                },
            },
        },
    },
    'variables.assignGlobalVariable': {
        id: 'variables.assignGlobalVariable',
        label: translate('Process.Details.Modeler.Actions.Variable.AssignGlobal.Label'),
        script: 'variables.assignGlobalVariable',
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
};

export default variablesActions;
