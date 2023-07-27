import { translate } from '#src-app/hooks/useTranslations';

import { IBpmnAction, Runner } from './types';

// eslint-disable-next-line max-lines-per-function
const getLoopActions = (): Record<string, IBpmnAction> => ({
    'loop.loop': {
        id: 'loop.loop',
        label: translate('Process.Details.Modeler.Actions.Loop.Loop2.Label'),
        script: 'loop.loop',
        runner: Runner.BPMN,
        output: {
            assignVariables: false,
            outputMethods: {},
        },
        form: {
            schema: {
                type: 'object',
                properties: {
                    input: {
                        title: translate('Process.Details.Modeler.Actions.Common.Input'),
                        type: 'object',
                        properties: {
                            loopType: {
                                title: translate('Process.Details.Modeler.Actions.Common.Input'),
                                type: 'string',
                                enum: ['Collection', 'Repeat'],
                                default: ['Repeat'],
                            },
                        },
                        dependencies: {
                            loopType: {
                                oneOf: [
                                    {
                                        properties: {
                                            loopType: {
                                                enum: ['Collection'],
                                            },
                                            collection: {
                                                title: translate('Process.Details.Modeler.Actions.Common.VariableName'),
                                                type: 'string',
                                                format: 'variableName',
                                            },
                                            elementVariable: {
                                                title: translate('Process.Details.Modeler.Actions.Loop.Loop2.ElementVariable'),
                                                type: 'string',
                                            },
                                        },
                                        required: ['collection'],
                                    },
                                    {
                                        properties: {
                                            loopType: {
                                                enum: ['Repeat'],
                                            },
                                            iterations: {
                                                title: translate('Process.Details.Modeler.Actions.Loop.Loop2.NumberOfIterations'),
                                                type: 'string',
                                            },
                                        },
                                        required: ['iterations'],
                                    },
                                ],
                            },
                        },
                    },
                },
            },
            uiSchema: {
                'ui:order': ['input', 'output'],
                input: {
                    collection: {
                        'ui:options': {
                            info: translate('Process.Details.Modeler.Actions.Loop.Loop2.Collection.Info'),
                        }
                    },
                    elementVariable: {
                        'ui:options': {
                            info: translate('Process.Details.Modeler.Actions.Loop.Loop2.ElementVariable.Info'),
                        }
                    },
                    iterations: {
                        'ui:options': {
                            info: translate('Process.Details.Modeler.Actions.Loop.Loop2.NumberOfIterations.Info'),
                        }
                    }
                }
            },
            formData: {
                input: {
                    collection: undefined,
                    elementVariable: undefined,
                    iterations: '1',
                },
                output: {},
            },
        },
    },
});

export default getLoopActions;
