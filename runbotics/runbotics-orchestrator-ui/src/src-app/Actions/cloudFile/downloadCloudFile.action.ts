import { CloudFileAction, MicrosoftPlatform } from 'runbotics-common';

import { IBpmnAction, Runner } from '#src-app/Actions/types';
import { translate } from '#src-app/hooks/useTranslations';
import { listNameUI, siteNameUI } from '#src-app/Actions/cloudFile/cloudFile.schema';

export const downloadCloudFileAction: IBpmnAction = {
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
                        },
                    },
                },
            },
        },
        uiSchema: {
            input: {
                siteName: siteNameUI,
                listName: listNameUI,
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
                siteName: undefined,
                listName: undefined,
                filePath: undefined,
                localDirectory: undefined,
            },
        },
    },
};
