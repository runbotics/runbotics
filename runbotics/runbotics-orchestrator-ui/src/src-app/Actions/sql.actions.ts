import { ActionCredentialType, ActionRegex, SqlAction } from 'runbotics-common';

import { translate } from '#src-app/hooks/useTranslations';

import { propertyCustomCredential, schemaCustomCredential } from './actions.utils';
import { IBpmnAction, Runner } from './types';

const getSQLActions: () => Record<string, IBpmnAction> = () => ({
    [SqlAction.CONNECT]: {
        id: SqlAction.CONNECT,
        credentialType: ActionCredentialType.SQL,
        label: translate('Process.Details.Modeler.Actions.Sql.Connect.Label'),
        script: SqlAction.CONNECT,
        runner: Runner.DESKTOP_SCRIPT,
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
                }
            },
            formData: {
                input: {
                },
            },
        },
    },
    [SqlAction.QUERY]: {
        id: SqlAction.QUERY,
        credentialType: ActionCredentialType.SQL,
        label: translate('Process.Details.Modeler.Actions.Sql.Query.Label'),
        script: SqlAction.QUERY,
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
                            query: {
                                title: translate('Process.Details.Modeler.Actions.Sql.Query.Query'),
                                type: 'string',
                            },
                            queryParams: {
                                title: translate(
                                    'Process.Details.Modeler.Actions.Sql.Query.Parameters',
                                ),
                                type: 'array',
                                items: {
                                    type: 'string',
                                },
                                maxItems: 10,
                            },
                        },
                        required: ['query'],
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
                input: {
                    query: {
                        'ui:widget': 'EditorWidget',
                        'ui:options': {
                            'language': 'sql'
                        }
                    },
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
                    query: '',
                    queryParams: [],
                },
                output: {
                    variableName: undefined,
                },
            },
        },
    },
    [SqlAction.CLOSE]: {
        id: SqlAction.CLOSE,
        label: translate('Process.Details.Modeler.Actions.Sql.Close.Label'),
        script: SqlAction.CLOSE,
        runner: Runner.DESKTOP_SCRIPT,
        form: {
            schema: {
                properties: {
                    input: {
                        title: '',
                        type: 'object',
                        properties: {},
                    },
                },
            },
            uiSchema: {},
            formData: {},
        },
    },
});

export default getSQLActions;
