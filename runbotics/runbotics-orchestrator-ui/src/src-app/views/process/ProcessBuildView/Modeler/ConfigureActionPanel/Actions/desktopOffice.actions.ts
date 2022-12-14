import { translate } from '#src-app/hooks/useTranslations';

import { IBpmnAction, Runner, ActionSystem } from './types';



// eslint-disable-next-line max-lines-per-function
const getDesktopOfficeActions: () => Record<string, IBpmnAction> = () => ({
    'desktop.powerpoint.open': {
        id: 'desktop.powerpoint.open',
        label: translate('Process.Details.Modeler.Actions.Desktop.Powerpoint.Open.Label'),
        script: 'desktop.powerpoint.open',
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
                        title: translate('Process.Details.Modeler.Actions.DesktopPowerPoint.Open.Input'),
                        type: 'object',
                        properties: {
                            filePath: {
                                title: translate('Process.Details.Modeler.Actions.DesktopPowerPoint.Open.FilePath'),
                                type: 'string',
                            },
                        },
                        required: ['filePath'],
                    },
                    output: {
                        title: translate('Process.Details.Modeler.Actions.DesktopPowerPoint.Open.Output'),
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
                    filePath: '',
                },
                output: {},
            },
        },
    },
    'desktop.powerpoint.insert': {
        id: 'desktop.powerpoint.insert',
        label: translate('Process.Details.Modeler.Actions.Desktop.Powerpoint.Insert.Label'),
        script: 'desktop.powerpoint.insert',
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
                        title: translate('Process.Details.Modeler.Actions.DesktopPowerPoint.CopySlide.Input'),
                        type: 'object',
                        properties: {
                            filePath: {
                                title: translate(
                                    'Process.Details.Modeler.Actions.DesktopPowerPoint.CopySlide.FilePath',
                                ),
                                type: 'string',
                            },
                        },
                        required: ['filePath'],
                    },
                    output: {
                        title: translate('Process.Details.Modeler.Actions.DesktopPowerPoint.CopySlide.Output'),
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
                    filePath: '',
                },
                output: {},
            },
        },
    },
    'desktop.powerpoint.save': {
        id: 'desktop.powerpoint.save',
        label: translate('Process.Details.Modeler.Actions.Desktop.Powerpoint.Save.Label'),
        script: 'desktop.powerpoint.save',
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
                        title: translate('Process.Details.Modeler.Actions.DesktopPowerPoint.Save.Input'),
                        type: 'object',
                        properties: {},
                        required: [],
                    },
                    output: {
                        title: translate('Process.Details.Modeler.Actions.DesktopPowerPoint.Save.Output'),
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
    'desktop.powerpoint.close': {
        id: 'desktop.powerpoint.close',
        label: translate('Process.Details.Modeler.Actions.Desktop.Powerpoint.Close.Label'),
        script: 'desktop.powerpoint.close',
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
                        title: translate('Process.Details.Modeler.Actions.DesktopPowerPoint.Close.Input'),
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
