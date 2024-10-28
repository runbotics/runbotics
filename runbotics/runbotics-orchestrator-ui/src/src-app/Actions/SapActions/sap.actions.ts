import { SapAction, ActionRegex, ActionCredentialType } from 'runbotics-common';

import { translate } from '#src-app/hooks/useTranslations';

import { SAPLanguages } from './sap.types';
import { propertyCustomCredential, schemaCustomCredential } from '../actions.utils';
import { IBpmnAction, Runner, ActionSystem } from '../types';

// eslint-disable-next-line max-lines-per-function
const getSapActions: () => Record<string, IBpmnAction> = () => ({
    'sap.connect': {
        id: SapAction.CONNECT,
        credentialType: ActionCredentialType.SAP,
        label: translate('Process.Details.Modeler.Actions.Sap.Connect.Label'),
        script: SapAction.CONNECT,
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
                            connectionName: {
                                title: translate('Process.Details.Modeler.Actions.Sap.Connect.ConnectionName'),
                                type: 'string',
                            },
                            user: {
                                title: translate('Process.Details.Modeler.Actions.Sap.Connect.User'),
                                type: 'string',
                            },
                            password: {
                                title: translate('Process.Details.Modeler.Actions.Sap.Connect.Password'),
                                type: 'string',
                            },
                            client: {
                                title: translate('Process.Details.Modeler.Actions.Sap.Connect.Client'),
                                type: 'string',
                            },
                            language: {
                                title: translate('Process.Details.Modeler.Actions.Sap.Connect.Language'),
                                type: 'string',
                                enum: Object.values(SAPLanguages),
                                default: SAPLanguages.English,
                            },
                            customCredentialId: propertyCustomCredential,
                        },
                        required: ['user', 'password', 'connectionName'],
                    },
                },
            },
            uiSchema: {
                'ui:order': ['input'],
                input: {
                    customCredentialId: schemaCustomCredential,
                },
            },
            formData: {
                input: {
                    connectionName: undefined,
                    user: 'SAP_USERNAME',
                    password: 'SAP_PASSWORD'
                },
            },
        },
    },
    'sap.disconnect': {
        id: SapAction.DISCONNECT,
        credentialType: ActionCredentialType.SAP,
        label: translate('Process.Details.Modeler.Actions.Sap.Disconnect.Label'),
        script: SapAction.DISCONNECT,
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
                            customCredentialId: propertyCustomCredential,
                        },
                        required: [],
                    },
                },
            },
            uiSchema: {
                'ui:order': ['input'],
                input: {
                    customCredentialId: schemaCustomCredential,
                },
            },
            formData: {
                input: {},
            },
        },
    },

    'sap.startTransaction': {
        id: SapAction.START_TRANSACTION,
        credentialType: ActionCredentialType.SAP,
        label: translate('Process.Details.Modeler.Actions.Sap.StartTransaction.Label'),
        script: SapAction.START_TRANSACTION,
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
                            transaction: {
                                title: translate('Process.Details.Modeler.Actions.Sap.StartTransaction.Transaction'),
                                type: 'string',
                            },
                            customCredentialId: propertyCustomCredential,
                        },
                        required: ['transaction'],
                    },
                },
            },
            uiSchema: {
                'ui:order': ['input'],
                input: {
                    customCredentialId: schemaCustomCredential,
                },
            },
            formData: {
                input: {
                    transaction: undefined,
                },
            },
        },
    },
    'sap.endTransaction': {
        id: SapAction.END_TRANSACTION,
        credentialType: ActionCredentialType.SAP,
        label: translate('Process.Details.Modeler.Actions.Sap.EndTransaction.Label'),
        script: SapAction.END_TRANSACTION,
        runner: Runner.DESKTOP_SCRIPT,
        system: ActionSystem.WINDOWS,
        form: {
            schema: {
                type: 'object',
                properties: {
                    customCredentialId: propertyCustomCredential,
                },
                required: [],
            },
            uiSchema: {
                'ui:order': ['input'],
                input: {
                    customCredentialId: schemaCustomCredential,
                },
            },
            formData: {
                input: {},
            },
        },
    },
    'sap.type': {
        id: SapAction.TYPE,
        credentialType: ActionCredentialType.SAP,
        label: translate('Process.Details.Modeler.Actions.Sap.Type.Label'),
        script: SapAction.TYPE,
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
                            target: {
                                title: translate('Process.Details.Modeler.Actions.Sap.Type.Target'),
                                type: 'string',
                            },
                            value: {
                                title: translate('Process.Details.Modeler.Actions.Sap.Type.Value'),
                                type: 'string',
                            },
                            customCredentialId: propertyCustomCredential,
                        },
                        required: ['target', 'value'],
                    },
                },
            },
            uiSchema: {
                'ui:order': ['input'],
                input: {
                    customCredentialId: schemaCustomCredential,
                },
            },
            formData: {
                input: {
                    target: 'wnd[0]',
                    value: undefined,
                },
            },
        },
    },
    'sap.sendVKey': {
        id: SapAction.SEND_VKEY,
        credentialType: ActionCredentialType.SAP,
        label: translate('Process.Details.Modeler.Actions.Sap.SendVKey.Label'),
        script: SapAction.SEND_VKEY,
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
                            virtualKey: {
                                title: translate('Process.Details.Modeler.Actions.Sap.SendVKey.VirtualKey'),
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
                            customCredentialId: propertyCustomCredential,
                        },
                        required: ['virtualKey'],
                    },
                },
            },
            uiSchema: {
                'ui:order': ['input'],
                input: {
                    customCredentialId: schemaCustomCredential,
                },
            },
            formData: {
                input: {
                    virtualKey: 'Enter',
                },
            },
        },
    },
    'sap.index': {
        id: SapAction.INDEX,
        credentialType: ActionCredentialType.SAP,
        label: translate('Process.Details.Modeler.Actions.Sap.Index.Label'),
        script: SapAction.INDEX,
        runner: Runner.DESKTOP_SCRIPT,
        system: ActionSystem.WINDOWS,
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
                            target: {
                                title: translate('Process.Details.Modeler.Actions.Sap.Index.Target'),
                                type: 'string',
                            },
                            customCredentialId: propertyCustomCredential,
                        },
                        required: ['target'],
                    },
                    output: {
                        title: translate('Process.Details.Modeler.Actions.Common.Output'),
                        type: 'object',
                        properties: {
                            variableName: {
                                title: translate('Process.Details.Modeler.Actions.Common.VariableName'),

                                type: 'string',
                                pattern: ActionRegex.VARIABLE_NAME,
                            },
                        },
                        required: ['variableName'],
                    },
                },
            },
            uiSchema: {
                'ui:order': ['input', 'output'],
                input: {
                    customCredentialId: schemaCustomCredential,
                },
                output: {
                    variableName: {
                        'ui:options': {
                            info: translate('Process.Details.Modeler.Actions.Common.VariableName.Info'),
                        },
                    },
                },
            },
            formData: {
                input: {
                    target: 'wnd[0]',
                },
                output: {
                    variableName: undefined,
                },
            },
        },
    },
    'sap.readText': {
        id: SapAction.READ_TEXT,
        credentialType: ActionCredentialType.SAP,
        label: translate('Process.Details.Modeler.Actions.Sap.ReadText.Label'),
        script: SapAction.READ_TEXT,
        runner: Runner.DESKTOP_SCRIPT,
        system: ActionSystem.WINDOWS,
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
                            target: {
                                title: translate('Process.Details.Modeler.Actions.Sap.ReadText.Target'),
                                type: 'string',
                            },
                            customCredentialId: propertyCustomCredential,
                        },
                        required: ['target'],
                    },
                    output: {
                        title: translate('Process.Details.Modeler.Actions.Common.Output'),
                        type: 'object',
                        properties: {
                            variableName: {
                                title: translate('Process.Details.Modeler.Actions.Common.VariableName'),

                                type: 'string',
                                pattern: ActionRegex.VARIABLE_NAME,
                            },
                        },
                        required: ['variableName'],
                    },
                },
            },
            uiSchema: {
                'ui:order': ['input', 'output'],
                input: {
                    customCredentialId: schemaCustomCredential,
                },
                output: {
                    variableName: {
                        'ui:options': {
                            info: translate('Process.Details.Modeler.Actions.Common.VariableName.Info'),
                        },
                    },
                },
            },
            formData: {
                input: {
                    target: 'wnd[0]',
                },
                output: {
                    variableName: undefined,
                },
            },
        },
    },
    'sap.click': {
        id: SapAction.CLICK,
        credentialType: ActionCredentialType.SAP,
        label: translate('Process.Details.Modeler.Actions.Sap.Click.Label'),
        script: SapAction.CLICK,
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
                            target: {
                                title: translate('Process.Details.Modeler.Actions.Sap.Click.Target'),
                                type: 'string',
                            },
                            customCredentialId: propertyCustomCredential,
                        },
                        required: ['target'],
                    },
                },
            },
            uiSchema: {
                'ui:order': ['input'],
                input: {
                    customCredentialId: schemaCustomCredential,
                },
            },
            formData: {
                input: {
                    target: 'wnd[0]',
                },
            },
        },
    },
    'sap.focus': {
        id: SapAction.FOCUS,
        credentialType: ActionCredentialType.SAP,
        label: translate('Process.Details.Modeler.Actions.Sap.Focus.Label'),
        script: SapAction.FOCUS,
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
                            target: {
                                title: translate('Process.Details.Modeler.Actions.Sap.Focus.Target'),
                                type: 'string',
                            },
                            customCredentialId: propertyCustomCredential,
                        },
                        required: ['target'],
                    },
                },
            },
            uiSchema: {
                'ui:order': ['input'],
                input: {
                    customCredentialId: schemaCustomCredential,
                },
            },
            formData: {
                input: {
                    target: 'wnd[0]',
                },
            },
        },
    },
    'sap.doubleClick': {
        id: SapAction.DOUBLE_CLICK,
        credentialType: ActionCredentialType.SAP,
        label: translate('Process.Details.Modeler.Actions.Sap.DoubleClick.Label'),
        script: SapAction.DOUBLE_CLICK,
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
                            target: {
                                title: translate('Process.Details.Modeler.Actions.Sap.DoubleClick.Target'),
                                type: 'string',
                            },
                            customCredentialId: propertyCustomCredential,
                        },
                        required: ['target'],
                    },
                },
            },
            uiSchema: {
                'ui:order': ['input'],
                input: {
                    customCredentialId: schemaCustomCredential,
                },
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
        credentialType: ActionCredentialType.SAP,
        label: translate('Process.Details.Modeler.Actions.Sap.Select.Label'),
        script: 'sap.select',
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
                            target: {
                                title: translate('Process.Details.Modeler.Actions.Sap.Select.Target'),
                                type: 'string',
                            },
                            customCredentialId: propertyCustomCredential,
                        },
                        required: ['target'],
                    },
                },
            },
            uiSchema: {
                'ui:order': ['input'],
                input: {
                    customCredentialId: schemaCustomCredential,
                }
            },
            formData: {
                input: {
                    target: 'wnd[0]',
                },
            },
        },
    },
    'sap.openContextMenu': {
        id: SapAction.OPEN_CONTEXT_MENU,
        credentialType: ActionCredentialType.SAP,
        label: translate('Process.Details.Modeler.Actions.Sap.OpenContextMenu.Label'),
        script: SapAction.OPEN_CONTEXT_MENU,
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
                            target: {
                                title: translate('Process.Details.Modeler.Actions.Sap.OpenContextMenu.Target'),
                                type: 'string',
                            },
                            menuId: {
                                title: translate('Process.Details.Modeler.Actions.Sap.OpenContextMenu.MenuId'),
                                type: 'string',
                            },
                            customCredentialId: propertyCustomCredential,
                        },
                        required: ['target', 'menuId'],
                    },
                },
            },
            uiSchema: {
                'ui:order': ['input'],
                input: {
                    customCredentialId: schemaCustomCredential,
                },
            },
            formData: {
                input: {
                    target: 'wnd[0]',
                    menuId: undefined,
                },
            },
        },
    },
    'sap.selectFromContextMenu': {
        id: SapAction.SELECT_FROM_CONTEXT_MENU,
        credentialType: ActionCredentialType.SAP,
        label: translate('Process.Details.Modeler.Actions.Sap.SelectFromContextMenu.Label'),
        script: SapAction.SELECT_FROM_CONTEXT_MENU,
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
                            target: {
                                title: translate('Process.Details.Modeler.Actions.Sap.SelectFromContextMenu.Target'),
                                type: 'string',
                            },
                            optionId: {
                                title: translate('Process.Details.Modeler.Actions.Sap.SelectFromContextMenu.OptionId'),
                                type: 'string',
                            },
                            customCredentialId: propertyCustomCredential,
                        },
                        required: ['target', 'optionId'],
                    },
                },
            },
            uiSchema: {
                'ui:order': ['input'],
                input: {
                    customCredentialId: schemaCustomCredential,
                }
            },
            formData: {
                input: {
                    target: 'wnd[0]',
                    optionId: undefined,
                },
            },
        },
    },
    'sap.clickToolbarButton': {
        id: SapAction.CLICK_TOOLBAR_BUTTON,
        credentialType: ActionCredentialType.SAP,
        label: translate('Process.Details.Modeler.Actions.Sap.ClickToolbarButton.Label'),
        script: SapAction.CLICK_TOOLBAR_BUTTON,
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
                            target: {
                                title: translate('Process.Details.Modeler.Actions.Sap.ClickToolbarButton.Target'),
                                type: 'string',
                            },
                            toolId: {
                                title: translate('Process.Details.Modeler.Actions.Sap.ClickToolbarButton.ToolId'),
                                type: 'string',
                            },
                            customCredentialId: propertyCustomCredential,
                        },
                        required: ['target', 'toolId'],
                    },
                },
            },
            uiSchema: {
                'ui:order': ['input'],
                input: {
                    customCredentialId: schemaCustomCredential,
                },
            },
            formData: {
                input: {
                    target: 'wnd[0]',
                    toolId: undefined,
                },
            },
        },
    },
    'sap.selectTableRow': {
        id: SapAction.SELECT_TABLE_ROW,
        credentialType: ActionCredentialType.SAP,
        label: translate('Process.Details.Modeler.Actions.Sap.SelectTableRow.Label'),
        script: SapAction.SELECT_TABLE_ROW,
        runner: Runner.DESKTOP_SCRIPT,
        form: {
            schema: {
                type: 'object',
                properties: {
                    input: {
                        title: translate('Process.Details.Modeler.Actions.Common.Input'),
                        type: 'object',
                        properties: {
                            target: {
                                title: translate('Process.Details.Modeler.Actions.Sap.SelectTableRow.Target'),
                                type: 'string',
                            },
                            rowIndex: {
                                title: translate('Process.Details.Modeler.Actions.Sap.SelectTableRow.RowIndex'),
                                type: 'string',
                            },
                            customCredentialId: propertyCustomCredential,
                        },
                        required: ['target', 'rowIndex'],
                    },
                },
            },
            uiSchema: {
                'ui:order': ['input'],
                input: {
                    customCredentialId: schemaCustomCredential,
                },
            },
            formData: {
                input: {
                    target: 'wnd[0]',
                    rowIndex: '0',
                },
            },
        },
    },
    'sap.toggleCheckbox': {
        id: SapAction.TOGGLE_CHECKBOX,
        credentialType: ActionCredentialType.SAP,
        label: translate('Process.Details.Modeler.Actions.Sap.ToggleCheckbox.Label'),
        script: SapAction.TOGGLE_CHECKBOX,
        runner: Runner.DESKTOP_SCRIPT,
        form: {
            schema: {
                type: 'object',
                properties: {
                    input: {
                        title: translate('Process.Details.Modeler.Actions.Common.Input'),
                        type: 'object',
                        properties: {
                            target: {
                                title: translate('Process.Details.Modeler.Actions.Sap.ToggleCheckbox.Target'),
                                type: 'string',
                            },
                            checked: {
                                title: translate('Process.Details.Modeler.Actions.Sap.ToggleCheckbox.Checked'),
                                type: 'boolean'
                            },
                            customCredentialId: propertyCustomCredential,
                        },
                        required: ['target']
                    },
                },
            },
            uiSchema: {
                'ui:order': ['input'],
                input: {
                    customCredentialId: schemaCustomCredential,
                },
            },
            formData: {
                input: {
                    target: 'wnd[0]',
                    checked: true,
                },
            },
        },
    },
});

export default getSapActions;
