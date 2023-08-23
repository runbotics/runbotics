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
                                            x: {
                                                title: translate('Process.Details.Modeler.Actions.Desktop.Click.X'),
                                                type: 'string',
                                            },
                                            y: {
                                                title: translate('Process.Details.Modeler.Actions.Desktop.Click.Y'),
                                                type: 'string',
                                            },
                                        },
                                        required: ['x', 'y']
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
                            info: translate('Process.Details.Modeler.Actions.Desktop.Click.Region.Info'),
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
    'desktop.selectWithCursor': {
        id: DesktopAction.SELECT_WITH_CURSOR,
        label: translate('Process.Details.Modeler.Actions.Desktop.SelectWithCursor.Label'),
        script: DesktopAction.SELECT_WITH_CURSOR,
        runner: Runner.DESKTOP_SCRIPT,
        form: {
            schema: {
                type: 'object',
                properties: {
                    input: {
                        title: translate('Process.Details.Modeler.Actions.Common.Input'),
                        type: 'object',
                        properties: {
                            startX: {
                                title: translate('Process.Details.Modeler.Actions.Desktop.SelectWithCursor.Start.X'),
                                type: 'string',
                            },
                            startY: {
                                title: translate('Process.Details.Modeler.Actions.Desktop.SelectWithCursor.Start.Y'),
                                type: 'string',
                            },
                            endX: {
                                title: translate('Process.Details.Modeler.Actions.Desktop.SelectWithCursor.End.X'),
                                type: 'string',
                            },
                            endY: {
                                title: translate('Process.Details.Modeler.Actions.Desktop.SelectWithCursor.End.Y'),
                                type: 'string',
                            },
                        },
                        required: ['startX', 'startY', 'endX', 'endY'],
                    },
                },
            },
            uiSchema: {
                'ui:order': ['input'],
            },
            formData: {
                input: {
                    startX: undefined,
                    startY: undefined,
                    endX: undefined,
                    endY: undefined,
                },
            },
        },
    },
    'desktop.readContentFromClipboard': {
        id: DesktopAction.READ_CONTENT_FROM_CLIPBOARD,
        label: translate('Process.Details.Modeler.Actions.Desktop.ReadContentFromClipboard.Label'),
        script: DesktopAction.READ_CONTENT_FROM_CLIPBOARD,
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
                                description: translate('Process.Details.Modeler.Actions.Common.VariableMessage'),
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
    'desktop.findScreenRegion': {
        id: DesktopAction.FIND_SCREEN_REGION,
        label: translate('Process.Details.Modeler.Actions.Desktop.FindScreenRegion.Label'),
        script: DesktopAction.FIND_SCREEN_REGION,
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
                            imagePath: {
                                title: translate('Process.Details.Modeler.Actions.Desktop.Common.ImagePath'),
                                type: 'string',
                            }
                        },
                        required: ['imagePath'],
                    },
                    output: {
                        title: translate('Process.Details.Modeler.Actions.Common.Output'),
                        type: 'object',
                        properties: {
                            variableName: {
                                title: translate('Process.Details.Modeler.Actions.Common.VariableName'),
                                description: translate('Process.Details.Modeler.Actions.Common.VariableMessage'),
                                type: 'string',
                            },
                        },
                        required: ['variableName'],
                    },
                },
            },
            uiSchema: {
                'ui:order': ['input', 'output'],
            },
            formData: {
                input: {
                    imagePath: undefined,
                },
                output: {
                    variableName: undefined,
                },
            },
        },
    },
    'desktop.waitForScreenRegion': {
        id: DesktopAction.WAIT_FOR_SCREEN_REGION,
        label: translate('Process.Details.Modeler.Actions.Desktop.WaitForScreenRegion.Label'),
        script: DesktopAction.WAIT_FOR_SCREEN_REGION,
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
                            imagePath: {
                                title: translate('Process.Details.Modeler.Actions.Desktop.Common.ImagePath'),
                                type: 'string',
                            }
                        },
                        required: ['imagePath'],
                    },
                    output: {
                        title: translate('Process.Details.Modeler.Actions.Common.Output'),
                        type: 'object',
                        properties: {
                            variableName: {
                                title: translate('Process.Details.Modeler.Actions.Common.VariableName'),
                                description: translate('Process.Details.Modeler.Actions.Common.VariableMessage'),
                                type: 'string',
                            },
                        },
                        required: ['variableName'],
                    },
                },
            },
            uiSchema: {
                'ui:order': ['input', 'output'],
            },
            formData: {
                input: {
                    imagePath: undefined,
                },
                output: {
                    variableName: undefined,
                },
            },
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
                            fileName: {
                                title: translate('Process.Details.Modeler.Actions.Desktop.TakeScreenshot.FileName'),
                                type: 'string',
                            },
                            region: {
                                title: translate('Process.Details.Modeler.Actions.Desktop.TakeScreenshot.Region'),
                                type: 'string',
                            },
                            fileFormat: {
                                title: translate('Process.Details.Modeler.Actions.Desktop.TakeScreenshot.FileFormat'),
                                type: 'string',
                                enum: [
                                    'PNG',
                                    'JPG'
                                ]
                            },
                            filePath: {
                                title: translate('Process.Details.Modeler.Actions.Desktop.TakeScreenshot.FilePath'),
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
                                description: translate('Process.Details.Modeler.Actions.Common.VariableMessage'),
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
                    fileFormat: 'PNG'
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
                            imagePath: {
                                title: translate('Process.Details.Modeler.Actions.Desktop.Common.ImagePath'),
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
                        required: ['imagePath'],
                    },
                    output: {
                        title: translate('Process.Details.Modeler.Actions.Common.Output'),
                        type: 'object',
                        properties: {
                            variableName: {
                                title: translate('Process.Details.Modeler.Actions.Common.VariableName'),
                                description: translate('Process.Details.Modeler.Actions.Common.VariableMessage'),
                                type: 'string',
                            },
                        },
                        required: ['variableName'],
                    },
                },
            },
            uiSchema: {
                'ui:order': ['input', 'output'],
            },
            formData: {
                input: {
                    imagePath: undefined,
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
