import { CloudFileAction, MicrosoftPlatform, ActionCredentialType } from 'runbotics-common';

import { listNameUI, siteRelativePathUI } from '#src-app/Actions/cloudFile/cloudFile.schema';
import { IBpmnAction, Runner } from '#src-app/Actions/types';
import { translate } from '#src-app/hooks/useTranslations';

import { propertyCustomCredential, schemaCustomCredential } from '../actions.utils';

export const createShareLinkAction = {
    id: CloudFileAction.CREATE_SHARE_LINK,
    credentialType: ActionCredentialType.MICROSOFT_GRAPH,
    label: translate('Process.Details.Modeler.Actions.CloudFile.CreateShareLink.Label'),
    script: CloudFileAction.CREATE_SHARE_LINK,
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
                                        shareType: {
                                            title: translate(
                                                'Process.Details.Modeler.Actions.CloudFile.CreateShareLink.ShareType',
                                            ),
                                            type: 'string',
                                            enum: ['View', 'Edit', 'Embed'],
                                            default: 'View',
                                        },
                                        shareScope: {
                                            title: translate(
                                                'Process.Details.Modeler.Actions.CloudFile.CreateShareLink.ShareScope',
                                            ),
                                            type: 'string',
                                            enum: ['Users', 'Organization', 'Anonymous'],
                                            default: 'Users',
                                        },
                                        itemPath: {
                                            title: translate(
                                                'Process.Details.Modeler.Actions.CloudFile.ItemPath',
                                            ),
                                            type: 'string',
                                        },
                                        customCredentialId: propertyCustomCredential,
                                    },
                                    required: ['siteRelativePath', 'listName', 'shareType', 'shareScope', 'itemPath'],
                                },
                                {
                                    properties: {
                                        platform: {
                                            enum: [MicrosoftPlatform.OneDrive],
                                        },
                                        shareType: {
                                            title: translate(
                                                'Process.Details.Modeler.Actions.CloudFile.CreateShareLink.ShareType',
                                            ),
                                            type: 'string',
                                            enum: ['View', 'Edit', 'Embed'],
                                            default: 'View',
                                        },
                                        shareScope: {
                                            title: translate(
                                                'Process.Details.Modeler.Actions.CloudFile.CreateShareLink.ShareScope',
                                            ),
                                            type: 'string',
                                            enum: ['Users', 'Organization', 'Anonymous'],
                                            default: 'Users',
                                        },
                                        itemPath: {
                                            title: translate(
                                                'Process.Details.Modeler.Actions.CloudFile.ItemPath',
                                            ),
                                            type: 'string',
                                        },
                                        customCredentialId: propertyCustomCredential,
                                    },
                                    required: ['shareType', 'shareScope', 'itemPath'],
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
                            title: translate('Process.Details.Modeler.Actions.Common.VariableName'),
                            type: 'string',
                        },
                    },
                },
            },
        },
        uiSchema: {
            'ui:order': ['input', 'output'],
            input: {
                customCredentialId: schemaCustomCredential,
                siteRelativePath: siteRelativePathUI,
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
                siteRelativePath: undefined,
                listName: undefined,
                itemPath: undefined,
                destinationFolderPath: undefined,
                shareType: 'View',
                shareScope: 'Users',
            },
        },
    },
} satisfies IBpmnAction;
