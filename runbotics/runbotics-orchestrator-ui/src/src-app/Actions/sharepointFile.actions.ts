import { translate } from '#src-app/hooks/useTranslations';

import { IBpmnAction, Runner, CloudPath } from './types';



// eslint-disable-next-line max-lines-per-function
const getSharepointFileActions: () => Record<string, IBpmnAction> = () => ({
    'sharepointFile.downloadFileFromRoot': {
        id: 'sharepointFile.downloadFileFromRoot',
        label: translate('Process.Details.Modeler.Actions.SharepointFile.DownloadFileFromRoot.Label'),
        script: 'sharepointFile.downloadFileFromRoot',
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
                        title: translate('Process.Details.Modeler.Actions.SharePointFile.DownloadFileFromRoot.Input'),
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
                        title: translate('Process.Details.Modeler.Actions.SharePointFile.DownloadFileFromRoot.Output'),
                        type: 'object',
                        properties: {
                            variableName: {
                                title: translate('Process.Details.Modeler.Actions.SharePointFile.DownloadFileFromRoot.Variable'),
                                description: translate(
                                    'Process.Details.Modeler.Actions.SharePointFile.DownloadFileFromRoot.VariableText',
                                ),
                                type: 'string',
                            },
                        },
                        required: ['variableName'],
                    }
                },
            },
            uiSchema: {
                'ui:order': ['input', 'output'],
            },
            formData: {
                input: {
                    filePath: null,
                    localPath: '',
                },
                output: {
                    variableName: null,
                }
            },
        },
    },
    'sharepointFile.downloadFileFromSite': {
        id: 'sharepointFile.downloadFileFromSite',
        label: translate('Process.Details.Modeler.Actions.SharepointFile.DownloadFileFromSite.Label'),
        script: 'sharepointFile.downloadFileFromSite',
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
                        title: translate('Process.Details.Modeler.Actions.SharePointFile.DownloadFileFromSite.Input'),
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
                        title: translate('Process.Details.Modeler.Actions.SharePointFile.DownloadFileFromSite.Output'),
                        type: 'object',
                        properties: {
                            variableName: {
                                title: translate('Process.Details.Modeler.Actions.SharePointFile.DownloadFileFromSite.Variable'),
                                description: translate(
                                    'Process.Details.Modeler.Actions.SharePointFile.DownloadFileFromSite.VariableText',
                                ),
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
                }
            },
            formData: {
                input: {
                    siteRelativePath: null,
                    listName: null,
                    folderPath: '',
                    fileName: null,
                    localPath: '',
                },
                output: {
                    variableName: null,
                }
            },
        },
    },
    'sharepointFile.downloadFiles': {
        id: 'sharepointFile.downloadFiles',
        label: translate('Process.Details.Modeler.Actions.SharepointFile.DownloadFiles.Label'),
        script: 'sharepointFile.downloadFiles',
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
                        title: translate('Process.Details.Modeler.Actions.SharePointFile.DownloadFiles.Input'),
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
                        title: translate('Process.Details.Modeler.Actions.SharePointFile.DownloadFiles.Output'),
                        type: 'object',
                        properties: {
                            variableName: {
                                title: translate(
                                    'Process.Details.Modeler.Actions.SharePointFile.DownloadFiles.Variable',
                                ),
                                description: translate(
                                    'Process.Details.Modeler.Actions.SharePointFile.DownloadFiles.VariableText',
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
                }
            },
            formData: {
                input: {
                    siteRelativePath: null,
                    listName: null,
                    fieldName: null,
                    fieldValue: null,
                    storeDirectory: null,
                },
                output: {
                    variableName: null,
                },
            },
        },
    },
    'sharepointFile.uploadFile': {
        id: 'sharepointFile.uploadFile',
        label: translate('Process.Details.Modeler.Actions.SharepointFile.UploadFile.Label'),
        script: 'sharepointFile.uploadFile',
        runner: Runner.DESKTOP_SCRIPT,
        form: {
            schema: {
                type: 'object',
                properties: {
                    input: {
                        title: translate('Process.Details.Modeler.Actions.SharePointFile.Upload.Input'),
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
                    filePath: null,
                    localPath: null,
                    cloudPath: CloudPath.SITE,
                },
            },
        },
    },
    'sharepointFile.createFolder': {
        id: 'sharepointFile.createFolder',
        label: translate('Process.Details.Modeler.Actions.SharepointFile.CreateFolder.Label'),
        script: 'sharepointFile.createFolder',
        runner: Runner.DESKTOP_SCRIPT,
        form: {
            schema: {
                type: 'object',
                properties: {
                    input: {
                        title: translate('Process.Details.Modeler.Actions.SharePointFile.CreateFolder.Input'),
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
                    folderName: null,
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
    //                     'title': 'Input',
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
    //                     'title': 'Output',
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
