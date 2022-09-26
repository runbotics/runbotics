import { translate } from 'src/hooks/useTranslations';
import { IBpmnAction, Runner } from './types';

const getSharepointFileActions:() => Record<string, IBpmnAction> = () => ({
    'sharepointFile.downloadFile': {
        id: 'sharepointFile.downloadFile',
        label: translate('Process.Details.Modeler.Actions.SharePointFile.Download.Label'),
        script: 'sharepointFile.downloadFile',
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
                        title: translate('Process.Details.Modeler.Actions.SharePointFile.Download.Input'),
                        type: 'object',
                        properties: {
                            fileName: {
                                title: translate('Process.Details.Modeler.Actions.SharePointFile.Download.FileName'),
                                type: 'string',
                            },
                            path: {
                                title: translate('Process.Details.Modeler.Actions.SharePointFile.Download.SaveTo'),
                                type: 'string',
                            },
                        },
                        required: ['fileName', 'path'],
                    },
                },
            },
            uiSchema: {
                'ui:order': ['input'],
            },
            formData: {
                input: {
                    fileName: '',
                    path: '',
                },
            },
        },
    },
    'sharepointFile.downloadFile2': {
        id: 'sharepointFile.downloadFile2',
        label: translate('Process.Details.Modeler.Actions.SharePointFile.Download2.Label'),
        script: 'sharepointFile.downloadFile2',
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
                        title: translate('Process.Details.Modeler.Actions.SharePointFile.Download2.Input'),
                        type: 'object',
                        properties: {
                            filePath: {
                                title: translate('Process.Details.Modeler.Actions.SharePointFile.Download2.FilePath'),
                                type: 'string',
                            },
                            localPath: {
                                title: translate('Process.Details.Modeler.Actions.SharePointFile.Download2.SaveTo'),
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
                    fileName: '',
                    path: '',
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
                            sitePath: {
                                title: translate(
                                    'Process.Details.Modeler.Actions.SharePointFile.DownloadFileFromSite.SitePath',
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
                        required: ['sitePath', 'listName', 'fileName', 'localPath'],
                    },
                },
            },
            uiSchema: {
                'ui:order': ['input'],
            },
            formData: {
                input: {
                    sitePath: '',
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
                            fileName: {
                                title: translate('Process.Details.Modeler.Actions.SharePointFile.Upload.FileName'),
                                type: 'string',
                            },
                            localPath: {
                                title: translate('Process.Details.Modeler.Actions.SharePointFile.Upload.LocalPath'),
                                type: 'string',
                            },
                            cloudPath: {
                                title: translate('Process.Details.Modeler.Actions.SharePointFile.Upload.CloudPath'),
                                type: 'string',
                                enum: ['root', 'site'],
                                default: 'get',
                            },
                        },
                        required: ['fileName', 'localPath'],
                        dependencies: {
                            cloudPath: {
                                oneOf: [
                                    {
                                        properties: {
                                            cloudPath: {
                                                enum: ['root'],
                                            },
                                        },
                                    },
                                    {
                                        properties: {
                                            cloudPath: {
                                                enum: ['site'],
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
                    siteName: undefined,
                    listName: undefined,
                    fileName: undefined,
                    localPath: undefined,
                    cloudPath: 'site',
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
})

export default getSharepointFileActions;
