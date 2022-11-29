import { translate } from '#src-app/hooks/useTranslations';

import { IBpmnAction, Runner } from './types';

// eslint-disable-next-line max-lines-per-function
const getSapActions: () => Record<string, IBpmnAction> = () => ({
    'sap.connect': {
        id: 'sap.connect',
        label: translate('Process.Details.Modeler.Actions.Sap.Connect.Label'),
        script: 'sap.connect',
        runner: Runner.DESKTOP_SCRIPT,
        form: {
            schema: {
                type: 'object',
                properties: {
                    input: {
                        title: translate('Process.Details.Modeler.Actions.SAP.Connect.Input'),
                        type: 'object',
                        properties: {
                            connectionName: {
                                title: translate('Process.Details.Modeler.Actions.SAP.Connect.ConnectionName'),
                                type: 'string',
                            },
                            user: {
                                title: translate('Process.Details.Modeler.Actions.SAP.Connect.User'),
                                type: 'string',
                            },
                            password: {
                                title: translate('Process.Details.Modeler.Actions.SAP.Connect.Password'),
                                type: 'string',
                            },
                        },
                        required: ['user', 'password', 'sid'],
                    },
                },
            },
            uiSchema: {
                'ui:order': ['input'],
            },
            formData: {
                input: {
                    connectionName: '',
                    user: 'SAP_USERNAME',
                    password: 'SAP_PASSWORD',
                },
            },
        },
    },
    'sap.disconnect': {
        id: 'sap.disconnect',
        label: translate('Process.Details.Modeler.Actions.Sap.Disconnect.Label'),
        script: 'sap.disconnect',
        runner: Runner.DESKTOP_SCRIPT,
        form: {
            schema: {
                type: 'object',
                properties: {
                    input: {
                        title: translate('Process.Details.Modeler.Actions.SAP.Disconnect.Input'),
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

    'sap.startTransaction': {
        id: 'sap.startTransaction',
        label: translate('Process.Details.Modeler.Actions.Sap.StartTransaction.Label'),
        script: 'sap.startTransaction',
        runner: Runner.DESKTOP_SCRIPT,
        form: {
            schema: {
                type: 'object',
                properties: {
                    input: {
                        title: translate('Process.Details.Modeler.Actions.SAP.StartTransaction.Input'),
                        type: 'object',
                        properties: {
                            transaction: {
                                title: translate('Process.Details.Modeler.Actions.SAP.StartTransaction.Transaction'),
                                type: 'string',
                            },
                        },
                        required: ['transaction'],
                    },
                },
            },
            uiSchema: {
                'ui:order': ['input'],
            },
            formData: {
                input: {
                    transaction: '',
                },
            },
        },
    },
    'sap.endTransaction': {
        id: 'sap.endTransaction',
        label: translate('Process.Details.Modeler.Actions.Sap.EndTransaction.Label'),
        script: 'sap.endTransaction',
        runner: Runner.DESKTOP_SCRIPT,
        form: {
            schema: {
                type: 'object',
                properties: {},
                required: [],
            },
            uiSchema: {
                'ui:order': ['input'],
            },
            formData: {
                input: {},
            },
        },
    },
    'sap.type': {
        id: 'sap.type',
        label: translate('Process.Details.Modeler.Actions.Sap.Type.Label'),
        script: 'sap.type',
        runner: Runner.DESKTOP_SCRIPT,
        form: {
            schema: {
                type: 'object',
                properties: {
                    input: {
                        title: translate('Process.Details.Modeler.Actions.SAP.Type.Input'),
                        type: 'object',
                        properties: {
                            target: {
                                title: translate('Process.Details.Modeler.Actions.SAP.Type.Target'),
                                type: 'string',
                            },
                            value: {
                                title: translate('Process.Details.Modeler.Actions.SAP.Type.Value'),
                                type: 'string',
                            },
                        },
                        required: ['target', 'value'],
                    },
                },
            },
            uiSchema: {
                'ui:order': ['input'],
            },
            formData: {
                input: {
                    target: 'wnd[0]',
                    value: '',
                },
            },
        },
    },
    'sap.sendVKey': {
        id: 'sap.sendVKey',
        label: translate('Process.Details.Modeler.Actions.Sap.SendVKey.Label'),
        script: 'sap.sendVKey',
        runner: Runner.DESKTOP_SCRIPT,
        form: {
            schema: {
                type: 'object',
                properties: {
                    input: {
                        title: translate('Process.Details.Modeler.Actions.SAP.SendVKey.Input'),
                        type: 'object',
                        properties: {
                            virtualKey: {
                                title: translate('Process.Details.Modeler.Actions.SAP.SendVKey.VirtualKey'),
                                type: 'string',
                                enum: [
                                    'Enter',
                                    'F1',
                                    'F2',
                                    'F3',
                                    'F4',
                                    'F5',
                                    'F6',
                                    'F7',
                                    'F8',
                                    'F9',
                                    'F10',
                                    'Ctrl+S',
                                    'F12',
                                    'Shift+F1',
                                    'Shift+F2',
                                    'Shift+F3',
                                    'Shift+F4',
                                    'Shift+F5',
                                    'Shift+F6',
                                    'Shift+F7',
                                    'Shift+F8',
                                    'Shift+F9',
                                    'Shift+Ctrl+0',
                                    'Shift+F11',
                                    'Shift+F12',
                                    'Ctrl+F1',
                                    'Ctrl+F2',
                                    'Ctrl+F3',
                                    'Ctrl+F4',
                                    'Ctrl+F5',
                                    'Ctrl+F6',
                                    'Ctrl+F7',
                                    'Ctrl+F8',
                                    'Ctrl+F9',
                                    'Ctrl+F10',
                                    'Ctrl+F11',
                                    'Ctrl+F12',
                                    'Ctrl+Shift+F1',
                                    'Ctrl+Shift+F2',
                                    'Ctrl+Shift+F3',
                                    'Ctrl+Shift+F4',
                                    'Ctrl+Shift+F5',
                                    'Ctrl+Shift+F6',
                                    'Ctrl+Shift+F7',
                                    'Ctrl+Shift+F8',
                                    'Ctrl+Shift+F9',
                                    'Ctrl+Shift+F10',
                                    'Ctrl+Shift+F11',
                                    'Ctrl+Shift+F12',
                                    'Ctrl+E',
                                    'Ctrl+F',
                                    'Ctrl+/',
                                    'Ctrl+"',
                                    'Ctrl+N',
                                    'Ctrl+O',
                                    'Ctrl+X',
                                    'Ctrl+C',
                                    'Ctrl+V',
                                    'Ctrl+Z',
                                    'Ctrl+PageUp',
                                    'PageUp',
                                    'PageDown',
                                    'Ctrl+PageDown',
                                    'Ctrl+G',
                                    'Ctrl+R',
                                    'Ctrl+P',
                                ],
                            },
                        },
                        required: ['virtualKey'],
                    },
                },
            },
            uiSchema: {
                'ui:order': ['input'],
            },
            formData: {
                input: {
                    virtualKey: 'Enter',
                },
            },
        },
    },
    'sap.index': {
        id: 'sap.index',
        label: translate('Process.Details.Modeler.Actions.Sap.Index.Label'),
        script: 'sap.index',
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
                        title: translate('Process.Details.Modeler.Actions.SAP.Index.Input'),
                        type: 'object',
                        properties: {
                            target: {
                                title: translate('Process.Details.Modeler.Actions.SAP.Index.Target'),
                                type: 'string',
                            },
                        },
                        required: ['target'],
                    },
                    output: {
                        title: translate('Process.Details.Modeler.Actions.SAP.Index.Output'),
                        type: 'object',
                        properties: {
                            variableName: {
                                title: translate('Process.Details.Modeler.Actions.SAP.Index.Variable'),
                                description: translate('Process.Details.Modeler.Actions.SAP.Index.VariableText'),
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
                    target: 'wnd[0]',
                },
                output: {
                    variableName: '',
                },
            },
        },
    },
    'sap.readText': {
        id: 'sap.readText',
        label: translate('Process.Details.Modeler.Actions.Sap.ReadText.Label'),
        script: 'sap.readText',
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
                        title: translate('Process.Details.Modeler.Actions.SAP.ReadText.Input'),
                        type: 'object',
                        properties: {
                            target: {
                                title: translate('Process.Details.Modeler.Actions.SAP.ReadText.Target'),
                                type: 'string',
                            },
                        },
                        required: ['target'],
                    },
                    output: {
                        title: translate('Process.Details.Modeler.Actions.SAP.ReadText.Output'),
                        type: 'object',
                        properties: {
                            variableName: {
                                title: translate('Process.Details.Modeler.Actions.SAP.ReadText.Variable'),
                                description: translate('Process.Details.Modeler.Actions.SAP.ReadText.VariableText'),
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
                    target: 'wnd[0]',
                },
                output: {
                    variableName: '',
                },
            },
        },
    },
    'sap.click': {
        id: 'sap.click',
        label: translate('Process.Details.Modeler.Actions.Sap.Click.Label'),
        script: 'sap.click',
        runner: Runner.DESKTOP_SCRIPT,
        form: {
            schema: {
                type: 'object',
                properties: {
                    input: {
                        title: translate('Process.Details.Modeler.Actions.SAP.Click.Input'),
                        type: 'object',
                        properties: {
                            target: {
                                title: translate('Process.Details.Modeler.Actions.SAP.Click.Target'),
                                type: 'string',
                            },
                        },
                        required: ['target'],
                    },
                },
            },
            uiSchema: {
                'ui:order': ['input'],
            },
            formData: {
                input: {
                    target: 'wnd[0]',
                },
            },
        },
    },
    'sap.focus': {
        id: 'sap.focus',
        label: translate('Process.Details.Modeler.Actions.Sap.Focus.Label'),
        script: 'sap.focus',
        runner: Runner.DESKTOP_SCRIPT,
        form: {
            schema: {
                type: 'object',
                properties: {
                    input: {
                        title: translate('Process.Details.Modeler.Actions.SAP.Focus.Input'),
                        type: 'object',
                        properties: {
                            target: {
                                title: translate('Process.Details.Modeler.Actions.SAP.Focus.Target'),
                                type: 'string',
                            },
                        },
                        required: ['target'],
                    },
                },
            },
            uiSchema: {
                'ui:order': ['input'],
            },
            formData: {
                input: {
                    target: 'wnd[0]',
                },
            },
        },
    },
    'sap.doubleClick': {
        id: 'sap.doubleClick',
        label: translate('Process.Details.Modeler.Actions.Sap.DoubleClick.Label'),
        script: 'sap.doubleClick',
        runner: Runner.DESKTOP_SCRIPT,
        form: {
            schema: {
                type: 'object',
                properties: {
                    input: {
                        title: translate('Process.Details.Modeler.Actions.SAP.DoubleClick.Input'),
                        type: 'object',
                        properties: {
                            target: {
                                title: translate('Process.Details.Modeler.Actions.SAP.DoubleClick.Target'),
                                type: 'string',
                            },
                        },
                        required: ['target'],
                    },
                },
            },
            uiSchema: {
                'ui:order': ['input'],
            },
            formData: {
                input: {
                    target: 'wnd[0]',
                },
            },
        },
    },
    'sap.select': {
        id: 'sap.select',
        label: translate('Process.Details.Modeler.Actions.Sap.Select.Label'),
        script: 'sap.select',
        runner: Runner.DESKTOP_SCRIPT,
        form: {
            schema: {
                type: 'object',
                properties: {
                    input: {
                        title: translate('Process.Details.Modeler.Actions.SAP.Select.Input'),
                        type: 'object',
                        properties: {
                            target: {
                                title: translate('Process.Details.Modeler.Actions.SAP.Select.Target'),
                                type: 'string',
                            },
                        },
                        required: ['target'],
                    },
                },
            },
            uiSchema: {
                'ui:order': ['input'],
            },
            formData: {
                input: {
                    target: 'wnd[0]',
                },
            },
        },
    },
    'sap.openContextMenu': {
        id: 'sap.openContextMenu',
        label: translate('Process.Details.Modeler.Actions.Sap.OpenContextMenu.Label'),
        script: 'sap.openContextMenu',
        runner: Runner.DESKTOP_SCRIPT,
        form: {
            schema: {
                type: 'object',
                properties: {
                    input: {
                        title: translate('Process.Details.Modeler.Actions.SAP.OpenContextMenu.Input'),
                        type: 'object',
                        properties: {
                            target: {
                                title: translate('Process.Details.Modeler.Actions.SAP.OpenContextMenu.Target'),
                                type: 'string',
                            },
                            menuId: {
                                title: translate('Process.Details.Modeler.Actions.SAP.OpenContextMenu.MenuId'),
                                type: 'string',
                            },
                        },
                        required: ['target', 'menuId'],
                    },
                },
            },
            uiSchema: {
                'ui:order': ['input'],
            },
            formData: {
                input: {
                    target: 'wnd[0]',
                },
            },
        },
    },
    'sap.selectFromContextMenu': {
        id: 'sap.selectFromContextMenu',
        label: translate('Process.Details.Modeler.Actions.Sap.SelectFromContextMenu.Label'),
        script: 'sap.selectFromContextMenu',
        runner: Runner.DESKTOP_SCRIPT,
        form: {
            schema: {
                type: 'object',
                properties: {
                    input: {
                        title: translate('Process.Details.Modeler.Actions.SAP.SelectFromContextMenu.Input'),
                        type: 'object',
                        properties: {
                            target: {
                                title: translate('Process.Details.Modeler.Actions.SAP.SelectFromContextMenu.Target'),
                                type: 'string',
                            },
                            optionId: {
                                title: translate('Process.Details.Modeler.Actions.SAP.SelectFromContextMenu.OptionId'),
                                type: 'string',
                            },
                        },
                        required: ['target', 'optionId'],
                    },
                },
            },
            uiSchema: {
                'ui:order': ['input'],
            },
            formData: {
                input: {
                    target: 'wnd[0]',
                },
            },
        },
    },
    'sap.clickToolbarButton': {
        id: 'sap.clickToolbarButton',
        label: translate('Process.Details.Modeler.Actions.Sap.ClickToolbarButton.Label'),
        script: 'sap.clickToolbarButton',
        runner: Runner.DESKTOP_SCRIPT,
        form: {
            schema: {
                type: 'object',
                properties: {
                    input: {
                        title: translate('Process.Details.Modeler.Actions.SAP.ClickToolbarButton.Input'),
                        type: 'object',
                        properties: {
                            target: {
                                title: translate('Process.Details.Modeler.Actions.SAP.ClickToolbarButton.Target'),
                                type: 'string',
                            },
                            toolId: {
                                title: translate('Process.Details.Modeler.Actions.SAP.ClickToolbarButton.ToolId'),
                                type: 'string',
                            },
                        },
                        required: ['target', 'toolId'],
                    },
                },
            },
            uiSchema: {
                'ui:order': ['input'],
            },
            formData: {
                input: {
                    target: 'wnd[0]',
                },
            },
        },
    },
});

export default getSapActions;
