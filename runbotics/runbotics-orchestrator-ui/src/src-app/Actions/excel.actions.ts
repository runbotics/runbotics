
import { IBpmnAction, Runner, ActionSystem } from './types';

// eslint-disable-next-line max-lines-per-function
const getExcelActions: () => Record<string, IBpmnAction> = () => ({
    'excel.open': {
        id: 'excel.open',
        label: 'Open',
        script: 'excel.open',
        runner: Runner.DESKTOP_SCRIPT,
        system: ActionSystem.WINDOWS,
        form: {
            schema: {
                type: 'object',
                properties: {
                    input: {
                        title: 'Input',
                        type: 'object',
                        properties: {
                            path: {
                                title: 'Path / Workbook',
                                type: 'string',
                            },
                            worksheet: {
                                title: 'Worksheet',
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
        label: 'getCell',
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
                        title: 'Input',
                        type: 'object',
                        properties: {
                            row: {
                                title: 'Row',
                                type: 'string',
                            },
                            column: {
                                title: 'Column',
                                type: 'string',
                            },
                        },
                        required: ['row', 'column'],
                    },
                    output: {
                        title: 'Output',
                        type: 'object',
                        properties: {
                            variableName: {
                                title: 'Assign variable',
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
        label: 'setCell',
        script: 'excel.setCell',
        runner: Runner.DESKTOP_SCRIPT,
        system: ActionSystem.WINDOWS,
        form: {
            schema: {
                type: 'object',
                properties: {
                    input: {
                        title: 'Input',
                        type: 'object',
                        properties: {
                            row: {
                                title: 'Row',
                                type: 'string',
                            },
                            column: {
                                title: 'Column',
                                type: 'string',
                            },
                            value: {
                                title: 'Value',
                                type: 'string'
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
    'excel.save': {
        id: 'excel.save',
        label: 'save',
        script: 'excel.save',
        runner: Runner.DESKTOP_SCRIPT,
        system: ActionSystem.WINDOWS,
        form: {
            schema: {
                type: 'object',
                properties: {
                    input: {
                        title: 'Input',
                        type: 'object',
                        properties: {
                            fileName: {
                                title: 'File name / File path',
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
        label: 'close',
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
