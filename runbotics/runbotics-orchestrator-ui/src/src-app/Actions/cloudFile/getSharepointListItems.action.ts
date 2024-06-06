import { CloudFileAction } from 'runbotics-common';

import { IBpmnAction, Runner } from '#src-app/Actions/types';
import { translate } from '#src-app/hooks/useTranslations';
import { listNameUI, siteNameUI } from '#src-app/Actions/cloudFile/cloudFile.schema';

export const getSharepointListItemsAction: IBpmnAction = {
    id: CloudFileAction.GET_SHAREPOINT_LIST_ITEMS,
    label: translate('Process.Details.Modeler.Actions.CloudFile.GetSharePointListItems.Label'),
    script: CloudFileAction.GET_SHAREPOINT_LIST_ITEMS,
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
            },
        },
    },
};
