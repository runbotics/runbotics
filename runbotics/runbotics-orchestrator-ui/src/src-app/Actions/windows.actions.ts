import { ActionRegex, WindowsAction } from 'runbotics-common';

import { translate } from '#src-app/hooks/useTranslations';

import { IBpmnAction, Runner } from './types';

type GetWindowsActions = () => Record<string, IBpmnAction>;

// eslint-disable-next-line max-lines-per-function
const getWindowsActions: GetWindowsActions = () => ({
    [WindowsAction.IS_WINDOW_OPEN]: {
        id: WindowsAction.IS_WINDOW_OPEN,
        label: translate('Process.Details.Modeler.Actions.Windows.IsWindowOpen.Label'),
        script: WindowsAction.IS_WINDOW_OPEN,
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
                                title: translate('Process.Details.Modeler.Actions.Windows.Common.WindowTitle'),
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
                            info: translate('Process.Details.Modeler.Actions.Windows.Common.WindowTitle.Info'),
                        }
                    },
                },
            },
            formData: {},
        },
    },
    [WindowsAction.GET_ELEMENT]: {
        id: WindowsAction.GET_ELEMENT,
        label: translate('Process.Details.Modeler.Actions.Windows.GetElement.Label'),
        script: WindowsAction.GET_ELEMENT,
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
                                title: translate('Process.Details.Modeler.Actions.Windows.Common.WindowTitle'),
                                type: 'string',
                            },
                            locator: {
                                title: translate('Process.Details.Modeler.Actions.Windows.Common.Locator'),
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
                                title: translate('Process.Details.Modeler.Actions.Windows.GetElement.Output'),
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
                            info: translate('Process.Details.Modeler.Actions.Windows.Common.WindowTitle.Info'),
                        }
                    },
                    locator: {
                        'ui:options': {
                            info: translate('Process.Details.Modeler.Actions.Windows.Common.Locator.Info'),
                        }
                    },
                },
            },
            formData: {},
        }
    },
    [WindowsAction.LIST_WINDOWS]: {
        id: WindowsAction.LIST_WINDOWS,
        label: translate('Process.Details.Modeler.Actions.Windows.ListWindows.Label'),
        script: WindowsAction.LIST_WINDOWS,
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
                                title: translate('Process.Details.Modeler.Actions.Windows.ListWindows.Output'),
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
    [WindowsAction.MOUSE_CLICK]: {
        id: WindowsAction.MOUSE_CLICK,
        label: translate('Process.Details.Modeler.Actions.Windows.MouseClick.Label'),
        script: WindowsAction.MOUSE_CLICK,
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
                                title: translate('Process.Details.Modeler.Actions.Windows.Common.WindowTitle'),
                                type: 'string',
                            },
                            locator: {
                                title: translate('Process.Details.Modeler.Actions.Windows.Common.Locator'),
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
                            info: translate('Process.Details.Modeler.Actions.Windows.Common.WindowTitle.Info'),
                        }
                    },
                    locator: {
                        'ui:options': {
                            info: translate('Process.Details.Modeler.Actions.Windows.Common.Locator.Info'),
                        }
                    },
                },
            },
            formData: {},
        }
    },
    [WindowsAction.WAIT_FOR_ELEMENT]: {
        id: WindowsAction.WAIT_FOR_ELEMENT,
        label: translate('Process.Details.Modeler.Actions.Windows.WaitForElement.Label'),
        script: WindowsAction.WAIT_FOR_ELEMENT,
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
                                title: translate('Process.Details.Modeler.Actions.Windows.Common.WindowTitle'),
                                type: 'string',
                            },
                            locator: {
                                title: translate('Process.Details.Modeler.Actions.Windows.Common.Locator'),
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
                                title: translate('Process.Details.Modeler.Actions.Windows.WaitForElement.Output'),
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
                            info: translate('Process.Details.Modeler.Actions.Windows.Common.WindowTitle.Info'),
                        }
                    },
                    locator: {
                        'ui:options': {
                            info: translate('Process.Details.Modeler.Actions.Windows.Common.Locator.Info'),
                        }
                    },
                },
            },
            formData: {},
        }
    },
    [WindowsAction.PRESS_KEYS]: {
        id: WindowsAction.PRESS_KEYS,
        label: translate('Process.Details.Modeler.Actions.Windows.PressKeys.Label'),
        script: WindowsAction.PRESS_KEYS,
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
                                title: translate('Process.Details.Modeler.Actions.Windows.Common.WindowTitle'),
                                type: 'string',
                            },
                            keys: {
                                title: translate('Process.Details.Modeler.Actions.Windows.PressKeys.Keys'),
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
                            info: translate('Process.Details.Modeler.Actions.Windows.Common.WindowTitle.Info'),
                        }
                    },
                    keys: {
                        'ui:options': {
                            info: translate('Process.Details.Modeler.Actions.Windows.PressKeys.Keys.Info'),
                        }
                    },
                },
            },
            formData: {},
        }
    },
    [WindowsAction.SEND_KEYS]: {
        id: WindowsAction.SEND_KEYS,
        label: translate('Process.Details.Modeler.Actions.Windows.SendKeys.Label'),
        script: WindowsAction.SEND_KEYS,
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
                                title: translate('Process.Details.Modeler.Actions.Windows.Common.WindowTitle'),
                                type: 'string',
                            },
                            locator: {
                                title: translate('Process.Details.Modeler.Actions.Windows.Common.Locator'),
                                type: 'string',
                            },
                            keys: {
                                title: translate('Process.Details.Modeler.Actions.Windows.SendKeys.Keys'),
                                type: 'string',
                            },
                            sendEnter: {
                                title: translate('Process.Details.Modeler.Actions.Windows.SendKeys.SendEnter'),
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
                            info: translate('Process.Details.Modeler.Actions.Windows.Common.WindowTitle.Info'),
                        }
                    },
                    locator: {
                        'ui:options': {
                            info: translate('Process.Details.Modeler.Actions.Windows.Common.Locator.Info'),
                        }
                    },
                    keys: {
                        'ui:options': {
                            info: translate('Process.Details.Modeler.Actions.Windows.SendKeys.Keys.Info'),
                        }
                    },
                    sendEnter: {
                        'ui:options': {
                            info: translate('Process.Details.Modeler.Actions.Windows.SendKeys.SendEnter.Info'),
                        }
                    },
                },
            },
            formData: {},
        }
    },
    [WindowsAction.MINIMIZE_WINDOW]: {
        id: WindowsAction.MINIMIZE_WINDOW,
        label: translate('Process.Details.Modeler.Actions.Windows.MinimizeWindow.Label'),
        script: WindowsAction.MINIMIZE_WINDOW,
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
                                title: translate('Process.Details.Modeler.Actions.Windows.Common.WindowTitle'),
                                type: 'string',
                            },
                            locator: {
                                title: translate('Process.Details.Modeler.Actions.Windows.Common.Locator'),
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
                            info: translate('Process.Details.Modeler.Actions.Windows.Common.WindowTitle.Info'),
                        }
                    },
                    locator: {
                        'ui:options': {
                            info: translate('Process.Details.Modeler.Actions.Windows.Common.Locator.Info'),
                        }
                    },
                },
            },
            formData: {},
        }
    },
    [WindowsAction.MAXIMIZE_WINDOW]: {
        id: WindowsAction.MAXIMIZE_WINDOW,
        label: translate('Process.Details.Modeler.Actions.Windows.MaximizeWindow.Label'),
        script: WindowsAction.MAXIMIZE_WINDOW,
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
                                title: translate('Process.Details.Modeler.Actions.Windows.Common.WindowTitle'),
                                type: 'string',
                            },
                            locator: {
                                title: translate('Process.Details.Modeler.Actions.Windows.Common.Locator'),
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
                            info: translate('Process.Details.Modeler.Actions.Windows.Common.WindowTitle.Info'),
                        }
                    },
                    locator: {
                        'ui:options': {
                            info: translate('Process.Details.Modeler.Actions.Windows.Common.Locator.Info'),
                        }
                    },
                },
            },
            formData: {},
        },
    },
});

export default getWindowsActions;
