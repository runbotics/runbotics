import { CloudFileAction, MicrosoftPlatform } from 'runbotics-common';

import { IBpmnAction, Runner } from '#src-app/Actions/types';
import { translate } from '#src-app/hooks/useTranslations';
import { ActionCredentialType } from '#src-app/credentials/actionCredentialType.enum';

export const createCloudFolderAction = {
    id: CloudFileAction.CREATE_FOLDER,
    credentialType: ActionCredentialType.MICROSOFT_GRAPH,
    label: translate('Process.Details.Modeler.Actions.CloudFile.CreateFolder.Label'),
    script: CloudFileAction.CREATE_FOLDER,
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
                            default: 'OneDrive',
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
                                        parentFolderPath: {
                                            title: translate(
                                                'Process.Details.Modeler.Actions.CloudFile.ParentFolderPath',
                                            ),
                                            type: 'string',
                                        },
                                        folderName: {
                                            title: translate(
                                                'Process.Details.Modeler.Actions.CloudFile.CreateFolder.FolderName',
                                            ),
                                            type: 'string',
                                        },
                                    },
                                    required: ['siteName', 'listName', 'folderName'],
                                },
                                {
                                    properties: {
                                        platform: {
                                            enum: [MicrosoftPlatform.OneDrive],
                                        },
                                        parentFolderPath: {
                                            title: translate(
                                                'Process.Details.Modeler.Actions.CloudFile.ParentFolderPath',
                                            ),
                                            type: 'string',
                                        },
                                        folderName: {
                                            title: translate(
                                                'Process.Details.Modeler.Actions.CloudFile.CreateFolder.FolderName',
                                            ),
                                            type: 'string',
                                        },
                                    },
                                    required: ['folderName'],
                                },
                            ],
                        },
                    },
                },
            },
        },
        uiSchema: {},
        formData: {
            input: {
                siteName: undefined,
                listName: undefined,
                folderName: undefined,
                parentFolderPath: undefined,
            },
        },
    },
} satisfies IBpmnAction;
