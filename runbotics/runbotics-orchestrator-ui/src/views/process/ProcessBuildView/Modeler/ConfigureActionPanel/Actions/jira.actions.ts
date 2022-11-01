import { translate } from 'src/hooks/useTranslations';
import { IBpmnAction, Runner } from './types';

const getJiraActions: () => Record<string, IBpmnAction> = () => ({
    'jira.getLoggedWorkForUser': {
        id: 'jira.getLoggedWorkForUser',
        label: translate('Process.Details.Modeler.Actions.Jira.GetLoggedWorkForUser.Label'),
        script: 'jira.getLoggedWorkForUser',
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
                        title: translate('Process.Details.Modeler.Actions.Jira.GetLoggedWork.Input'),
                        type: 'object',
                        properties: {
                            isAll41JIRA: {
                                title: translate('Process.Details.Modeler.Actions.Jira.GetLoggedWork.UseAll41Jira'),
                                type: 'boolean',
                            },
                            email: {
                                title: translate('Process.Details.Modeler.Actions.Jira.GetLoggedWork.Email'),
                                type: 'string',
                            },
                            date: {
                                title: translate('Process.Details.Modeler.Actions.Jira.GetLoggedWork.Date'),
                                type: 'string',
                            },
                        },
                        required: ['email'],
                    },
                    output: {
                        title: translate('Process.Details.Modeler.Actions.Jira.GetLoggedWork.Output'),
                        type: 'object',
                        properties: {
                            variableName: {
                                title: translate('Process.Details.Modeler.Actions.Jira.GetLoggedWork.Variable'),
                                description: translate(
                                    'Process.Details.Modeler.Actions.Jira.GetLoggedWork.VariableText',
                                ),
                                type: 'string',
                            },
                        },
                        required: ['variableName'],
                    },
                },
            },
            uiSchema: {
                'ui:order': ['input', 'output'],
            },
            formData: {
                input: {
                    email: '',
                },
                output: {
                    variableName: '',
                },
            },
        },
    },
})

export default getJiraActions;
