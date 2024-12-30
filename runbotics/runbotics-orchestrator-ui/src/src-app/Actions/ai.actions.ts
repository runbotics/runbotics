import { ActionCredentialType, ActionRegex, AIAction } from 'runbotics-common';

import { translate } from '#src-app/hooks/useTranslations';

import { propertyCustomCredential, schemaCustomCredential } from './actions.utils';
import { IBpmnAction, Runner } from './types';


const getAIActions: () => Record<string, IBpmnAction> = () => ({
    [AIAction.CHAT]: {
        id: AIAction.CHAT,
        credentialType: ActionCredentialType.AI,
        label: translate(
            'Process.Details.Modeler.Actions.Ai.Chat.Label'
        ),
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
                        title: translate(
                            'Process.Details.Modeler.Actions.Common.Input'
                        ),
                        type: 'object',
                        properties: {
                            userMessage: {
                                title: translate(
                                    'Process.Details.Modeler.Actions.Ai.Chat.Input.Message'
                                ),
                                type: 'string',
                            },
                            imagePath: {
                                title: translate(
                                    'Process.Details.Modeler.Actions.Ai.Chat.Input.ImagePath'
                                ),
                                type: 'string',
                            },
                            customCredentialId: propertyCustomCredential,
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
                input: {
                    customCredentialId: schemaCustomCredential,
                    userMessage: {
                        'ui:options': {
                            multiline: true,
                            info: translate(
                                'Process.Details.Modeler.Actions.Ai.Chat.Input.Message.Info'
                            )
                        }
                    },
                    imagePath: {
                        'ui:options': {
                            info: translate(
                                'Process.Details.Modeler.Actions.Ai.Chat.Input.ImagePath.Info'
                            )
                        }
                    }
                },
                output: {
                    variableName: {
                        'ui:options': {
                            info: translate(
                                'Process.Details.Modeler.Actions.Ai.Chat.Output.Info'
                            ),
                        },
                    },
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
