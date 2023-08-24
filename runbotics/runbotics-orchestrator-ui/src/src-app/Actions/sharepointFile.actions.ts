import { SharepointFileAction } from 'runbotics-common';

import { translate } from '#src-app/hooks/useTranslations';

import { IBpmnAction, Runner, CloudPath } from './types';



// eslint-disable-next-line max-lines-per-function
const getSharepointFileActions: () => Record<string, IBpmnAction> = () => ({
    'sharepointFile.downloadFileFromRoot': {
        id: SharepointFileAction.DOWNLOAD_FILE_FROM_ROOT,
        label: translate('Process.Details.Modeler.Actions.SharepointFile.DownloadFileFromRoot.Label'),
        script: SharepointFileAction.DOWNLOAD_FILE_FROM_ROOT,
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
                            filePath: {
                                title: translate(
                                    'Process.Details.Modeler.Actions.SharePointFile.DownloadFileFromRoot.FilePath',
                                ),
                                type: 'string',
                            },
                            localPath: {
                                title: translate(
                                    'Process.Details.Modeler.Actions.SharePointFile.DownloadFileFromRoot.SaveTo',
                                ),
                                type: 'string',
                            },
                        },
                        required: ['filePath'],
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
                        required: ['variableName'],
                    }
                },
            },
            uiSchema: {
                'ui:order': ['input', 'output'],
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
                    filePath: undefined,
                    localPath: '',
                },
                output: {
                    variableName: undefined,
                }
            },
        },
    },
    'sharepointFile.downloadFileFromSite': {
        id: SharepointFileAction.DOWNLOAD_FILE_FROM_SITE,
        label: translate('Process.Details.Modeler.Actions.SharepointFile.DownloadFileFromSite.Label'),
        script: SharepointFileAction.DOWNLOAD_FILE_FROM_SITE,
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
                            siteRelativePath: {
                                title: translate(
                                    'Process.Details.Modeler.Actions.SharePointFile.DownloadFileFromSite.SiteRelativePath',
                                ),
                                type: 'string',
                            },
                            listName: {
                                title: translate(
                                    'Process.Details.Modeler.Actions.SharePointFile.DownloadFileFromSite.ListName',
                                ),
                                type: 'string',
                            },
                            folderPath: {
                                title: translate(
                                    'Process.Details.Modeler.Actions.SharePointFile.DownloadFileFromSite.FolderPath',
                                ),
                                type: 'string',
                            },
                            fileName: {
                                title: translate(
                                    'Process.Details.Modeler.Actions.SharePointFile.DownloadFileFromSite.FileName',
                                ),
                                type: 'string',
                            },
                            localPath: {
                                title: translate(
                                    'Process.Details.Modeler.Actions.SharePointFile.DownloadFileFromSite.SaveTo',
                                ),
                                type: 'string',
                            },
                        },
                        required: ['siteRelativePath', 'listName', 'fileName'],
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
                        required: ['variableName'],
                    }
                },
            },
            uiSchema: {
                'ui:order': ['input', 'output'],
                input: {
                    siteRelativePath: {
                        'ui:options': {
                            info: translate('Process.Details.Modeler.Actions.SharePointFile.DownloadFileFromSite.SiteRelativePath.Tooltip'),
                        }
                    }
                },
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
                    siteRelativePath: undefined,
                    listName: undefined,
                    folderPath: '',
                    fileName: undefined,
                    localPath: '',
                },
                output: {
                    variableName: undefined,
                }
            },
        },
    },
    'sharepointFile.downloadFiles': {
        id: SharepointFileAction.DOWNLOAD_FILES,
        label: translate('Process.Details.Modeler.Actions.SharepointFile.DownloadFiles.Label'),
        script: SharepointFileAction.DOWNLOAD_FILES,
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
                            siteRelativePath: {
                                title: translate(
                                    'Process.Details.Modeler.Actions.SharePointFile.DownloadFiles.SiteRelativePath',
                                ),
                                type: 'string',
                            },
                            listName: {
                                title: translate(
                                    'Process.Details.Modeler.Actions.SharePointFile.DownloadFiles.ListName',
                                ),
                                type: 'string',
                            },
                            fieldName: {
                                title: translate(
                                    'Process.Details.Modeler.Actions.SharePointFile.DownloadFiles.FieldName',
                                ),
                                type: 'string',
                            },
                            fieldValue: {
                                title: translate(
                                    'Process.Details.Modeler.Actions.SharePointFile.DownloadFiles.FieldValue',
                                ),
                                type: 'string',
                            },
                            storeDirectory: {
                                title: translate('Process.Details.Modeler.Actions.SharePointFile.DownloadFiles.SaveTo'),
                                type: 'string',
                            },
                        },
                        required: ['siteRelativePath', 'listName', 'fieldName', 'fieldValue', 'storeDirectory'],
                    },
                    output: {
                        title: translate('Process.Details.Modeler.Actions.Common.Output'),
                        type: 'object',
                        properties: {
                            variableName: {
                                title: translate(
                                    'Process.Details.Modeler.Actions.Common.VariableName',
                                ),

                                type: 'string',
                            },
                        },
                        required: ['variableName'],
                    },
                },
            },
            uiSchema: {
                'ui:order': ['input', 'output'],
                input: {
                    siteRelativePath: {
                        'ui:options': {
                            info: translate('Process.Details.Modeler.Actions.SharePointFile.DownloadFiles.SiteRelativePath.Tooltip'),
                        }
                    }
                },
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
                    siteRelativePath: undefined,
                    listName: undefined,
                    fieldName: undefined,
                    fieldValue: undefined,
                    storeDirectory: undefined,
                },
                output: {
                    variableName: undefined,
                },
            },
        },
    },
    'sharepointFile.uploadFile': {
        id: SharepointFileAction.UPLOAD_FILE,
        label: translate('Process.Details.Modeler.Actions.SharepointFile.UploadFile.Label'),
        script: SharepointFileAction.UPLOAD_FILE,
        runner: Runner.DESKTOP_SCRIPT,
        form: {
            schema: {
                type: 'object',
                properties: {
                    input: {
                        title: translate('Process.Details.Modeler.Actions.Common.Input'),
                        type: 'object',
                        properties: {
                            siteRelativePath: {
                                title: translate('Process.Details.Modeler.Actions.SharePointFile.Upload.SiteRelativePath'),
                                type: 'string',
                            },
                            listName: {
                                title: translate('Process.Details.Modeler.Actions.SharePointFile.Upload.ListName'),
                                type: 'string',
                            },
                            filePath: {
                                title: translate('Process.Details.Modeler.Actions.SharePointFile.Upload.FilePath'),
                                type: 'string',
                            },
                            localPath: {
                                title: translate('Process.Details.Modeler.Actions.SharePointFile.Upload.LocalPath'),
                                type: 'string',
                            },
                            cloudPath: {
                                title: translate('Process.Details.Modeler.Actions.SharePointFile.Upload.CloudPath'),
                                type: 'string',
                                enum: [CloudPath.ROOT, CloudPath.SITE],
                                default: CloudPath.SITE,
                            },
                        },
                        required: ['filePath', 'localPath'],
                        dependencies: {
                            cloudPath: {
                                oneOf: [
                                    {
                                        properties: {
                                            cloudPath: {
                                                enum: [CloudPath.ROOT],
                                            },
                                        },
                                    },
                                    {
                                        properties: {
                                            cloudPath: {
                                                enum: [CloudPath.SITE],
                                            },
                                        },
                                    },
                                ],
                            },
                        },
                    },
                },
            },
            uiSchema: {
                'ui:order': ['input'],
                input: {
                    siteRelativePath: {
                        'ui:options': {
                            info: translate('Process.Details.Modeler.Actions.SharePointFile.Upload.SiteRelativePath.Tooltip'),
                        }
                    }
                }
            },
            formData: {
                input: {
                    siteRelativePath: '',
                    listName: '',
                    filePath: undefined,
                    localPath: undefined,
                    cloudPath: CloudPath.SITE,
                },
            },
        },
    },
    'sharepointFile.createFolder': {
        id: SharepointFileAction.CREATE_FOLDER,
        label: translate('Process.Details.Modeler.Actions.SharepointFile.CreateFolder.Label'),
        script: SharepointFileAction.CREATE_FOLDER,
        runner: Runner.DESKTOP_SCRIPT,
        form: {
            schema: {
                type: 'object',
                properties: {
                    input: {
                        title: translate('Process.Details.Modeler.Actions.Common.Input'),
                        type: 'object',
                        properties: {
                            siteRelativePath: {
                                title: translate(
                                    'Process.Details.Modeler.Actions.SharePointFile.CreateFolder.SiteRelativePath',
                                ),
                                type: 'string',
                            },
                            listName: {
                                title: translate(
                                    'Process.Details.Modeler.Actions.SharePointFile.CreateFolder.ListName',
                                ),
                                type: 'string',
                            },
                            folderName: {
                                title: translate(
                                    'Process.Details.Modeler.Actions.SharePointFile.CreateFolder.FolderName',
                                ),
                                type: 'string',
                            },
                            parentFolder: {
                                title: translate(
                                    'Process.Details.Modeler.Actions.SharePointFile.CreateFolder.ParentFolder',
                                ),
                                type: 'string',
                            },
                            cloudPath: {
                                title: translate(
                                    'Process.Details.Modeler.Actions.SharePointFile.CreateFolder.CloudPath',
                                ),
                                type: 'string',
                                enum: [CloudPath.ROOT, CloudPath.SITE],
                                default: CloudPath.SITE,
                            },
                        },
                        required: ['folderName'],
                        dependencies: {
                            cloudPath: {
                                oneOf: [
                                    {
                                        properties: {
                                            cloudPath: {
                                                enum: [CloudPath.ROOT],
                                            },
                                        },
                                    },
                                    {
                                        properties: {
                                            cloudPath: {
                                                enum: [CloudPath.SITE],
                                            },
                                        },
                                    },
                                ],
                            },
                        },
                    },
                },
            },
            uiSchema: {
                'ui:order': ['input'],
                input: {
                    siteRelativePath: {
                        'ui:options': {
                            info: translate('Process.Details.Modeler.Actions.SharePointFile.CreateFolder.SiteRelativePath.Tooltip'),
                        }
                    }
                }
            },
            formData: {
                input: {
                    siteRelativePath: '',
                    listName: '',
                    folderName: undefined,
                    parentFolder: '',
                    cloudPath: CloudPath.SITE,
                },
            },
        },
    },
    // ,
    // 'sharepointFile.getSharepointSiteConnection': {
    //     id: 'sharepointFile.getSharepointSiteConnection',
    //     label: 'Sharepoint File: Connect',
    //     script: 'sharepointFile.getSharepointSiteConnection',
    //     runner: Runner.DESKTOP_SCRIPT,
    //     output: {
    //         assignVariables: true,
    //         outputMethods: {
    //             variableName: '${content.output[0]}'
    //         }
    //     },
    //     form: {
    //         schema: {
    //             'type': 'object',
    //             'properties': {
    //                 'input': {
    //                     'Process.Details.Modeler.Actions.Common.Input',
    //                     'type': 'object',
    //                     'properties': {
    //                         'siteName': {
    //                             'title': 'Specific site name',
    //                             'type': 'string'
    //                         },
    //                         'listName': {
    //                             'title': 'Specific list name',
    //                             'type': 'string'
    //                         },
    //                     },
    //                     'required': [
    //                         'siteName',
    //                         'listName',
    //                     ]
    //                 },
    //                 'output': {
    //                     'Process.Details.Modeler.Actions.Common.Output',
    //                     'type': 'object',
    //                     'properties': {
    //                         'variableName': {
    //                             'title': 'Variable name',
    //                             'description': 'Assign the output to variable',
    //                             'type': 'string'
    //                         }
    //                     },
    //                     'required': ['variableName']
    //                 }
    //             }
    //         },
    //         uiSchema: {
    //             'ui:order': [
    //                 'input',
    //                 'output',
    //             ]
    //         },
    //         formData: {
    //             input: {
    //                 siteName: "",
    //                 listName: "",
    //             },
    //             output: {
    //                 variableName: ''
    //             }
    //         }
    //     }
    // },
});

export default getSharepointFileActions;
