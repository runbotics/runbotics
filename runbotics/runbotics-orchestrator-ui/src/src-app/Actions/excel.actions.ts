import { translate } from '#src-app/hooks/useTranslations';

import { IBpmnAction, Runner, ActionSystem } from './types';

// eslint-disable-next-line max-lines-per-function
const getExcelActions: () => Record<string, IBpmnAction> = () => ({
    'excel.open': {
        id: 'excel.open',
        label: translate('Process.Details.Modeler.Actions.Excel.Open.Label'),
        script: 'excel.open',
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
        id: 'excel.getCell',
        label: translate('Process.Details.Modeler.Actions.Excel.GetCell.Label'),
        script: 'excel.getCell',
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
                            row: {
                                title: translate('Process.Details.Modeler.Actions.Excel.Row'),
                                type: 'string',
                            },
                            column: {
                                title: translate('Process.Details.Modeler.Actions.Excel.Column'),
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
        id: 'excel.setCell',
        label: translate('Process.Details.Modeler.Actions.Excel.SetCell.Label'),
        script: 'excel.setCell',
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
                            row: {
                                title: translate('Process.Details.Modeler.Actions.Excel.Row'),
                                type: 'string',
                            },
                            column: {
                                title: translate('Process.Details.Modeler.Actions.Excel.Column'),
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

    'excel.runMacro': {
        id: 'excel.runMacro',
        label: translate('Process.Details.Modeler.Actions.Excel.RunMacro.Label'),
        script: 'excel.runMacro',
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
                            macro: {
                                title: translate('Process.Details.Modeler.Actions.Excel.RunMacro.Name.Title'),
                                type: 'string'
                            }
                            ,
                            functionParams: {
                                title: translate('Process.Details.Modeler.Actions.Excel.RunMacro.FunctionParams'),
                                type: 'array',
                                items: {
                                    type: 'string',
                                },

                            },
                        },

                        required: ['macro'],
                    }
                }
            },
            uiSchema: {},
            formData: {},
        }
    },

    'excel.save': {
        id: 'excel.save',
        label: translate('Process.Details.Modeler.Actions.Excel.Save.Label'),
        script: 'excel.save',
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
        id: 'excel.close',
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
