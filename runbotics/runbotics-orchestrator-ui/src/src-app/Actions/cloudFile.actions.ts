import { CloudFileAction, MicrosoftPlatform } from 'runbotics-common';

import { translate } from '#src-app/hooks/useTranslations';

import { IBpmnAction, Runner } from './types';

// eslint-disable-next-line max-lines-per-function
const getCloudFileActions: () => Record<string, IBpmnAction> = () => ({
    [CloudFileAction.DOWNLOAD_FILE]: {
        id: CloudFileAction.DOWNLOAD_FILE,
        label: translate('Process.Details.Modeler.Actions.CloudFile.Download.Label'),
        script: CloudFileAction.DOWNLOAD_FILE,
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
                                            fileName: {
                                                title: translate(
                                                    'Process.Details.Modeler.Actions.CloudFile.FileName',
                                                ),
                                                type: 'string',
                                            },
                                            localDirectory: {
                                                title: translate(
                                                    'Process.Details.Modeler.Actions.CloudFile.Download.LocalDirectory',
                                                ),
                                                type: 'string',
                                            },
                                        },
                                        required: ['siteName', 'listName', 'fileName'],
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
                                            fileName: {
                                                title: translate(
                                                    'Process.Details.Modeler.Actions.CloudFile.FileName',
                                                ),
                                                type: 'string',
                                            },
                                            localDirectory: {
                                                title: translate(
                                                    'Process.Details.Modeler.Actions.CloudFile.Download.LocalDirectory',
                                                ),
                                                type: 'string',
                                            },
                                        },
                                        required: ['fileName'],
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
                    parentFolderPath: undefined,
                    fileName: undefined,
                    localDirectory: undefined,
                },
            },
        },
    },
    [CloudFileAction.UPLOAD_FILE]: {
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
                                            localParentFolderPath: {
                                                title: translate(
                                                    'Process.Details.Modeler.Actions.CloudFile.Upload.LocalParentFolderPath',
                                                ),
                                                type: 'string',
                                            },
                                            fileName: {
                                                title: translate(
                                                    'Process.Details.Modeler.Actions.CloudFile.FileName',
                                                ),
                                                type: 'string',
                                            },
                                            parentFolderPath: {
                                                title: translate(
                                                    'Process.Details.Modeler.Actions.CloudFile.ParentFolderPath',
                                                ),
                                                type: 'string',
                                            },
                                        },
                                        required: ['siteName', 'listName', 'fileName'],
                                    },
                                    {
                                        properties: {
                                            platform: {
                                                enum: [MicrosoftPlatform.OneDrive],
                                            },
                                            localParentFolderPath: {
                                                title: translate(
                                                    'Process.Details.Modeler.Actions.CloudFile.Upload.LocalParentFolderPath',
                                                ),
                                                type: 'string',
                                            },
                                            fileName: {
                                                title: translate(
                                                    'Process.Details.Modeler.Actions.CloudFile.FileName',
                                                ),
                                                type: 'string',
                                            },
                                            parentFolderPath: {
                                                title: translate(
                                                    'Process.Details.Modeler.Actions.CloudFile.ParentFolderPath',
                                                ),
                                                type: 'string',
                                            },
                                        },
                                        required: ['fileName'],
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
                    fileName: undefined,
                    parentFolderPath: undefined,
                },
            },
        },
    },
    [CloudFileAction.CREATE_FOLDER]: {
        id: CloudFileAction.CREATE_FOLDER,
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
    },
    [CloudFileAction.MOVE_FILE]: {
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
                                                    'Process.Details.Modeler.Actions.CloudFile.ParentFolderPath'
                                                ),
                                                type: 'string',
                                            },
                                            fileName: {
                                                title: translate(
                                                    'Process.Details.Modeler.Actions.CloudFile.FileName'
                                                ),
                                                type: 'string',
                                            },
                                            destinationFolderPath: {
                                                title: translate(
                                                    'Process.Details.Modeler.Actions.CloudFile.DestinationFolderPath'
                                                ),
                                                type: 'string'
                                            }
                                        },
                                        required: ['siteName', 'listName', 'fileName', 'destinationFolderPath'],
                                    },
                                    {
                                        properties: {
                                            platform: {
                                                enum: [MicrosoftPlatform.OneDrive],
                                            },
                                            parentFolderPath: {
                                                title: translate(
                                                    'Process.Details.Modeler.Actions.CloudFile.ParentFolderPath'
                                                ),
                                                type: 'string',
                                            },
                                            fileName: {
                                                title: translate(
                                                    'Process.Details.Modeler.Actions.CloudFile.FileName'
                                                ),
                                                type: 'string',
                                            },
                                            destinationFolderPath: {
                                                title: translate(
                                                    'Process.Details.Modeler.Actions.CloudFile.DestinationFolderPath'
                                                ),
                                                type: 'string'
                                            }
                                        },
                                        required: ['fileName', 'destinationFolderPath'],
                                    },
                                ],
                            },
                        },
                    }
                }
            },
            uiSchema: {},
            formData: {
                input: {
                    siteName: undefined,
                    listName: undefined,
                    parentFolderPath: undefined,
                    fileName: undefined,
                    destinationFolderPath: undefined
                }
            }
        }
    },
    [CloudFileAction.DELETE_ITEM]: {
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
                                            itemName: {
                                                title: translate(
                                                    'Process.Details.Modeler.Actions.CloudFile.ItemName'
                                                ),
                                                type: 'string',
                                            },
                                            parentFolderPath: {
                                                title: translate(
                                                    'Process.Details.Modeler.Actions.CloudFile.ParentFolderPath'
                                                ),
                                                type: 'string',
                                            }
                                        },
                                        required: ['siteName', 'listName', 'itemName'],
                                    },
                                    {
                                        properties: {
                                            platform: {
                                                enum: [MicrosoftPlatform.OneDrive],
                                            },
                                            itemName: {
                                                title: translate(
                                                    'Process.Details.Modeler.Actions.CloudFile.ItemName'
                                                ),
                                                type: 'string',
                                            },
                                            parentFolderPath: {
                                                title: translate(
                                                    'Process.Details.Modeler.Actions.CloudFile.ParentFolderPath'
                                                ),
                                                type: 'string',
                                            }
                                        },
                                        required: ['itemName'],
                                    },
                                ],
                            },
                        },
                    }
                }
            },
            uiSchema: {},
            formData: {
                input: {
                    siteName: undefined,
                    listName: undefined,
                    parentFolderPath: undefined,
                    fileName: undefined,
                    destinationFolderPath: undefined
                }
            }
        }
    },
});

export default getCloudFileActions;
