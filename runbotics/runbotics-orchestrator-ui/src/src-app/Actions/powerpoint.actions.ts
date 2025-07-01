import { translate } from '#src-app/hooks/useTranslations';

import { IBpmnAction, Runner, ActionSystem } from './types';

// eslint-disable-next-line max-lines-per-function
const getPowerPointActions: () => Record<string, IBpmnAction> = () => ({
    'powerpoint.open': {
        id: 'powerpoint.open',
        label: translate('Process.Details.Modeler.Actions.Powerpoint.Open.Label'),
        script: 'powerpoint.open',
        runner: Runner.DESKTOP_SCRIPT,
        system: ActionSystem.WINDOWS,
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
                            filePath: {
                                title: translate('Process.Details.Modeler.Actions.PowerPoint.Open.FilePath'),
                                type: 'string',
                            },
                        },
                        required: ['filePath'],
                    },
                    output: {
                        title: translate('Process.Details.Modeler.Actions.Common.Output'),
                        type: 'object',
                        properties: {},
                        required: [],
                    },
                },
            },
            uiSchema: {
                'ui:order': ['input', 'output'],
            },
            formData: {
                input: {
                    filePath: undefined,
                },
                output: {},
            },
        },
    },
    'powerpoint.insert': {
        id: 'powerpoint.insert',
        label: translate('Process.Details.Modeler.Actions.Powerpoint.Insert.Label'),
        script: 'powerpoint.insert',
        runner: Runner.DESKTOP_SCRIPT,
        system: ActionSystem.WINDOWS,
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
                            filePath: {
                                title: translate(
                                    'Process.Details.Modeler.Actions.PowerPoint.CopySlide.FilePath',
                                ),
                                type: 'string',
                            },
                            index: {
                                title: translate(
                                    'Process.Details.Modeler.Actions.PowerPoint.CopySlide.Index',
                                ),
                                type: 'string',
                            },
                            slideStart: {
                                title: translate(
                                    'Process.Details.Modeler.Actions.PowerPoint.CopySlide.SlideStart',
                                ),
                                type: 'string',
                            },
                            slideEnd: {
                                title: translate(
                                    'Process.Details.Modeler.Actions.PowerPoint.CopySlide.SlideEnd',
                                ),
                                type: 'string',
                            },
                        },
                        required: ['filePath'],
                    },
                },
            },
            uiSchema: {
                'ui:order': ['input'],
                input: {
                    filePath: {
                        'ui:options': {
                            info: translate('Process.Details.Modeler.Actions.PowerPoint.CopySlide.FilePath.Tooltip')
                        }
                    },
                    index: {
                        'ui:options': {
                            info: translate('Process.Details.Modeler.Actions.PowerPoint.CopySlide.Index.Tooltip')
                        }
                    },
                    slideStart: {
                        'ui:options': {
                            info: translate('Process.Details.Modeler.Actions.PowerPoint.CopySlide.SlideStart.Tooltip')
                        }
                    },
                    slideEnd: {
                        'ui:options': {
                            info: translate('Process.Details.Modeler.Actions.PowerPoint.CopySlide.SlideEnd.Tooltip')
                        }
                    }
                }
            },
            formData: {
                input: {
                    filePath: undefined,
                    index: undefined,
                    slideStart: undefined,
                    slideEnd: undefined,
                    index: undefined,
                    slideStart: undefined,
                    slideEnd: undefined,
                },
            },
        },
    },
    'powerpoint.save': {
        id: 'powerpoint.save',
        label: translate('Process.Details.Modeler.Actions.Powerpoint.Save.Label'),
        script: 'powerpoint.save',
        runner: Runner.DESKTOP_SCRIPT,
        system: ActionSystem.WINDOWS,
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
                        properties: {},
                        required: [],
                    },
                    output: {
                        title: translate('Process.Details.Modeler.Actions.Common.Output'),
                        type: 'object',
                        properties: {},
                        required: [],
                    },
                },
            },
            uiSchema: {
                'ui:order': ['input', 'output'],
            },
            formData: {
                input: {},
                output: {},
            },
        },
    },
    'powerpoint.runMacro': {
        id: 'powerpoint.runMacro',
        label: translate('Process.Details.Modeler.Actions.Powerpoint.RunMacro.Label'),
        script: 'powerpoint.runMacro',
        runner: Runner.DESKTOP_SCRIPT,
        system: ActionSystem.WINDOWS,
        form: {
            schema: {
                type: 'object',
                properties: {
                    input: {
                        title: translate('Process.Details.Modeler.Actions.Common.Input'),
                        type: 'object',
                        properties: {
                            macro: {
                                title: translate('Process.Details.Modeler.Actions.Powerpoint.RunMacro.Title'),
                                type: 'string',
                            },
                            functionParams: {
                                title: translate('Process.Details.Modeler.Actions.Powerpoint.RunMacro.FunctionParams'),
                                description: translate('Process.Details.Modeler.Actions.Powerpoint.RunMacro.FunctionParams.Info'),
                                type: 'array',
                                items: {
                                    type: 'string',
                                },
                                maxItems: 30,
                            },
                        },
                        required: ['macro'],
                    },
                },
            },
            uiSchema: {},
            formData: {},
        },
    },
    'powerpoint.close': {
        id: 'powerpoint.close',
        label: translate('Process.Details.Modeler.Actions.Powerpoint.Close.Label'),
        script: 'powerpoint.close',
        runner: Runner.DESKTOP_SCRIPT,
        system: ActionSystem.WINDOWS,
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
                        properties: {},
                        required: [],
                    },
                },
            },
            uiSchema: {
                'ui:order': ['input'],
            },
            formData: {
                input: {},
            },
        },
    },
});

export default getPowerPointActions;
