import { CloudFileAction, MicrosoftPlatform } from 'runbotics-common';

import { IBpmnAction, Runner } from '#src-app/Actions/types';
import { translate } from '#src-app/hooks/useTranslations';
import { listNameUI, siteNameUI } from '#src-app/Actions/cloudFile/cloudFile.schema';

export const deleteCloudItemAction: IBpmnAction = {
    id: CloudFileAction.DELETE_ITEM,
    label: translate('Process.Details.Modeler.Actions.CloudFile.DeleteItem.Label'),
    script: CloudFileAction.DELETE_ITEM,
    runner: Runner.DESKTOP_SCRIPT,
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
                            enum: [MicrosoftPlatform.OneDrive, MicrosoftPlatform.SharePoint],
                            default: MicrosoftPlatform.OneDrive,
                        },
                    },
                    dependencies: {
                        platform: {
                            oneOf: [
                                {
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
                                        itemPath: {
                                            title: translate(
                                                'Process.Details.Modeler.Actions.CloudFile.ItemPath'
                                            ),
                                            type: 'string',
                                        },
                                    },
                                    required: ['siteName', 'listName', 'itemPath'],
                                },
                                {
                                    properties: {
                                        platform: {
                                            enum: [MicrosoftPlatform.OneDrive],
                                        },
                                        itemPath: {
                                            title: translate(
                                                'Process.Details.Modeler.Actions.CloudFile.ItemPath'
                                            ),
                                            type: 'string',
                                        },
                                    },
                                    required: ['itemPath'],
                                },
                            ],
                        },
                    },
                }
            }
        },
        uiSchema: {
            input: {
                siteName: siteNameUI,
                listName: listNameUI,
            },
        },
        formData: {
            input: {
                siteName: undefined,
                listName: undefined,
                itemPath: undefined,
                destinationFolderPath: undefined
            }
        }
    }
};
