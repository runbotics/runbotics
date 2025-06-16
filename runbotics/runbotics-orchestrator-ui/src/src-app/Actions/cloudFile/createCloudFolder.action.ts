import { CloudFileAction, MicrosoftPlatform, ActionCredentialType } from 'runbotics-common';

import { listNameUI, siteRelativePathUI } from '#src-app/Actions/cloudFile/cloudFile.schema';
import { IBpmnAction, Runner } from '#src-app/Actions/types';
import { translate } from '#src-app/hooks/useTranslations';

import { propertyCustomCredential, schemaCustomCredential } from '../actions.utils';

export const getCreateCloudFolderAction = () => ({
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
                                        customCredentialId: propertyCustomCredential,
                                    },
                                    required: ['siteRelativePath', 'listName', 'folderName'],
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
                                        customCredentialId: propertyCustomCredential,
                                    },
                                    required: ['folderName'],
                                },
                            ],
                        },
                    },
                },
            },
        },
        uiSchema: {
            input: {
                customCredentialId: schemaCustomCredential,
                siteRelativePath: siteRelativePathUI,
                listName: listNameUI,
            },
        },
        formData: {
            input: {
                siteRelativePath: undefined,
                listName: undefined,
                folderName: undefined,
                parentFolderPath: undefined,
            },
        },
    },
} satisfies IBpmnAction
);

