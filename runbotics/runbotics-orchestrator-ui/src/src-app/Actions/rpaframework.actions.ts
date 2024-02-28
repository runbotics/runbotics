import { ActionRegex, RpaFrameworkAction } from 'runbotics-common';

import { translate } from '#src-app/hooks/useTranslations';

import { IBpmnAction, Runner } from './types';

type GetRpaFrameworkActions = () => Record<string, IBpmnAction>;

// eslint-disable-next-line max-lines-per-function
const getRpaFrameworkActions: GetRpaFrameworkActions = () => ({
    [RpaFrameworkAction.IS_WINDOW_OPEN]: {
        id: RpaFrameworkAction.IS_WINDOW_OPEN,
        label: translate('Process.Details.Modeler.Actions.RpaFramework.IsWindowOpen.Label'),
        script: RpaFrameworkAction.IS_WINDOW_OPEN,
        runner: Runner.DESKTOP_SCRIPT,
        output: {
            assignVariables: true,
            outputMethods: {
                variableName: '${content.output[0]}',
            },
        },
        form: {
            schema: {
                type: 'object',
                properties: {
                    input: {
                        title: translate('Process.Details.Modeler.Actions.Common.Input'),
                        type: 'object',
                        properties: {
                            windowTitle: {
                                title: translate('Process.Details.Modeler.Actions.RpaFramework.Common.WindowTitle'),
                                type: 'string',
                            }
                        },
                        required: ['windowTitle'],
                    },
                    output: {
                        title: translate('Process.Details.Modeler.Actions.Common.Output'),
                        type: 'object',
                        properties: {
                            variableName: {
                                title: translate('Process.Details.Modeler.Actions.Common.VariableName'),
                                type: 'string',
                                pattern: ActionRegex.VARIABLE_NAME,
                                default: 'isOpen'
                            },
                        },
                    },
                },
            },
            uiSchema: {
                'ui:order': ['input', 'output'],
                input: {
                    windowTitle: {
                        'ui:options': {
                            info: translate('Process.Details.Modeler.Actions.RpaFramework.Common.WindowTitle.Info'),
                        }
                    },
                },
            },
            formData: {},
        },
    },
    [RpaFrameworkAction.GET_ELEMENT]: {
        id: RpaFrameworkAction.GET_ELEMENT,
        label: translate('Process.Details.Modeler.Actions.RpaFramework.GetElement.Label'),
        script: RpaFrameworkAction.GET_ELEMENT,
        runner: Runner.DESKTOP_SCRIPT,
        output: {
            assignVariables: true,
            outputMethods: {
                variableName: '${content.output[0]}',
            },
        },
        form: {
            schema: {
                type: 'object',
                properties: {
                    input: {
                        title: translate('Process.Details.Modeler.Actions.Common.Input'),
                        type: 'object',
                        properties: {
                            windowTitle: {
                                title: translate('Process.Details.Modeler.Actions.RpaFramework.Common.WindowTitle'),
                                type: 'string',
                            },
                            locator: {
                                title: translate('Process.Details.Modeler.Actions.RpaFramework.Common.Locator'),
                                type: 'string',
                            },
                        },
                        required: ['windowTitle', 'locator'],
                    },
                    output: {
                        title: translate('Process.Details.Modeler.Actions.Common.Output'),
                        type: 'object',
                        properties: {
                            variableName: {
                                title: translate('Process.Details.Modeler.Actions.RpaFramework.GetElement.Output'),
                                type: 'string',
                                pattern: ActionRegex.VARIABLE_NAME,
                                default: 'outputElement'
                            },
                        },
                    },
                },
            },
            uiSchema: {
                'ui:order': ['input', 'output'],
                input: {
                    windowTitle: {
                        'ui:options': {
                            info: translate('Process.Details.Modeler.Actions.RpaFramework.Common.WindowTitle.Info'),
                        }
                    },
                    locator: {
                        'ui:options': {
                            info: translate('Process.Details.Modeler.Actions.RpaFramework.Common.Locator.Info'),
                        }
                    },
                },
            },
            formData: {},
        }
    },
    [RpaFrameworkAction.LIST_WINDOWS]: {
        id: RpaFrameworkAction.LIST_WINDOWS,
        label: translate('Process.Details.Modeler.Actions.RpaFramework.ListWindows.Label'),
        script: RpaFrameworkAction.LIST_WINDOWS,
        runner: Runner.DESKTOP_SCRIPT,
        output: {
            assignVariables: true,
            outputMethods: {
                variableName: '${content.output[0]}',
            },
        },
        form: {
            schema: {
                type: 'object',
                properties: {
                    output: {
                        title: translate('Process.Details.Modeler.Actions.Common.Output'),
                        type: 'object',
                        properties: {
                            variableName: {
                                title: translate('Process.Details.Modeler.Actions.RpaFramework.ListWindows.Output'),
                                type: 'string',
                                pattern: ActionRegex.VARIABLE_NAME,
                                default: 'outputWindowsList'
                            },
                        },
                    },
                },
            },
            uiSchema: {
                'ui:order': ['output'],
            },
            formData: {},
        }
    },
    [RpaFrameworkAction.MOUSE_CLICK]: {
        id: RpaFrameworkAction.MOUSE_CLICK,
        label: translate('Process.Details.Modeler.Actions.RpaFramework.MouseClick.Label'),
        script: RpaFrameworkAction.MOUSE_CLICK,
        runner: Runner.DESKTOP_SCRIPT,
        form: {
            schema: {
                type: 'object',
                properties: {
                    input: {
                        title: translate('Process.Details.Modeler.Actions.Common.Input'),
                        type: 'object',
                        properties: {
                            windowTitle: {
                                title: translate('Process.Details.Modeler.Actions.RpaFramework.Common.WindowTitle'),
                                type: 'string',
                            },
                            locator: {
                                title: translate('Process.Details.Modeler.Actions.RpaFramework.Common.Locator'),
                                type: 'string',
                            },
                        },
                        required: ['windowTitle', 'locator'],
                    },
                },
            },
            uiSchema: {
                'ui:order': ['input'],
                input: {
                    windowTitle: {
                        'ui:options': {
                            info: translate('Process.Details.Modeler.Actions.RpaFramework.Common.WindowTitle.Info'),
                        }
                    },
                    locator: {
                        'ui:options': {
                            info: translate('Process.Details.Modeler.Actions.RpaFramework.Common.Locator.Info'),
                        }
                    },
                },
            },
            formData: {},
        }
    },
    [RpaFrameworkAction.WAIT_FOR_ELEMENT]: {
        id: RpaFrameworkAction.WAIT_FOR_ELEMENT,
        label: translate('Process.Details.Modeler.Actions.RpaFramework.WaitForElement.Label'),
        script: RpaFrameworkAction.WAIT_FOR_ELEMENT,
        runner: Runner.DESKTOP_SCRIPT,
        output: {
            assignVariables: true,
            outputMethods: {
                variableName: '${content.output[0]}',
            },
        },
        form: {
            schema: {
                type: 'object',
                properties: {
                    input: {
                        title: translate('Process.Details.Modeler.Actions.Common.Input'),
                        type: 'object',
                        properties: {
                            windowTitle: {
                                title: translate('Process.Details.Modeler.Actions.RpaFramework.Common.WindowTitle'),
                                type: 'string',
                            },
                            locator: {
                                title: translate('Process.Details.Modeler.Actions.RpaFramework.Common.Locator'),
                                type: 'string',
                            },
                        },
                        required: ['windowTitle', 'locator'],
                    },
                    output: {
                        title: translate('Process.Details.Modeler.Actions.Common.Output'),
                        type: 'object',
                        properties: {
                            variableName: {
                                title: translate('Process.Details.Modeler.Actions.RpaFramework.WaitForElement.Output'),
                                type: 'string',
                                pattern: ActionRegex.VARIABLE_NAME,
                                default: 'awaitedElement'
                            },
                        },
                    },
                },
            },
            uiSchema: {
                'ui:order': ['input', 'output'],
                input: {
                    windowTitle: {
                        'ui:options': {
                            info: translate('Process.Details.Modeler.Actions.RpaFramework.Common.WindowTitle.Info'),
                        }
                    },
                    locator: {
                        'ui:options': {
                            info: translate('Process.Details.Modeler.Actions.RpaFramework.Common.Locator.Info'),
                        }
                    },
                },
            },
            formData: {},
        }
    },
    [RpaFrameworkAction.PRESS_KEYS]: {
        id: RpaFrameworkAction.PRESS_KEYS,
        label: translate('Process.Details.Modeler.Actions.RpaFramework.PressKeys.Label'),
        script: RpaFrameworkAction.PRESS_KEYS,
        runner: Runner.DESKTOP_SCRIPT,
        form: {
            schema: {
                type: 'object',
                properties: {
                    input: {
                        title: translate('Process.Details.Modeler.Actions.Common.Input'),
                        type: 'object',
                        properties: {
                            windowTitle: {
                                title: translate('Process.Details.Modeler.Actions.RpaFramework.Common.WindowTitle'),
                                type: 'string',
                            },
                            keys: {
                                title: translate('Process.Details.Modeler.Actions.RpaFramework.PressKeys.Keys'),
                                type: 'string',
                            },
                        },
                        required: ['windowTitle', 'keys'],
                    },
                },
            },
            uiSchema: {
                'ui:order': ['input'],
                input: {
                    windowTitle: {
                        'ui:options': {
                            info: translate('Process.Details.Modeler.Actions.RpaFramework.Common.WindowTitle.Info'),
                        }
                    },
                    keys: {
                        'ui:options': {
                            info: translate('Process.Details.Modeler.Actions.RpaFramework.PressKeys.Keys.Info'),
                        }
                    },
                },
            },
            formData: {},
        }
    },
    [RpaFrameworkAction.SEND_KEYS]: {
        id: RpaFrameworkAction.SEND_KEYS,
        label: translate('Process.Details.Modeler.Actions.RpaFramework.SendKeys.Label'),
        script: RpaFrameworkAction.SEND_KEYS,
        runner: Runner.DESKTOP_SCRIPT,
        form: {
            schema: {
                type: 'object',
                properties: {
                    input: {
                        title: translate('Process.Details.Modeler.Actions.Common.Input'),
                        type: 'object',
                        properties: {
                            windowTitle: {
                                title: translate('Process.Details.Modeler.Actions.RpaFramework.Common.WindowTitle'),
                                type: 'string',
                            },
                            locator: {
                                title: translate('Process.Details.Modeler.Actions.RpaFramework.Common.Locator'),
                                type: 'string',
                            },
                            keys: {
                                title: translate('Process.Details.Modeler.Actions.RpaFramework.SendKeys.Keys'),
                                type: 'string',
                            },
                            sendEnter: {
                                title: translate('Process.Details.Modeler.Actions.RpaFramework.SendKeys.SendEnter'),
                                type: 'boolean',
                                default: false
                            },
                        },
                        required: ['windowTitle', 'locator'],
                    },
                },
            },
            uiSchema: {
                'ui:order': ['input'],
                input: {
                    windowTitle: {
                        'ui:options': {
                            info: translate('Process.Details.Modeler.Actions.RpaFramework.Common.WindowTitle.Info'),
                        }
                    },
                    locator: {
                        'ui:options': {
                            info: translate('Process.Details.Modeler.Actions.RpaFramework.Common.Locator.Info'),
                        }
                    },
                    keys: {
                        'ui:options': {
                            info: translate('Process.Details.Modeler.Actions.RpaFramework.SendKeys.Keys.Info'),
                        }
                    },
                    sendEnter: {
                        'ui:options': {
                            info: translate('Process.Details.Modeler.Actions.RpaFramework.SendKeys.SendEnter.Info'),
                        }
                    },
                },
            },
            formData: {},
        }
    },
    [RpaFrameworkAction.MINIMIZE_WINDOW]: {
        id: RpaFrameworkAction.MINIMIZE_WINDOW,
        label: translate('Process.Details.Modeler.Actions.RpaFramework.MinimizeWindow.Label'),
        script: RpaFrameworkAction.MINIMIZE_WINDOW,
        runner: Runner.DESKTOP_SCRIPT,
        form: {
            schema: {
                type: 'object',
                properties: {
                    input: {
                        title: translate('Process.Details.Modeler.Actions.Common.Input'),
                        type: 'object',
                        properties: {
                            windowTitle: {
                                title: translate('Process.Details.Modeler.Actions.RpaFramework.Common.WindowTitle'),
                                type: 'string',
                            },
                            locator: {
                                title: translate('Process.Details.Modeler.Actions.RpaFramework.Common.Locator'),
                                type: 'string',
                            },
                        },
                        required: ['windowTitle', 'locator'],
                    },
                },
            },
            uiSchema: {
                'ui:order': ['input'],
                input: {
                    windowTitle: {
                        'ui:options': {
                            info: translate('Process.Details.Modeler.Actions.RpaFramework.Common.WindowTitle.Info'),
                        }
                    },
                    locator: {
                        'ui:options': {
                            info: translate('Process.Details.Modeler.Actions.RpaFramework.Common.Locator.Info'),
                        }
                    },
                },
            },
            formData: {},
        }
    },
    [RpaFrameworkAction.MAXIMIZE_WINDOW]: {
        id: RpaFrameworkAction.MAXIMIZE_WINDOW,
        label: translate('Process.Details.Modeler.Actions.RpaFramework.MaximizeWindow.Label'),
        script: RpaFrameworkAction.MAXIMIZE_WINDOW,
        runner: Runner.DESKTOP_SCRIPT,
        form: {
            schema: {
                type: 'object',
                properties: {
                    input: {
                        title: translate('Process.Details.Modeler.Actions.Common.Input'),
                        type: 'object',
                        properties: {
                            windowTitle: {
                                title: translate('Process.Details.Modeler.Actions.RpaFramework.Common.WindowTitle'),
                                type: 'string',
                            },
                            locator: {
                                title: translate('Process.Details.Modeler.Actions.RpaFramework.Common.Locator'),
                                type: 'string',
                            },
                        },
                        required: ['windowTitle', 'locator'],
                    },
                },
            },
            uiSchema: {
                'ui:order': ['input'],
                input: {
                    windowTitle: {
                        'ui:options': {
                            info: translate('Process.Details.Modeler.Actions.RpaFramework.Common.WindowTitle.Info'),
                        }
                    },
                    locator: {
                        'ui:options': {
                            info: translate('Process.Details.Modeler.Actions.RpaFramework.Common.Locator.Info'),
                        }
                    },
                },
            },
            formData: {},
        },
    },
});

export default getRpaFrameworkActions;
