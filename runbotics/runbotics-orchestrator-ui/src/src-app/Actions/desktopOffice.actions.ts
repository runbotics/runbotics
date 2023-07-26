import { translate } from '#src-app/hooks/useTranslations';

import { IBpmnAction, Runner, ActionSystem } from './types';



// eslint-disable-next-line max-lines-per-function
const getDesktopOfficeActions: () => Record<string, IBpmnAction> = () => ({
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
        id: 'desktop.powerpoint.insert',
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

export default getDesktopOfficeActions;
