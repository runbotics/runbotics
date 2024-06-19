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
                        required: ['variableName'],
                    },
                }
            },
            uiSchema: {
                'ui:order': ['input', 'output'],
                input: {
                    name: {
                        'ui:options': {
                            info: translate('Process.Details.Modeler.Actions.Folder.DisplayFiles.Name.Info'),
                        },
                    },
                    path: {
                        'ui:options': {
                            info: translate('Process.Details.Modeler.Actions.Folder.DisplayFiles.Path.Info'),
                        },
                    },
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
                    path: undefined,
                    name: undefined,
                },
                output: {
                    variableName: undefined,
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
                                pattern: ActionRegex.DIRECTORY_NAME,
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
    'folder.rename': {
        id: FolderAction.RENAME,
        label: translate('Process.Details.Modeler.Actions.Folder.Rename.Label'),
        script: FolderAction.RENAME,
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
                        title: translate('Process.Details.Modeler.Actions.Folder.Rename.Label'),
                        type: 'object',
                        properties: {
                            path: {
                                title: translate('Process.Details.Modeler.Actions.Folder.Path'),
                                type: 'string',
                            },
                            newName: {
                                title: translate('Process.Details.Modeler.Actions.Folder.Rename.NewName'),
                                type: 'string',
                                pattern: ActionRegex.DIRECTORY_NAME
                            },
                        },
                        required: ['path', 'newName'],
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
                    path: {
                        'ui:options': {
                            info: translate('Process.Details.Modeler.Actions.Folder.Rename.Path.Info'),
                        },
                    },
                    newName: {
                        'ui:options': {
                            info: translate('Process.Details.Modeler.Actions.Folder.Rename.NewName.Info'),
                        },
                    },
                },
                output: {
                    variableName: {
                        'ui:options': {
                            info: translate('Process.Details.Modeler.Actions.Folder.Rename.Output.Info'),
                        },
                    },
                },
            },
            formData: {
                input: {
                    path: undefined,
                    newName: undefined,
                },
                output: {
                    variableName: undefined,
                },
            },
        },
    },
    'folder.exists': {
        id: FolderAction.EXISTS,
        label: translate('Process.Details.Modeler.Actions.Folder.Exists.Label'),
        script: FolderAction.EXISTS,
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
                        title: translate('Process.Details.Modeler.Actions.Folder.Exists.Label'),
                        type: 'object',
                        properties: {
                            name: {
                                title: translate('Process.Details.Modeler.Actions.Folder.Exists.Name'),
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
                }
            },
            uiSchema: {
                'ui:order': ['input', 'output'],
                input: {
                    name: {
                        'ui:options': {
                            info: translate('Process.Details.Modeler.Actions.Folder.Exists.Name.Info'),
                        },
                    },
                    path: {
                        'ui:options': {
                            info: translate('Process.Details.Modeler.Actions.Folder.Exists.Path.Info'),
                        },
                    },
                },
                output: {
                    variableName: {
                        'ui:options': {
                            info: translate('Process.Details.Modeler.Actions.Folder.Exists.Output.Info'),
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
            }
        }
    },
});

export default getFolderActions;
