import { ActionRegex, CloudFileAction, MicrosoftPlatform } from 'runbotics-common';

import { translate } from '#src-app/hooks/useTranslations';

import { IBpmnAction, Runner } from './types';

// eslint-disable-next-line max-lines-per-function
const getCloudFileActions: () => Record<string, IBpmnAction> = () => ({
    [CloudFileAction.DOWNLOAD_FILE]: {
        id: CloudFileAction.DOWNLOAD_FILE,
        label: translate('Process.Details.Modeler.Actions.CloudFile.Download.Label'),
        script: CloudFileAction.DOWNLOAD_FILE,
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
                                            localDirectory: {
                                                title: translate(
                                                    'Process.Details.Modeler.Actions.CloudFile.Download.LocalDirectory',
                                                ),
                                                type: 'string',
                                            },
                                        },
                                        required: ['siteName', 'listName', 'filePath'],
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
                                            localDirectory: {
                                                title: translate(
                                                    'Process.Details.Modeler.Actions.CloudFile.Download.LocalDirectory',
                                                ),
                                                type: 'string',
                                            },
                                        },
                                        required: ['filePath'],
                                    },
                                ],
                            },
                        },
                    },
                    output: {
                        title: translate('Process.Details.Modeler.Actions.Common.Output'),
                        type: 'object',
                        properties: {
                            variableName: {
                                title: translate('Process.Details.Modeler.Actions.CloudFile.Download.Output.Label'),
                                type: 'string',
                                pattern: ActionRegex.VARIABLE_NAME,
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
                    filePath: undefined,
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
                                            filePath: {
                                                title: translate(
                                                    'Process.Details.Modeler.Actions.CloudFile.FilePath',
                                                ),
                                                type: 'string',
                                            },
                                        },
                                        required: ['siteName', 'listName', 'filePath'],
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
                                            filePath: {
                                                title: translate(
                                                    'Process.Details.Modeler.Actions.CloudFile.FilePath',
                                                ),
                                                type: 'string',
                                            },
                                        },
                                        required: ['filePath'],
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
                                            filePath: {
                                                title: translate(
                                                    'Process.Details.Modeler.Actions.CloudFile.FilePath'
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
                                        required: ['siteName', 'listName', 'filePath', 'destinationFolderPath'],
                                    },
                                    {
                                        properties: {
                                            platform: {
                                                enum: [MicrosoftPlatform.OneDrive],
                                            },
                                            filePath: {
                                                title: translate(
                                                    'Process.Details.Modeler.Actions.CloudFile.FilePath'
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
                                        required: ['filePath', 'destinationFolderPath'],
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
                    filePath: undefined,
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
            uiSchema: {},
            formData: {
                input: {
                    siteName: undefined,
                    listName: undefined,
                    itemPath: undefined,
                    destinationFolderPath: undefined
                }
            }
        }
    },
});

export default getCloudFileActions;
