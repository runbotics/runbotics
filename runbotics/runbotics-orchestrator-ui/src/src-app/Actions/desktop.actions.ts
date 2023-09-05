import { DesktopAction } from 'runbotics-common';

import { translate } from '#src-app/hooks/useTranslations';

import { IBpmnAction, Runner } from './types';


// eslint-disable-next-line max-lines-per-function
const getDesktopActions: () => Record<string, IBpmnAction> = () => ({
    'desktop.click': {
        id: DesktopAction.CLICK,
        label: translate('Process.Details.Modeler.Actions.Desktop.Click.Label'),
        script: DesktopAction.CLICK,
        runner: Runner.DESKTOP_SCRIPT,
        form: {
            schema: {
                type: 'object',
                properties: {
                    input: {
                        title: translate('Process.Details.Modeler.Actions.Common.Input'),
                        type: 'object',
                        properties: {
                            clickTarget: {
                                title: translate('Process.Details.Modeler.Actions.Desktop.Click.Target'),
                                type: 'string',
                                enum: [
                                    'Point',
                                    'Region'
                                ]
                            },
                            
                            mouseButton: {
                                title: translate('Process.Details.Modeler.Actions.Desktop.Click.MouseButton'),
                                type:'string',
                                enum: [
                                    'LEFT',
                                    'RIGHT'
                                ]
                            },
                            doubleClick: {
                                title: translate('Process.Details.Modeler.Actions.Desktop.Click.DoubleClick'),
                                type: 'boolean',
                            },
                        },
                        required: ['clickTarget', 'mouseButton'],
                        dependencies: {
                            clickTarget: {
                                oneOf: [
                                    {
                                        properties: {
                                            clickTarget: {
                                                enum: [
                                                    'Point'
                                                ]
                                            },
                                            point: {
                                                title: translate('Process.Details.Modeler.Actions.Desktop.Click.Point'),
                                                type: 'string',
                                            },
                                        },
                                        required: ['point']
                                    },
                                    {
                                        properties: {
                                            clickTarget: {
                                                enum: [
                                                    'Region'
                                                ]
                                            },
                                            region: {
                                                title: translate('Process.Details.Modeler.Actions.Desktop.Click.Region'),
                                                type: 'string',
                                            },
                                        },
                                        required: ['region']
                                    }
                                ]
                            }
                        }
                    },
                },
            },
            uiSchema: {
                'ui:order': ['input'],
                input: {
                    region: {
                        'ui:options': {
                            info: translate('Process.Details.Modeler.Actions.Desktop.Common.Region.Info'),
                        }
                    },
                    point: {
                        'ui:options': {
                            info: translate('Process.Details.Modeler.Actions.Desktop.Common.Point.Info'),
                        }
                    },
                },
            },
            formData: {
                input: {
                    clickTarget: 'Point',
                    mouseButton: 'LEFT',
                    doubleClick: false,
                },
            },
        },
    },
    'desktop.type': {
        id: DesktopAction.TYPE,
        label: translate('Process.Details.Modeler.Actions.Desktop.Type.Label'),
        script: DesktopAction.TYPE,
        runner: Runner.DESKTOP_SCRIPT,
        form: {
            schema: {
                type: 'object',
                properties: {
                    input: {
                        title: translate('Process.Details.Modeler.Actions.Common.Input'),
                        type: 'object',
                        properties: {
                            text: {
                                title: translate('Process.Details.Modeler.Actions.Desktop.Type.Text'),
                                type: 'string',
                            }
                        },
                        required: ['text'],
                    },
                },
            },
            uiSchema: {
                'ui:order': ['input']
            },
            formData: {
                input: {
                    text: undefined
                },
            },
        },
    },
    'desktop.copy': {
        id: DesktopAction.COPY,
        label: translate('Process.Details.Modeler.Actions.Desktop.Copy.Label'),
        script: DesktopAction.COPY,
        runner: Runner.DESKTOP_SCRIPT,
        form: {
            schema: {
                type: 'object',
                properties: {
                    input: {
                        title: translate('Process.Details.Modeler.Actions.Common.Input'),
                        type: 'object',
                        properties: {
                            text: {
                                title: translate('Process.Details.Modeler.Actions.Desktop.Copy.Text'),
                                type: 'string',
                            }
                        },
                    },
                },
            },
            uiSchema: {
                'ui:order': ['input'],
                input: {
                    text: {
                        'ui:options': {
                            info: translate('Process.Details.Modeler.Actions.Desktop.Copy.Text.Info'),
                        }
                    },
                },
            },
            formData: {},
        },
    },
    'desktop.paste': {
        id: DesktopAction.PASTE,
        label: translate('Process.Details.Modeler.Actions.Desktop.Paste.Label'),
        script: DesktopAction.PASTE,
        runner: Runner.DESKTOP_SCRIPT,
        form: {
            schema: {},
            uiSchema: {},
            formData: {},
        },
    },
    'desktop.cursorSelect': {
        id: DesktopAction.CURSOR_SELECT,
        label: translate('Process.Details.Modeler.Actions.Desktop.CursorSelect.Label'),
        script: DesktopAction.CURSOR_SELECT,
        runner: Runner.DESKTOP_SCRIPT,
        form: {
            schema: {
                type: 'object',
                properties: {
                    input: {
                        title: translate('Process.Details.Modeler.Actions.Common.Input'),
                        type: 'object',
                        properties: {
                            startPoint: {
                                title: translate('Process.Details.Modeler.Actions.Desktop.CursorSelect.StartPoint'),
                                type: 'string',
                            },
                            endPoint: {
                                title: translate('Process.Details.Modeler.Actions.Desktop.CursorSelect.EndPoint'),
                                type: 'string',
                            },
                        },
                        required: ['startPoint', 'endPoint'],
                    },
                },
            },
            uiSchema: {
                'ui:order': ['input'],
                input: {
                    startPoint: {
                        'ui:options': {
                            info: translate('Process.Details.Modeler.Actions.Desktop.Common.Point.Info'),
                        }
                    },
                    endPoint: {
                        'ui:options': {
                            info: translate('Process.Details.Modeler.Actions.Desktop.Common.Point.Info'),
                        }
                    },
                },
            },
            formData: {
                input: {
                    startPoint: undefined,
                    endPoint: undefined,
                },
            },
        },
    },
    'desktop.readClipboardContent': {
        id: DesktopAction.READ_CLIPBOARD_CONTENT,
        label: translate('Process.Details.Modeler.Actions.Desktop.ReadClipboardContent.Label'),
        script: DesktopAction.READ_CLIPBOARD_CONTENT,
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
                                title: translate('Process.Details.Modeler.Actions.Common.VariableName'),
                                type: 'string',
                            },
                        },
                        required: ['variableName'],
                    },
                },
            },
            uiSchema: {
                'ui:order': ['output'],
            },
            formData: {
                output: {
                    variableName: undefined,
                },
            },
        },
    },
    'desktop.maximizeActiveWindow': {
        id: DesktopAction.MAXIMIZE_ACTIVE_WINDOW,
        label: translate('Process.Details.Modeler.Actions.Desktop.MaximizeActiveWindow.Label'),
        script: DesktopAction.MAXIMIZE_ACTIVE_WINDOW,
        runner: Runner.DESKTOP_SCRIPT,
        form: {
            schema: {},
            uiSchema: {},
            formData: {},
        },
    },
    'desktop.takeScreenshot': {
        id: DesktopAction.TAKE_SCREENSHOT,
        label: translate('Process.Details.Modeler.Actions.Desktop.TakeScreenshot.Label'),
        script: DesktopAction.TAKE_SCREENSHOT,
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
                            imageName: {
                                title: translate('Process.Details.Modeler.Actions.Desktop.TakeScreenshot.ImageName'),
                                type: 'string',
                            },
                            imageFormat: {
                                title: translate('Process.Details.Modeler.Actions.Desktop.TakeScreenshot.ImageFormat'),
                                type: 'string',
                                enum: [
                                    'PNG',
                                    'JPG'
                                ]
                            },
                            imagePath: {
                                title: translate('Process.Details.Modeler.Actions.Desktop.TakeScreenshot.ImagePath'),
                                type: 'string',
                            },
                            region: {
                                title: translate('Process.Details.Modeler.Actions.Desktop.TakeScreenshot.Region'),
                                type: 'string',
                            },
                        },
                    },
                    output: {
                        title: translate('Process.Details.Modeler.Actions.Common.Output'),
                        type: 'object',
                        properties: {
                            variableName: {
                                title: translate('Process.Details.Modeler.Actions.Common.VariableName'),
                                type: 'string',
                            },
                        },
                        required: ['variableName'],
                    },
                },
            },
            uiSchema: {
                'ui:order': ['input', 'output'],
                input: {
                    region: {
                        'ui:options': {
                            info: translate('Process.Details.Modeler.Actions.Desktop.TakeScreenshot.Region.Info'),
                        }
                    },
                },
            },
            formData: {
                input: {
                    imageFormat: 'PNG'
                },
                output: {
                    variableName: undefined,
                },
            },
        },
    },
    'desktop.readTextFromImage': {
        id: DesktopAction.READ_TEXT_FROM_IMAGE,
        label: translate('Process.Details.Modeler.Actions.Desktop.ReadTextFromImage.Label'),
        script: DesktopAction.READ_TEXT_FROM_IMAGE,
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
                            imageFullPath: {
                                title: translate('Process.Details.Modeler.Actions.Desktop.Common.ImageFullPath'),
                                type: 'string',
                            },
                            language: {
                                title: translate('Process.Details.Modeler.Actions.Desktop.ReadTextFromImage.Language'),
                                type: 'string',
                                enum: [
                                    'POL',
                                    'DEU',
                                    'ENG'
                                ]
                            },
                        },
                        required: ['imageFullPath'],
                    },
                    output: {
                        title: translate('Process.Details.Modeler.Actions.Common.Output'),
                        type: 'object',
                        properties: {
                            variableName: {
                                title: translate('Process.Details.Modeler.Actions.Common.VariableName'),
                                type: 'string',
                            },
                        },
                        required: ['variableName'],
                    },
                },
            },
            uiSchema: {
                'ui:order': ['input', 'output'],
                input: {
                    imageFullPath: {
                        'ui:options': {
                            info: translate('Process.Details.Modeler.Actions.Desktop.Common.ImageFullPath.Info'),
                        }
                    },
                },
            },
            formData: {
                input: {
                    imageFullPath: undefined,
                    language: 'ENG',
                },
                output: {
                    variableName: undefined,
                },
            },
        },
    }
});

export default getDesktopActions;
