import { IBpmnAction, Runner } from './types';

// eslint-disable-next-line max-lines-per-function
const getDesktopActions: () => Record<string, IBpmnAction> = () => ({
    'desktopAutomation.click': {
        id: 'desktopAutomation.click',
        label: 'Click',
        script: 'desktopAutomation.click',
        runner: Runner.DESKTOP_SCRIPT,
        form: {
            schema: {
                type: 'object',
                properties: {
                    input: {
                        title: 'Input',
                        type: 'object',
                        properties: {
                            xCoordinate: {
                                title: 'Target x-coordinate',
                                type: 'number',
                            },
                            yCoordinate: {
                                title: 'Target y-coordinate',
                                type: 'number',
                            },
                            mouseButton: {
                                title: 'Button',
                                type:'string',
                                enum: [
                                    'Left',
                                    'Right'
                                ]
                            }
                        },
                        required: ['xCoordinate', 'yCoordinate'],
                    },
                },
            },
            uiSchema: {
                'ui:order': ['input'],
            },
            formData: {
                input: {
                    xCoordinate: undefined,
                    yCoordinate: undefined,
                    mouseButton: 'Left'
                },
            },
        },
    },
    'desktopAutomation.type': {
        id: 'desktopAutomation.type',
        label: 'Type',
        script: 'desktopAutomation.type',
        runner: Runner.DESKTOP_SCRIPT,
        form: {
            schema: {
                type: 'object',
                properties: {
                    input: {
                        title: 'Input',
                        type: 'object',
                        properties: {
                            xCoordinate: {
                                title: 'Target x-coordinate',
                                type: 'number',
                            },
                            yCoordinate: {
                                title: 'Target y-coordinate',
                                type: 'number',
                            },
                            text: {
                                title: 'Text or single key to press (e.g. Key.Enter, Key.Tab)',
                                type: 'string',
                            }
                        },
                        required: ['xCoordinate', 'yCoordinate', 'text'],
                    },
                },
            },
            uiSchema: {
                'ui:order': ['input']
            },
            formData: {
                input: {
                    xCoordinate: undefined,
                    yCoordinate: undefined,
                    text: ''
                },
            },
        },
    },
    'desktopAutomation.copySelection': {
        id: 'desktopAutomation.copySelection',
        label: 'Copy selection',
        script: 'desktopAutomation.copySelection',
        runner: Runner.DESKTOP_SCRIPT,
        form: {
            schema: {
                type: 'object',
                properties: {
                    input: {
                        title: 'Input',
                        type: 'object',
                        properties: {
                            startPointFirstCoordinate: {
                                title: 'Selection start point (x-coordinate)',
                                type: 'number',
                            },
                            startPointSecondCoordinate: {
                                title: 'Selection start point (y-coordinate)',
                                type: 'number',
                            },
                            endPointFirstCoordinate: {
                                title: 'Selection end point (x-coordinate)',
                                type: 'number',
                            },
                            endPointSecondCoordinate: {
                                title: 'Selection end point (y-coordinate)',
                                type: 'number',
                            },
                        },
                        required: ['startPointFirstCoordinate', 'startPointSecondCoordinate', 'endPointFirstCoordinate', 'endPointSecondCoordinate'],
                    },
                },
            },
            uiSchema: {
                'ui:order': ['input'],
            },
            formData: {
                formData: {
                    input: {
                        startPointFirstCoordinate: undefined,
                        startPointSecondCoordinate: undefined,
                        endPointFirstCoordinate: undefined,
                        endPointSecondCoordinate: undefined,
                    },
                },
            },
        },
    },
    'desktopAutomation.paste': {
        id: 'desktopAutomation.paste',
        label: 'Paste',
        script: 'desktopAutomation.paste',
        runner: Runner.DESKTOP_SCRIPT,
        form: {
            schema: {
                type: 'object',
                properties: {
                    input: {
                        title: 'Input',
                        type: 'object',
                        properties: {
                            xCoordinate: {
                                title: 'Target x-coordinate',
                                type: 'number',
                            },
                            yCoordinate: {
                                title: 'Target y-coordinate',
                                type: 'number',
                            },
                        },
                        required: ['xCoordinate', 'yCoordinate'],
                    },
                },
            },
            uiSchema: {
                'ui:order': ['input'],
            },
            formData: {
                input: {
                    xCoordinate: undefined,
                    yCoordinate: undefined,
                },
            },
        },
    },
    'desktopAutomation.maximizeWindow': {
        id: 'desktopAutomation.maximizeWindow',
        label: 'Maximize window',
        script: 'desktopAutomation.maximizeWindow',
        runner: Runner.DESKTOP_SCRIPT,
        form: {
            schema: {},
            uiSchema: {},
            formData: {},
        },
    }
});

export default getDesktopActions;
