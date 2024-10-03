import { CloudFileAction, ActionCredentialType } from 'runbotics-common';

import { listNameUI, siteRelativePathUI } from '#src-app/Actions/cloudFile/cloudFile.schema';
import { IBpmnAction, Runner } from '#src-app/Actions/types';
import { translate } from '#src-app/hooks/useTranslations';

export const getSharepointListItemsAction = {
    id: CloudFileAction.GET_SHAREPOINT_LIST_ITEMS,
    credentialType: ActionCredentialType.MICROSOFT_GRAPH,
    label: translate('Process.Details.Modeler.Actions.CloudFile.GetSharePointListItems.Label'),
    script: CloudFileAction.GET_SHAREPOINT_LIST_ITEMS,
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
                        siteRelativePath: {
                            title: translate(
                                'Process.Details.Modeler.Actions.Microsoft.SiteRelativePath',
                            ),
                            type: 'string',
                        },
                        listName: {
                            title: translate(
                                'Process.Details.Modeler.Actions.Microsoft.ListName',
                            ),
                            type: 'string',
                        },
                    },
                    required: ['siteRelativePath', 'listName'],
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
                },
            },
        },
        uiSchema: {
            input: {
                siteRelativePath: siteRelativePathUI,
                listName: listNameUI,
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
                siteRelativePath: undefined,
                listName: undefined,
            },
        },
    },
} satisfies IBpmnAction;
