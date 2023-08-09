import { ExcelAction } from 'runbotics-common';

import { translate } from '#src-app/hooks/useTranslations';

import { IBpmnAction, Runner, ActionSystem } from './types';

// eslint-disable-next-line max-lines-per-function
const getExcelActions: () => Record<string, IBpmnAction> = () => ({
    'excel.open': {
        id: ExcelAction.OPEN,
        label: translate('Process.Details.Modeler.Actions.Excel.Open.Label'),
        script: ExcelAction.OPEN,
        runner: Runner.DESKTOP_SCRIPT,
        system: ActionSystem.WINDOWS,
        form: {
            schema: {
                type: 'object',
                properties: {
                    input: {
                        title: translate('Process.Details.Modeler.Actions.Common.Input'),
                        type: 'object',
                        properties: {
                            path: {
                                title: translate('Process.Details.Modeler.Actions.Excel.Open.Path.Title'),
                                type: 'string',
                            },
                            worksheet: {
                                title: translate('Process.Details.Modeler.Actions.Excel.Open.Worksheet.Title'),
                                type: 'string',
                            }
                        },
                        required: ['path'],
                    },
                },
            },
            uiSchema: {
                'ui:order': ['input'],
            },
            formData: {},
        },
    },
    'excel.getCell': {
        id: ExcelAction.GET_CELL,
        label: translate('Process.Details.Modeler.Actions.Excel.GetCell.Label'),
        script: ExcelAction.GET_CELL,
        runner: Runner.DESKTOP_SCRIPT,
        system: ActionSystem.WINDOWS,
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
                            column: {
                                title: translate('Process.Details.Modeler.Actions.Excel.Column'),
                                type: 'string',
                            },
                            row: {
                                title: translate('Process.Details.Modeler.Actions.Excel.Row'),
                                type: 'string',
                            },
                            worksheet: {
                                title: translate('Process.Details.Modeler.Actions.Excel.Worksheet'),
                                type: 'string',
                            }
                        },
                        required: ['row', 'column'],
                    },
                    output: {
                        title: translate('Process.Details.Modeler.Actions.Common.Output'),
                        type: 'object',
                        properties: {
                            variableName: {
                                title: translate('Process.Details.Modeler.Actions.Common.VariableName'),
                                description: translate('Process.Details.Modeler.Actions.Common.VariableMessage'),
                                type: 'string',
                            }
                        }
                    }
                },
            },
            uiSchema: {
                'ui:order': ['input', 'output'],
            },
            formData: {
                output: {
                    variableName: undefined,
                }
            },
        },
    },
    'excel.setCell': {
        id: ExcelAction.SET_CELL,
        label: translate('Process.Details.Modeler.Actions.Excel.SetCell.Label'),
        script: ExcelAction.SET_CELL,
        runner: Runner.DESKTOP_SCRIPT,
        system: ActionSystem.WINDOWS,
        form: {
            schema: {
                type: 'object',
                properties: {
                    input: {
                        title: translate('Process.Details.Modeler.Actions.Common.Input'),
                        type: 'object',
                        properties: {
                            column: {
                                title: translate('Process.Details.Modeler.Actions.Excel.Column'),
                                type: 'string',
                            },
                            row: {
                                title: translate('Process.Details.Modeler.Actions.Excel.Row'),
                                type: 'string',
                            },
                            value: {
                                title: translate('Process.Details.Modeler.Actions.Common.Value'),
                                type: 'string'
                            },
                            worksheet: {
                                title: translate('Process.Details.Modeler.Actions.Excel.Worksheet'),
                                type: 'string',
                            }
                        },
                        required: ['row', 'column', 'value'],
                    },
                },
            },
            uiSchema: {
                'ui:order': ['input'],
            },
            formData: {},
        },
    },
    'excel.setCells': {
        id: ExcelAction.SET_CELLS,
        label: translate('Process.Details.Modeler.Actions.Excel.SetCells.Label'),
        script: ExcelAction.SET_CELLS,
        runner: Runner.DESKTOP_SCRIPT,
        system: ActionSystem.WINDOWS,
        form: {
            schema: {
                type: 'object',
                properties: {
                    input: {
                        title: translate('Process.Details.Modeler.Actions.Common.Input'),
                        type: 'object',
                        properties: {
                            startColumn: {
                                title: translate('Process.Details.Modeler.Actions.Excel.StartColumn'),
                                type: 'string',
                            },
                            startRow: {
                                title: translate('Process.Details.Modeler.Actions.Excel.StartRow'),
                                type: 'string',
                            },
                            cellValues: {
                                title: translate('Process.Details.Modeler.Actions.Excel.SetCells.CellValues'),
                                type: 'string',
                            },
                            worksheet: {
                                title: translate('Process.Details.Modeler.Actions.Excel.Worksheet'),
                                type: 'string',
                            }
                        },
                        required: ['cellValues'],
                    },
                },
            },
            uiSchema: {
                'ui:order': ['input'],
                input: {
                    cellValues: {
                        'ui:options': {
                            info: translate('Process.Details.Modeler.Actions.Excel.SetCells.CellValues.Info'),
                        }
                    },
                    startColumn: {
                        'ui:options': {
                            info: translate('Process.Details.Modeler.Actions.Excel.CellValues.StartColumn.Info'),
                        }
                    },
                    startRow: {
                        'ui:options': {
                            info: translate('Process.Details.Modeler.Actions.Excel.CellValues.StartRow.Info'),
                        },
                    },
                },
            },
            formData: {},
        },
    },
    'excel.setFirstEmptyRow': {
        id: 'excel.setFirstEmptyRow',
        label: translate('Process.Details.Modeler.Actions.Excel.SetFirstEmptyRow.Label'),
        script: 'excel.setFirstEmptyRow',
        runner: Runner.DESKTOP_SCRIPT,
        system: ActionSystem.WINDOWS,
        form: {
            schema: {
                type: 'object',
                properties: {
                    input: {
                        title: translate('Process.Details.Modeler.Actions.Common.Input'),
                        type: 'object',
                        properties: {
                            startColumn: {
                                title: translate('Process.Details.Modeler.Actions.Excel.StartColumn'),
                                type: 'string',
                            },
                            startRow: {
                                title: translate('Process.Details.Modeler.Actions.Excel.StartRow'),
                                type: 'string',
                            },
                            values: {
                                title: translate('Process.Details.Modeler.Actions.Excel.SetFirstEmptyRow.Values'),
                                type: 'string'
                            },
                            worksheet: {
                                title: translate('Process.Details.Modeler.Actions.Excel.Worksheet'),
                                type: 'string',
                            },
                        },
                        required: ['values'],
                    },
                },
            },
            uiSchema: {
                'ui:order': ['input'],
                input: {
                    cellValues: {
                        'ui:options': {
                            info: translate('Process.Details.Modeler.Actions.Excel.SetFirstEmptyRow.Values.Info'),
                        }
                    },
                    startColumn: {
                        'ui:options': {
                            info: translate('Process.Details.Modeler.Actions.Excel.SetFirstEmptyRow.StartColumn.Info'),
                        }
                    },
                    startRow: {
                        'ui:options': {
                            info: translate('Process.Details.Modeler.Actions.Excel.SetFirstEmptyRow.StartRow.Info'),
                        }
                    },
                }
            },
            formData: {},
        },
    },
    'excel.save': {
        id: ExcelAction.SAVE,
        label: translate('Process.Details.Modeler.Actions.Excel.Save.Label'),
        script: ExcelAction.SAVE,
        runner: Runner.DESKTOP_SCRIPT,
        system: ActionSystem.WINDOWS,
        form: {
            schema: {
                type: 'object',
                properties: {
                    input: {
                        title: translate('Process.Details.Modeler.Actions.Common.Input'),
                        type: 'object',
                        properties: {
                            fileName: {
                                title: translate('Process.Details.Modeler.Actions.Excel.Save.FileName.Title'),
                                type: 'string'
                            }
                        }
                    }
                }
            },
            uiSchema: {
                'ui:order': ['input'],
            },
            formData: {},
        },
    },
    'excel.close': {
        id: ExcelAction.CLOSE,
        label: translate('Process.Details.Modeler.Actions.Excel.Close.Label'),
        script: 'excel.close',
        runner: Runner.DESKTOP_SCRIPT,
        system: ActionSystem.WINDOWS,
        form: {
            schema: {},
            uiSchema: {},
            formData: {},
        },
    },
});

export default getExcelActions;
