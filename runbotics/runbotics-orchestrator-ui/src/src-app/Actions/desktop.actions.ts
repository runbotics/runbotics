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
                            x: {
                                title: translate('Process.Details.Modeler.Actions.Desktop.Common.X'),
                                type: 'string',
                            },
                            y: {
                                title: translate('Process.Details.Modeler.Actions.Desktop.Common.Y'),
                                type: 'string',
                            },
                            mouseButton: {
                                title: translate('Process.Details.Modeler.Actions.Desktop.Click.MouseButton'),
                                type:'string',
                                enum: [
                                    translate('Process.Details.Modeler.Actions.Desktop.Click.MouseButton.Left'),
                                    translate('Process.Details.Modeler.Actions.Desktop.Click.MouseButton.Right')
                                ]
                            }
                        },
                        required: ['x', 'y'],
                    },
                },
            },
            uiSchema: {
                'ui:order': ['input'],
            },
            formData: {
                input: {
                    x: undefined,
                    y: undefined,
                    mouseButton: translate('Process.Details.Modeler.Actions.Desktop.Click.MouseButton.Left')
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
                            x: {
                                title: translate('Process.Details.Modeler.Actions.Desktop.Common.X'),
                                type: 'string',
                            },
                            y: {
                                title: translate('Process.Details.Modeler.Actions.Desktop.Common.Y'),
                                type: 'string',
                            },
                            text: {
                                title: translate('Process.Details.Modeler.Actions.Desktop.Type.Text'),
                                type: 'string',
                            }
                        },
                        required: ['x', 'y', 'text'],
                    },
                },
            },
            uiSchema: {
                'ui:order': ['input']
            },
            formData: {
                input: {
                    x: undefined,
                    y: undefined,
                    text: ''
                },
            },
        },
    },
    'desktop.readCursorSelection': {
        id: DesktopAction.READ_CURSOR_SELECTION,
        label: translate('Process.Details.Modeler.Actions.Desktop.ReadCursorSelection.Label'),
        script: DesktopAction.READ_CURSOR_SELECTION,
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
                            startFirstCoordinate: {
                                title: translate('Process.Details.Modeler.Actions.Desktop.ReadCursorSelection.Start.X'),
                                type: 'string',
                            },
                            startSecondCoordinate: {
                                title: translate('Process.Details.Modeler.Actions.Desktop.ReadCursorSelection.Start.Y'),
                                type: 'string',
                            },
                            endFirstCoordinate: {
                                title: translate('Process.Details.Modeler.Actions.Desktop.ReadCursorSelection.End.X'),
                                type: 'string',
                            },
                            endSecondCoordinate: {
                                title: translate('Process.Details.Modeler.Actions.Desktop.ReadCursorSelection.End.Y'),
                                type: 'string',
                            },
                        },
                        required: ['startFirstCoordinate', 'startSecondCoordinate', 'endFirstCoordinate', 'endSecondCoordinate'],
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
                    startFirstCoordinate: undefined,
                    startSecondCoordinate: undefined,
                    endFirstCoordinate: undefined,
                    endSecondCoordinate: undefined,
                },
                output: {
                    variableName: undefined,
                },
            },
        },
    },
    'desktop.paste': {
        id: DesktopAction.PASTE,
        label: translate('Process.Details.Modeler.Actions.Desktop.Paste.Label'),
        script: DesktopAction.PASTE,
        runner: Runner.DESKTOP_SCRIPT,
        form: {
            schema: {
                type: 'object',
                properties: {
                    input: {
                        title: translate('Process.Details.Modeler.Actions.Common.Input'),
                        type: 'object',
                        properties: {
                            x: {
                                title: translate('Process.Details.Modeler.Actions.Desktop.Common.X'),
                                type: 'string',
                            },
                            y: {
                                title: translate('Process.Details.Modeler.Actions.Desktop.Common.Y'),
                                type: 'string',
                            },
                        },
                        required: ['x', 'y'],
                    },
                },
            },
            uiSchema: {
                'ui:order': ['input'],
            },
            formData: {
                input: {
                    x: undefined,
                    y: undefined,
                },
            },
        },
    },
    'desktop.maximizeWindow': {
        id: DesktopAction.MAXIMIZE_WINDOW,
        label: translate('Process.Details.Modeler.Actions.Desktop.MaximizeWindow.Label'),
        script: DesktopAction.MAXIMIZE_WINDOW,
        runner: Runner.DESKTOP_SCRIPT,
        form: {
            schema: {},
            uiSchema: {},
            formData: {},
        },
    }
});

export default getDesktopActions;
