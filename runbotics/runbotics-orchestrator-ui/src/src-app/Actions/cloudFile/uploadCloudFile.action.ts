import { CloudFileAction, MicrosoftPlatform } from 'runbotics-common';

import { listNameUI, siteRelativePathUI } from '#src-app/Actions/cloudFile/cloudFile.schema';
import { IBpmnAction, Runner } from '#src-app/Actions/types';
import { ActionCredentialType } from '#src-app/credentials/actionCredentialType.enum';
import { translate } from '#src-app/hooks/useTranslations';

export const uploadCloudFileAction = {
    id: CloudFileAction.UPLOAD_FILE,
    credentialType: ActionCredentialType.MICROSOFT_GRAPH,
    label: translate('Process.Details.Modeler.Actions.CloudFile.Upload.Label'),
    script: CloudFileAction.UPLOAD_FILE,
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
                                        filePath: {
                                            title: translate(
                                                'Process.Details.Modeler.Actions.CloudFile.FilePath',
                                            ),
                                            type: 'string',
                                        },
                                        cloudDirectoryPath: {
                                            title: translate(
                                                'Process.Details.Modeler.Actions.CloudFile.Upload.CloudDirectoryPath',
                                            ),
                                            type: 'string',
                                        },
                                    },
                                    required: ['siteRelativePath', 'listName', 'filePath', 'cloudDirectoryPath'],
                                },
                                {
                                    properties: {
                                        platform: {
                                            enum: [MicrosoftPlatform.OneDrive],
                                        },
                                        filePath: {
                                            title: translate(
                                                'Process.Details.Modeler.Actions.CloudFile.FilePath',
                                            ),
                                            type: 'string',
                                        },
                                        cloudDirectoryPath: {
                                            title: translate(
                                                'Process.Details.Modeler.Actions.CloudFile.Upload.CloudDirectoryPath',
                                            ),
                                            type: 'string',
                                        },
                                    },
                                    required: ['filePath', 'cloudDirectoryPath'],
                                },
                            ],
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
        },
        formData: {
            input: {
                siteRelativePath: undefined,
                listName: undefined,
                localParentFolderPath: undefined,
                filePath: undefined,
            },
        },
    },
} satisfies IBpmnAction;
