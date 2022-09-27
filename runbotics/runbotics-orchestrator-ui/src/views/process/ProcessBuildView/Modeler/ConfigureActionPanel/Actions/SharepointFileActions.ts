import { translate } from 'src/hooks/useTranslations';
import { IBpmnAction, Runner, CloudPath } from './types';

const sharepointFileActions: Readonly<Record<string, IBpmnAction>> = {
    'sharepointFile.downloadFileFromRoot': {
        id: 'sharepointFile.downloadFileFromRoot',
        label: translate('Process.Details.Modeler.Actions.SharePointFile.DownloadFileFromRoot.Label'),
        script: 'sharepointFile.downloadFileFromRoot',
        runner: Runner.DESKTOP_SCRIPT,
        output: {
            assignVariables: false,
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
                        required: ['filePath', 'localPath'],
                    },
                },
            },
            uiSchema: {
                'ui:order': ['input'],
            },
            formData: {
                input: {
                    filePath: '',
                    localPath: '',
                },
            },
        },
    },
    'sharepointFile.downloadFileFromSite': {
        id: 'sharepointFile.downloadFileFromSite',
        label: translate('Process.Details.Modeler.Actions.SharePointFile.DownloadFileFromSite.Label'),
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
                            siteName: {
                                title: translate(
                                    'Process.Details.Modeler.Actions.SharePointFile.DownloadFileFromSite.SiteName',
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
                        required: ['siteName', 'listName', 'fileName', 'localPath'],
                    },
                },
            },
            uiSchema: {
                'ui:order': ['input'],
            },
            formData: {
                input: {
                    siteName: '',
                    listName: '',
                    folderPath: '',
                    fileName: '',
                    localPath: '',
                },
            },
        },
    },
    'sharepointFile.downloadFiles': {
        id: 'sharepointFile.downloadFiles',
        label: translate('Process.Details.Modeler.Actions.SharePointFile.DownloadFiles.Label'),
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
                            siteName: {
                                title: translate(
                                    'Process.Details.Modeler.Actions.SharePointFile.DownloadFiles.SiteName',
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
                        required: ['siteName', 'listName', 'fieldName', 'fieldValue', 'storeDirectory'],
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
            },
            formData: {
                input: {
                    siteName: undefined,
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
        id: 'sharepointFile.uploadFile',
        label: translate('Process.Details.Modeler.Actions.SharePointFile.Upload.Label'),
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
                            siteName: {
                                title: translate('Process.Details.Modeler.Actions.SharePointFile.Upload.SiteName'),
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
            },
            formData: {
                input: {
                    siteName: '',
                    listName: '',
                    filePath: '',
                    localPath: '',
                    cloudPath: CloudPath.SITE,
                },
            },
        },
    },
    'sharepointFile.createFolder': {
        id: 'sharepointFile.createFolder',
        label: translate('Process.Details.Modeler.Actions.SharePointFile.CreateFolder.Label'),
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
                            siteName: {
                                title: translate(
                                    'Process.Details.Modeler.Actions.SharePointFile.CreateFolder.SiteName',
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
            },
            formData: {
                input: {
                    siteName: '',
                    listName: '',
                    folderName: '',
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
};

export default sharepointFileActions;
