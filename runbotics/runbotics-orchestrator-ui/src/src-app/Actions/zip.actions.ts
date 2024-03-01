import { ActionRegex, ZipAction } from 'runbotics-common';

import { IBpmnAction, Runner } from './types';

import { translate } from '../hooks/useTranslations';

// eslint-disable-next-line max-lines-per-function
const getZipActions: () => Record<string, IBpmnAction> = () => ({
    [ZipAction.UNZIP_FILE]: {
        id: ZipAction.UNZIP_FILE,
        label: translate('Process.Details.Modeler.Actions.Zip.Unzip.Label'),
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
                                title: translate('Process.Details.Modeler.Actions.Zip.Name'),
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
                            info: translate('Process.Details.Modeler.Actions.Zip.Unzip.Name.Info'),
                        }
                    },
                    path: {
                        'ui:options': {
                            info: translate('Process.Details.Modeler.Actions.Zip.Unzip.Path.Info'),
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
        label: translate('Process.Details.Modeler.Actions.Zip.Zip.Label'),
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
                                title: translate('Process.Details.Modeler.Actions.Zip.Name'),
                                type: 'string',
                                pattern: ActionRegex.DIRECTORY_NAME
                            },
                            path: {
                                title: translate('Process.Details.Modeler.Actions.Zip.Path'),
                                type: 'string',
                            }
                        },
                        required: ['path']
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
                            info: translate('Process.Details.Modeler.Actions.Zip.Zip.Name.Info'),
                        }
                    },
                    path: {
                        'ui:options': {
                            info: translate('Process.Details.Modeler.Actions.Zip.Zip.Path.Info'),
                        },
                    }
                },
                output: {
                    variableName: {
                        'ui:options': {
                            info: translate('Process.Details.Modeler.Actions.Zip.Zip.Output.Info'),
                        },
                    },
                },
            },
            formData: {
                input: {
                    path: undefined,
                    fileName: undefined
                },
                output: {
                    variableName: undefined,
                },
            },
        },
    }
});

export default getZipActions;
