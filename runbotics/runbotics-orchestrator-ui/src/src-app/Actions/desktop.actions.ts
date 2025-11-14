import { ActionCredentialType, DesktopAction } from 'runbotics-common';

import { translate } from '#src-app/hooks/useTranslations';

import { propertyCustomCredential, schemaCustomCredential } from './actions.utils';
import { IBpmnAction, Runner } from './types';

// eslint-disable-next-line max-lines-per-function
const getDesktopActions: () => Record<string, IBpmnAction> = () => ({
    [DesktopAction.CLICK]: {
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
                                type: 'string',
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
    [DesktopAction.TYPE]: {
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
    [DesktopAction.PERFORM_KEYBOARD_SHORTCUT]: {
        id: DesktopAction.PERFORM_KEYBOARD_SHORTCUT,
        label: translate('Process.Details.Modeler.Actions.Desktop.PerformKeyboardShortcut.Label'),
        script: DesktopAction.PERFORM_KEYBOARD_SHORTCUT,
        runner: Runner.DESKTOP_SCRIPT,
        form: {
            schema: {
                type: 'object',
                properties: {
                    input: {
                        title: translate('Process.Details.Modeler.Actions.Common.Input'),
                        type: 'object',
                        properties: {
                            shortcut: {
                                title: translate('Process.Details.Modeler.Actions.Desktop.PerformKeyboardShortcut.Shortcut'),
                                type: 'string',
                            }
                        },
                        required: ['shortcut'],
                    },
                },
            },
            uiSchema: {
                'ui:order': ['input'],
                input: {
                    shortcut: {
                        'ui:options': {
                            info: translate('Process.Details.Modeler.Actions.Desktop.PerformKeyboardShortcut.Shortcut.Info'),
                        }
                    },
                },
            },
            formData: {
                input: {
                    shortcut: undefined
                },
            },
        },
    },
    [DesktopAction.COPY]: {
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
    [DesktopAction.PASTE]: {
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
    [DesktopAction.CURSOR_SELECT]: {
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
    [DesktopAction.READ_CLIPBOARD_CONTENT]: {
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
    [DesktopAction.MAXIMIZE_ACTIVE_WINDOW]: {
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
    [DesktopAction.TAKE_SCREENSHOT]: {
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
    [DesktopAction.READ_TEXT_FROM_IMAGE]: {
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
    },
    [DesktopAction.READ_TEXT_FROM_PDF]: {
        id: DesktopAction.READ_TEXT_FROM_PDF,
        label: translate('Process.Details.Modeler.Actions.Desktop.ReadTextFromPdf.Label'),
        script: DesktopAction.READ_TEXT_FROM_PDF,
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
                            pdfFullPath: {
                                title: translate('Process.Details.Modeler.Actions.Desktop.Common.PdfFullPath'),
                                type: 'string',
                            },
                            language: {
                                title: translate('Process.Details.Modeler.Actions.Desktop.ReadTextFromPdf.Language'),
                                type: 'string',
                                enum: [
                                    'POL',
                                    'DEU',
                                    'ENG'
                                ]
                            },
                            searchPatterns: {
                                title: translate('Process.Details.Modeler.Actions.Common.Input'), // add proper translation
                                type: 'object',
                                additionalProperties: {
                                    mainFieldLabel: 'SQL Query',
                                    subFieldLabel: 'Variable Name',
                                    type: 'string',
                                    useEditorWidget: true,
                                    editorLanguage: 'json',
                                    editorHeight: '20vh',
                                    helpDescription: translate('Process.Details.Modeler.Actions.Desktop.ReadTextFromPdf.Description'),
                                    default: JSON.stringify({
                                        anchorText: '',
                                        percentageOfError: 9,
                                        direction: 'DOWN',
                                        heightPercentage: 1,
                                        widthPercentage: 10,
                                    }, null, 2),
                                },
                            },
                        },
                        required: ['pdfFullPath', 'searchPatterns'],
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
                    searchPatterns: {
                        'ui:widget': 'EditorWidget',
                        'ui:options': {
                            'language': 'json',
                        },
                    },
                    pdfFullPath: {
                        'ui:options': {
                            info: translate('Process.Details.Modeler.Actions.Desktop.Common.PdfFullPath.Info'),
                        }
                    },           
                },
            },            
            formData: {
                input: {
                    pdfFullPath: undefined,
                    language: 'ENG',
                    searchPatterns: []
                },
                output: {
                    variableName: undefined,
                },
            }        
        },
    },
    [DesktopAction.TYPE_CREDENTIALS]: {
        id: DesktopAction.TYPE_CREDENTIALS,
        label: translate('Process.Details.Modeler.Actions.Desktop.TypeCredentials.Label'),
        helperTextLabel: translate('Process.Details.Modeler.Actions.Desktop.TypeCredentials.HelperTextLabel'),
        script: DesktopAction.TYPE_CREDENTIALS,
        credentialType: ActionCredentialType.DESKTOP,
        runner: Runner.DESKTOP_SCRIPT,
        form: {
            schema: {
                type: 'object',
                properties: {
                    input: {
                        title: translate('Process.Details.Modeler.Actions.Common.Input'),
                        type: 'object',
                        properties: {
                            credentialAttribute: {
                                title: translate('Process.Details.Modeler.Actions.Desktop.TypeCredentials.CredentialAttribute'),
                                type: 'string',
                                enum: [
                                    'username',
                                    'password',
                                ],
                                enumNames: [
                                    translate('Process.Details.Modeler.Actions.Desktop.TypeCredentials.Username'),
                                    translate('Process.Details.Modeler.Actions.Desktop.TypeCredentials.Password'),
                                ],
                                default: 'username',
                            },
                            customCredentialId: propertyCustomCredential,
                        },
                        required: ['credentialAttribute'],
                    },
                },
            },
            uiSchema: {
                'ui:order': ['input'],
                input: {
                    customCredentialId: schemaCustomCredential,
                    credentialAttribute: {
                        'ui:options': {
                            info: translate('Process.Details.Modeler.Actions.Desktop.TypeCredentials.CredentialAttribute.Info'),
                        },
                    },
                },
            },
            formData: {
                input: {
                    credentialAttribute: 'username',
                },
            },
        },
    },
});

export default getDesktopActions;
