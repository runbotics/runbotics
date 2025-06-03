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
                            },
                            outDirName: {
                                title: translate('Process.Details.Modeler.Actions.Zip.UnzipArchive.OutputName'),
                                type: 'string',
                            },
                            outDirPath: {
                                title: translate('Process.Details.Modeler.Actions.Zip.UnzipArchive.OutputDirectory'),
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
                    },
                    outDirName: {
                        'ui:options': {
                            info: translate('Process.Details.Modeler.Actions.Zip.UnzipArchive.Name.Info'),
                        }
                    },
                    outDirPath: {
                        'ui:options': {
                            info: translate('Process.Details.Modeler.Actions.Zip.UnzipArchive.Path.Info'),
                        }
                    },
                }
            },
            formData: {
                input: {
                    toZipPath: undefined,
                    zipPath: undefined,
                    outDirName: undefined,
                    outDirPath: undefined,
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
                            toZipPath: {
                                title: translate('Process.Details.Modeler.Actions.Zip.Zip.Path'),
                                type: 'string',
                            },
                            zipPath: {
                                title: translate('Process.Details.Modeler.Actions.Zip.CreateArchive.ZipPath'),
                                type: 'string',
                            },
                        },
                        required: ['toZipPath']
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
                    toZipPath: {
                        'ui:options': {
                            info: translate('Process.Details.Modeler.Actions.Zip.CreateArchive.Path.Info'),
                        },
                    },
                    zipPath: {
                        'ui:options': {
                            info: translate('Process.Details.Modeler.Actions.Zip.CreateArchive.ZipPath.Info'),
                        }
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
                    toZipPath: undefined,
                    zipPath: undefined
                },
                output: {
                    variableName: undefined,
                },
            },
        },
    }
});

export default getZipActions;
