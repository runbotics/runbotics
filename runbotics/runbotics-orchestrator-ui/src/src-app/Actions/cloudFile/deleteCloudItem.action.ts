import { CloudFileAction, MicrosoftPlatform, ActionCredentialType } from 'runbotics-common';

import { listNameUI, siteRelativePathUI } from '#src-app/Actions/cloudFile/cloudFile.schema';
import { IBpmnAction, Runner } from '#src-app/Actions/types';
import { translate } from '#src-app/hooks/useTranslations';

import { propertyCustomCredential, schemaCustomCredential } from '../actions.utils';

export const deleteCloudItemAction = {
    id: CloudFileAction.DELETE_ITEM,
    credentialType: ActionCredentialType.MICROSOFT_GRAPH,
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
                                        itemPath: {
                                            title: translate(
                                                'Process.Details.Modeler.Actions.CloudFile.ItemPath'
                                            ),
                                            type: 'string',
                                        },
                                        customCredentialId: propertyCustomCredential,
                                    },
                                    required: ['siteRelativePath', 'listName', 'itemPath'],
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
                                        customCredentialId: propertyCustomCredential,
                                    },
                                    required: ['itemPath'],
                                },
                            ],
                        },
                    },
                }
            }
        },
        uiSchema: {
            input: {
                customCredentialId: schemaCustomCredential,
                siteRelativePath: siteRelativePathUI,
                listName: listNameUI,
            },
        },
        formData: {
            input: {
                siteRelativePath: undefined,
                listName: undefined,
                itemPath: undefined,
                destinationFolderPath: undefined
            }
        }
    }
} satisfies IBpmnAction;
