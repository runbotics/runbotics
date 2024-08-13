import { CloudFileAction, MicrosoftPlatform } from 'runbotics-common';

import { listNameUI, siteNameUI } from '#src-app/Actions/cloudFile/cloudFile.schema';
import { IBpmnAction, Runner } from '#src-app/Actions/types';
import { translate } from '#src-app/hooks/useTranslations';

export const createShareLinkAction: IBpmnAction = {
    id: CloudFileAction.CREATE_SHARE_LINK,
    label: translate('Process.Details.Modeler.Actions.CloudFile.CreateShareLink.Label'),
    script: CloudFileAction.CREATE_SHARE_LINK,
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
                                        shareType: {
                                            title: translate(
                                                'Process.Details.Modeler.Actions.CloudFile.CreateShareLink.ShareType',
                                            ),
                                            type: 'string',
                                            enum: ['View', 'Edit', 'Embed'],
                                            default: 'View',
                                        },
                                        shareScope: {
                                            title: translate(
                                                'Process.Details.Modeler.Actions.CloudFile.CreateShareLink.ShareScope',
                                            ),
                                            type: 'string',
                                            enum: ['Users', 'Organization', 'Anonymous'],
                                            default: 'Users',
                                        },
                                        itemPath: {
                                            title: translate(
                                                'Process.Details.Modeler.Actions.CloudFile.ItemPath',
                                            ),
                                            type: 'string',
                                        },
                                    },
                                    required: ['siteName', 'listName', 'shareType', 'shareScope', 'itemPath'],
                                },
                                {
                                    properties: {
                                        platform: {
                                            enum: [MicrosoftPlatform.OneDrive],
                                        },
                                        shareType: {
                                            title: translate(
                                                'Process.Details.Modeler.Actions.CloudFile.CreateShareLink.ShareType',
                                            ),
                                            type: 'string',
                                            enum: ['View', 'Edit', 'Embed'],
                                            default: 'View',
                                        },
                                        shareScope: {
                                            title: translate(
                                                'Process.Details.Modeler.Actions.CloudFile.CreateShareLink.ShareScope',
                                            ),
                                            type: 'string',
                                            enum: ['Users', 'Organization', 'Anonymous'],
                                            default: 'Users',
                                        },
                                        itemPath: {
                                            title: translate(
                                                'Process.Details.Modeler.Actions.CloudFile.ItemPath',
                                            ),
                                            type: 'string',
                                        },
                                    },
                                    required: ['shareType', 'shareScope', 'itemPath'],
                                },
                            ],
                        },
                    },
                },
            },
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
                destinationFolderPath: undefined,
                shareType: 'View',
                shareScope: 'Users',
            },
        },
    },
};
