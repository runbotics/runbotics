import { ActionCredentialType, ActionRegex, AIAction } from 'runbotics-common';

import { translate } from '#src-app/hooks/useTranslations';

import { IBpmnAction, Runner } from './types';


const getAIActions: () => Record<string, IBpmnAction> = () => ({
    [AIAction.CHAT]: {
        id: AIAction.CHAT,
        credentialType: ActionCredentialType.AI,
        label: 'Chat',
        script: AIAction.CHAT,
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
                        title: 'Input',
                        type: 'object',
                        properties: {
                            userMessage: {
                                title: 'Message',
                                type: 'string',
                            },
                            imagePath: {
                                title: 'Image path',
                                type: 'string',
                            },
                        },
                        required: ['userMessage']
                    },
                    output: {
                        title: translate(
                            'Process.Details.Modeler.Actions.Common.Output'
                        ),
                        type: 'object',
                        properties: {
                            variableName: {
                                title: translate(
                                    'Process.Details.Modeler.Actions.Common.Output'
                                ),
                                type: 'string',
                                pattern: ActionRegex.VARIABLE_NAME,
                            },
                        },
                    }
                }

            },
            uiSchema: {
                'ui:order': ['input', 'output'],
                output: {
                    variableName: {
                        'ui:options': {
                            info: 'info somewhere'
                        }
                    }
                }
            },
            formData: {
                input: {
                    userMessage: undefined,
                    imagePath: undefined,
                }
            }
        }
    }
});

export default getAIActions;
