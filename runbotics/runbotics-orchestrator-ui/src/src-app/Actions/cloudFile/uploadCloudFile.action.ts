import { CloudFileAction, MicrosoftPlatform } from 'runbotics-common';

import { IBpmnAction, Runner } from '#src-app/Actions/types';
import { translate } from '#src-app/hooks/useTranslations';

export const uploadCloudFileAction: IBpmnAction = {
    id: CloudFileAction.UPLOAD_FILE,
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
                                    required: ['siteName', 'listName', 'filePath', 'cloudDirectoryPath'],
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
        uiSchema: {},
        formData: {
            input: {
                siteName: undefined,
                listName: undefined,
                localParentFolderPath: undefined,
                filePath: undefined,
            },
        },
    },
};
