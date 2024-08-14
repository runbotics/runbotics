import { CloudFileAction, MicrosoftPlatform } from 'runbotics-common';

import { listNameUI, siteRelativePathUI } from '#src-app/Actions/cloudFile/cloudFile.schema';
import { IBpmnAction, Runner } from '#src-app/Actions/types';
import { translate } from '#src-app/hooks/useTranslations';

export const moveCloudFileAction: IBpmnAction = {
    id: CloudFileAction.MOVE_FILE,
    label: translate('Process.Details.Modeler.Actions.CloudFile.MoveFile.Label'),
    script: CloudFileAction.MOVE_FILE,
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
                                        destinationFolderPath: {
                                            title: translate(
                                                'Process.Details.Modeler.Actions.CloudFile.DestinationFolderPath',
                                            ),
                                            type: 'string',
                                        },
                                    },
                                    required: ['siteRelativePath', 'listName', 'filePath', 'destinationFolderPath'],
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
                                        destinationFolderPath: {
                                            title: translate(
                                                'Process.Details.Modeler.Actions.CloudFile.DestinationFolderPath',
                                            ),
                                            type: 'string',
                                        },
                                    },
                                    required: ['filePath', 'destinationFolderPath'],
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
                filePath: undefined,
                destinationFolderPath: undefined,
            },
        },
    },
};
