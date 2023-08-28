import { JiraAction } from 'runbotics-common';

import { translate } from '#src-app/hooks/useTranslations';

import { IBpmnAction, Runner, VARIABLE_NAME_PATTERN } from './types';



const getJiraActions: () => Record<string, IBpmnAction> = () => ({
    'jira.getLoggedWorkForUser': {
        id: JiraAction.GET_LOGGED_WORK_FOR_USER,
        label: translate('Process.Details.Modeler.Actions.Jira.GetLoggedWorkForUser.Label'),
        script: JiraAction.GET_LOGGED_WORK_FOR_USER,
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
                        title: translate('Process.Details.Modeler.Actions.Common.Output'),
                        type: 'object',
                        properties: {
                            variableName: {
                                title: translate('Process.Details.Modeler.Actions.Common.VariableName'),

                                type: 'string',
                                pattern: VARIABLE_NAME_PATTERN,
                            },
                        },
                        required: ['variableName'],
                    },
                },
            },
            uiSchema: {
                'ui:order': ['input', 'output'],
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
                    email: undefined,
                },
                output: {
                    variableName: undefined,
                },
            },
        },
    },
});

export default getJiraActions;
