import { translate } from 'src/hooks/useTranslations';

import { IBpmnAction, Runner } from './types';

const getVariablesActions: () => Record<string, IBpmnAction> = () => ({
    'variables.assign': {
        id: 'variables.assign',
        label: translate('Process.Details.Modeler.Actions.Variable.Assign.Label'),
        translateKey: 'Process.Details.Modeler.Actions.Variable.Assign.Label',
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
        label: translate('Process.Details.Modeler.Actions.Variable.AssignList.Label'),
        translateKey: 'Process.Details.Modeler.Actions.Variable.AssignList.Label',
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
        label: translate('Process.Details.Modeler.Actions.Variable.AssignGlobal.Label'),
        translateKey: 'Process.Details.Modeler.Actions.Variable.AssignGlobal.Label',
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
});

export default getVariablesActions;
