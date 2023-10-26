import { ImageAction } from 'runbotics-common';

import { translate } from '#src-app/hooks/useTranslations';

import { IBpmnAction, Runner } from './types';

const getImageActions: () => Record<string, IBpmnAction> = () => ({
    [ImageAction.GRAY_SCALE]: {
        id: ImageAction.GRAY_SCALE,
        label: translate('Process.Details.Modeler.Actions.Image.Grayscale.Label'),
        script: ImageAction.GRAY_SCALE,
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
                            imagePath: {
                                title: translate('Process.Details.Modeler.Actions.Image.Grayscale.ImagePath'),
                                type: 'string',
                            },
                            resultImagePath: {
                                title: translate('Process.Details.Modeler.Actions.Image.Grayscale.ConvertedImagePath'),
                                type: 'string',
                            },
                        },
                        required: ['imagePath'],
                    },
                    output: {
                        title: translate('Process.Details.Modeler.Actions.Common.Output'),
                        type: 'object',
                        properties: {
                            variableName: {
                                title: translate('Process.Details.Modeler.Actions.Image.Grayscale.ConvertedImageAbsolutePath'),
                                type: 'string',
                            },
                        },
                    },
                },
            },
            uiSchema: {
                'ui:order': ['input', 'output'],
            },
            formData: {
                input: {
                    imagePath: undefined
                }
            },
        },
    }
});

export default getImageActions;
