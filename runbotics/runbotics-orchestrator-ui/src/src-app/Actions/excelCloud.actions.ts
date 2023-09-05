import { ExcelCloudAction } from 'runbotics-common';

import { translate } from '#src-app/hooks/useTranslations';

import { IBpmnAction, Runner, RegexPattern } from './types';



// eslint-disable-next-line max-lines-per-function
const getExcelCloudActions: () => Record<string, IBpmnAction> = () => ({
    [ExcelCloudAction.OPEN_FILE]: {
        id: ExcelCloudAction.OPEN_FILE,
        label: translate('Process.Details.Modeler.Actions.ExcelCloud.OpenWorkbook.Label'),
        script: ExcelCloudAction.OPEN_FILE,
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
                                title: translate('Process.Details.Modeler.Actions.ExcelCloud.OpenWorkbook.Platform'),
                                type: 'string',
                                enum: ['OneDrive', 'SharePoint'],
                            },
                        },
                        dependencies: {
                            platform: {
                                oneOf: [
                                    {
                                        properties: {
                                            platform: {
                                                enum: ['SharePoint'],
                                            },
                                            site: {
                                                title: translate(
                                                    'Process.Details.Modeler.Actions.ExcelCloud.OpenWorkbook.SharePoint.Site',
                                                ),
                                                type: 'string',
                                            },
                                            list: {
                                                title: translate(
                                                    'Process.Details.Modeler.Actions.ExcelCloud.OpenWorkbook.SharePoint.List',
                                                ),
                                                type: 'string',
                                            },
                                            workbookPath: {
                                                title: translate(
                                                    'Process.Details.Modeler.Actions.ExcelCloud.OpenWorkbook.WorkbookPath',
                                                ),
                                                type: 'string',
                                            },
                                            worksheet: {
                                                title: translate(
                                                    'Process.Details.Modeler.Actions.ExcelCloud.OpenWorkbook.Worksheet',
                                                ),
                                                type: 'string',
                                            },
                                            persistChanges: {
                                                title: translate(
                                                    'Process.Details.Modeler.Actions.ExcelCloud.OpenWorkbook.PersistChanges',
                                                ),
                                                type: 'boolean',
                                            },
                                        },
                                        required: ['site', 'list', 'workbookPath', 'worksheet'],
                                    },
                                    {
                                        properties: {
                                            platform: {
                                                enum: ['OneDrive'],
                                                description: 'dupa',
                                            },
                                            workbookPath: {
                                                title: translate(
                                                    'Process.Details.Modeler.Actions.ExcelCloud.OpenWorkbook.WorkbookPath',
                                                ),
                                                type: 'string',
                                            },
                                            worksheet: {
                                                title: translate(
                                                    'Process.Details.Modeler.Actions.ExcelCloud.OpenWorkbook.Worksheet',
                                                ),
                                                type: 'string',
                                            },
                                            persistChanges: {
                                                title: translate(
                                                    'Process.Details.Modeler.Actions.ExcelCloud.OpenWorkbook.PersistChanges',
                                                ),
                                                type: 'boolean',
                                            },
                                        },
                                        required: ['workbookPath', 'worksheet'],
                                    },
                                ],
                            },

                        },
                        if: {
                            properties: { 
                                platform: { 
                                    enum: ['OneDrive'] 
                                } 
                            }
                        },
                        then: {
                            description: translate('Process.Details.Modeler.Actions.ExcelCloud.OpenWorkbook.Platform.Description')
                        },
                    },
                },
            },
            uiSchema: {
                'ui:order': ['input'],
                input: {
                    workbookPath: {
                        'ui:options': {
                            info: translate('Process.Details.Modeler.Actions.ExcelCloud.OpenWorkbook.WorkbookPath.Info'),
                        }
                    },
                },
            },
            formData: {
                input: {
                    platform: 'OneDrive',
                    site: undefined,
                    list: undefined,
                    workbookPath: undefined,
                    worksheet: undefined,
                    persistChanges: true,
                },
            },
        },
    },
    [ExcelCloudAction.SET_CELL]: {
        id: ExcelCloudAction.SET_CELL,
        label: translate('Process.Details.Modeler.Actions.ExcelCloud.SetCell.Label'),
        script: ExcelCloudAction.SET_CELL,
        runner: Runner.DESKTOP_SCRIPT,
        form: {
            schema: {
                type: 'object',
                properties: {
                    input: {
                        title: translate('Process.Details.Modeler.Actions.Common.Input'),
                        type: 'object',
                        properties: {
                            cell: {
                                title: translate('Process.Details.Modeler.Actions.ExcelCloud.SetCell.Cell'),
                                type: 'string',
                            },
                            value: {
                                title: translate('Process.Details.Modeler.Actions.ExcelCloud.SetCell.Value'),
                                type: 'string',
                            },
                        },
                        required: ['cell', 'value'],
                    },
                },
            },
            uiSchema: {
                'ui:order': ['input'],
            },
            formData: {
                input: {
                    cell: undefined,
                    value: undefined,
                },
            },
        },
    }
});

export default getExcelCloudActions;