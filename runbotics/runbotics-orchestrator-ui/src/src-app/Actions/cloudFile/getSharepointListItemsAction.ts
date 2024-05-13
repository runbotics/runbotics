import { CloudFileAction, MicrosoftPlatform } from 'runbotics-common';

import { IBpmnAction, Runner } from '#src-app/Actions/types';
import { translate } from '#src-app/hooks/useTranslations';

export const getSharepointListItemsAction: IBpmnAction = {
    id: CloudFileAction.GET_SHAREPOINT_LIST_ITEMS,
    label: translate('Process.Details.Modeler.Actions.CloudFile.GetSharePointList.Label'),
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
                        platform: {
                            title: translate('Process.Details.Modeler.Actions.Microsoft.Platform'),
                            type: 'string',
                            enum: [MicrosoftPlatform.SharePoint],
                            default: MicrosoftPlatform.SharePoint,
                        },
                    },
                    dependencies: {
                        platform: {
                            properties: {
                                platform: {
                                    enum: [MicrosoftPlatform.SharePoint],
                                },
                                siteName: {
                                    title: translate(
                                        'Process.Details.Modeler.Actions.Microsoft.SiteName',
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
                            required: ['siteName', 'listName'],
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
                },
            },
        },
        uiSchema: {
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
                siteName: undefined,
                listName: undefined,
            },
        },
    },
};
