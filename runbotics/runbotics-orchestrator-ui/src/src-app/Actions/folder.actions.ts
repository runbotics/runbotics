import { FolderAction, ActionRegex } from 'runbotics-common';

import { IBpmnAction, Runner } from './types';

import { translate } from '../hooks/useTranslations';

// eslint-disable-next-line max-lines-per-function
const getFolderActions = (): Record<string, IBpmnAction> => ({
    'folder.delete': {
        id: FolderAction.DELETE,
        label: translate('Process.Details.Modeler.Actions.Folder.Delete.Label'),
        script: FolderAction.DELETE,
        runner: Runner.DESKTOP_SCRIPT,
        form: {
            schema: {
                type: 'object',
                properties: {
                    input: {
                        title: translate('Process.Details.Modeler.Actions.Folder.Delete.Label'),
                        type: 'object',
                        properties: {
                            name: {
                                title: translate('Process.Details.Modeler.Actions.Folder.Delete.Name'),
                                type: 'string',
                            },
                            path: {
                                title: translate('Process.Details.Modeler.Actions.Folder.Delete.Path'),
                                type: 'string',
                            },
                            recursive: {
                                title: translate('Process.Details.Modeler.Actions.Folder.Delete.Recursive'),
                                type: 'boolean',
                            }
                        },
                        required: ['name']
                    }
                }
            },
            uiSchema: {
                'ui:order': ['input'],
            },
            formData: {
                input: {
                    path: undefined,
                    name: undefined,
                    recursive: false
                },
            }
        }
    },
    'folder.displayFiles': {
        id: FolderAction.DISPLAY_FILES,
        label: translate('Process.Details.Modeler.Actions.Folder.DisplayFiles.Label'),
        script: FolderAction.DISPLAY_FILES,
        runner: Runner.DESKTOP_SCRIPT,
        form: {
            schema: {
                type: 'object',
                properties: {
                    input: {
                        title: translate('Process.Details.Modeler.Actions.Folder.DisplayFiles.Label'),
                        type: 'object',
                        properties: {
                            name: {
                                title: translate('Process.Details.Modeler.Actions.Folder.DisplayFiles.Name'),
                                type: 'string',
                            },
                            path: {
                                title: translate('Process.Details.Modeler.Actions.Folder.DisplayFiles.Path'),
                                type: 'string',
                            },
                        },
                    }
                }
            },
            uiSchema: {
                'ui:order': ['input'],
            },
            formData: {
                input: {
                    path: undefined,
                    name: undefined,
                },
            }
        }
    },
    'folder.create': {
        id: FolderAction.CREATE,
        label: translate('Process.Details.Modeler.Actions.Folder.Create.Label'),
        script: FolderAction.CREATE,
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
                        title: translate('Process.Details.Modeler.Actions.Folder.Create.Label'),
                        type: 'object',
                        properties: {
                            name: {
                                title: translate('Process.Details.Modeler.Actions.Folder.Create.Name'),
                                type: 'string',
                            },
                            path: {
                                title: translate('Process.Details.Modeler.Actions.Folder.Path'),
                                type: 'string',
                            },
                        },
                        required: ['name'],
                    },
                    output: {
                        title: translate('Process.Details.Modeler.Actions.Common.Output'),
                        type: 'object',
                        properties: {
                            variableName: {
                                title: translate('Process.Details.Modeler.Actions.Common.VariableName'),

                                type: 'string',
                                pattern: ActionRegex.VARIABLE_NAME,
                            },
                        },
                    },
                },
            },
            uiSchema: {
                'ui:order': ['input', 'output'],
                input: {
                    name: {
                        'ui:options': {
                            info: translate('Process.Details.Modeler.Actions.Folder.Create.Name.Info'),
                        },
                    },
                    path: {
                        'ui:options': {
                            info: translate('Process.Details.Modeler.Actions.Folder.Path.Info'),
                        },
                    },
                },
                output: {
                    variableName: {
                        'ui:options': {
                            info: translate('Process.Details.Modeler.Actions.Folder.Create.Output.Info'),
                        },
                    },
                },
            },
            formData: {
                input: {
                    path: undefined,
                    name: undefined,
                },
                output: {
                    variableName: undefined,
                },
            },
        },
    },
});

export default getFolderActions;
