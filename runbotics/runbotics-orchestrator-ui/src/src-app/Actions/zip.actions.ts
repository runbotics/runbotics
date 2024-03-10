import { ActionRegex, ZipAction } from 'runbotics-common';

import { IBpmnAction, Runner } from './types';

import { translate } from '../hooks/useTranslations';

// eslint-disable-next-line max-lines-per-function
const getZipActions: () => Record<string, IBpmnAction> = () => ({
    [ZipAction.UNZIP_FILE]: {
        id: ZipAction.UNZIP_FILE,
        label: translate('Process.Details.Modeler.Actions.Zip.UnzipArchive.Label'),
        script: ZipAction.UNZIP_FILE,
        runner: Runner.DESKTOP_SCRIPT,
        form: {
            schema: {
                type: 'object',
                properties: {
                    input: {
                        title: translate('Process.Details.Modeler.Actions.Common.Input'),
                        type: 'object',
                        properties: {
                            fileName: {
                                title: translate('Process.Details.Modeler.Actions.Zip.UnzipArchive.Name'),
                                type: 'string',
                            },
                            path: {
                                title: translate('Process.Details.Modeler.Actions.Zip.Path'),
                                type: 'string',
                            }
                        },
                        required: ['fileName']
                    }
                }
            },
            uiSchema: {
                'ui:order': ['input'],
                input: {
                    fileName: {
                        'ui:options': {
                            info: translate('Process.Details.Modeler.Actions.Zip.UnzipArchive.Name.Info'),
                        }
                    },
                    path: {
                        'ui:options': {
                            info: translate('Process.Details.Modeler.Actions.Zip.UnzipArchive.Path.Info'),
                        },
                    }
                }
            },
            formData: {
                input: {
                    path: undefined,
                    fileName: undefined
                }
            }
        }
    },
    [ZipAction.ZIP_FILE]: {
        id: ZipAction.ZIP_FILE,
        label: translate('Process.Details.Modeler.Actions.Zip.CreateArchive.Label'),
        script: ZipAction.ZIP_FILE,
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
                            fileName: {
                                title: translate('Process.Details.Modeler.Actions.Zip.CreateArchive.Name'),
                                type: 'string',
                                pattern: ActionRegex.DIRECTORY_NAME
                            }, 
                            path: {
                                title: translate('Process.Details.Modeler.Actions.Zip.Path'),
                                type: 'string',
                            },
                            zipName: {
                                title: translate('Process.Details.Modeler.Actions.Zip.CreateArchive.ZipName'),
                                type: 'string',
                                pattern: ActionRegex.DIRECTORY_NAME
                            }, 
                        },
                        required: ['fileName']
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
                    }
                },
            },
            uiSchema: {
                'ui:order': ['input', 'output'],
                input: {
                    
                    fileName: {
                        'ui:options': {
                            info: translate('Process.Details.Modeler.Actions.Zip.CreateArchive.Name.Info'),
                        }
                    },
                    path: {
                        'ui:options': {
                            info: translate('Process.Details.Modeler.Actions.Zip.CreateArchive.Path.Info'),
                        },
                    },
                    zipName: {
                        'ui:options': {
                            info: translate('Process.Details.Modeler.Actions.Zip.CreateArchive.ZipName.Info'),
                        },
                    },                    
                },
                output: {
                    variableName: {
                        'ui:options': {
                            info: translate('Process.Details.Modeler.Actions.Zip.CreateArchive.Output.Info'),
                        },
                    },
                },
            },
            formData: {
                input: {
                    fileName: undefined,
                    path: undefined,
                    zipName: undefined
                },
                output: {
                    variableName: undefined,
                },
            },
        },
    }
});

export default getZipActions;
