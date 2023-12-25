import { JiraCloudAction, ActionRegex } from 'runbotics-common';

import { translate } from '#src-app/hooks/useTranslations';

import { IBpmnAction, JiraDateMode, Runner } from './types';



const getJiraCloudActions: () => Record<string, IBpmnAction> = () => ({
    [JiraCloudAction.GET_USER_WORKLOGS]: {
        id: JiraCloudAction.GET_USER_WORKLOGS,
        label: 'Get User Worklogs',
        script: JiraCloudAction.GET_USER_WORKLOGS,
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
                            originEnv: {
                                title: 'Origin - Environment Variable',
                                type: 'string',
                            },
                            userEnv: {
                                title: 'Username - Environment Variable',
                                type: 'string',
                            },
                            passwordEnv: {
                                title: 'Password - Environment Variable',
                                type: 'string',
                            },
                            email: {
                                title: 'Email',
                                type: 'string',
                            },
                            mode: {
                                title: 'Date Mode',
                                type: 'string',
                                enum: [JiraDateMode.Date, JiraDateMode.Period],
                                default: JiraDateMode.Date,
                            },
                        },
                        dependencies: {
                            mode: {
                                oneOf: [{
                                    properties: {
                                        mode: {
                                            enum: [JiraDateMode.Date],
                                        },
                                        date: {
                                            title: 'Date',
                                            type: 'string',
                                        },
                                    },
                                    required: ['date'],
                                }, {
                                    properties: {
                                        mode: {
                                            enum: [JiraDateMode.Period],
                                        },
                                        startDate: {
                                            title: 'Start Date',
                                            type: 'string',
                                        },
                                        endDate: {
                                            title: 'End Date',
                                            type: 'string',
                                        },
                                    },
                                    required: ['startDate', 'endDate'],
                                }],
                            },
                        },
                        required: ['originEnv', 'userEnv', 'passwordEnv', 'email']
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
                output: {
                    variableName: {
                        'ui:options': {
                            info: '2D array of given user\'s worklogs grouped by day',
                        }
                    },
                }
            },
            formData: {},
        },
    },
});

export default getJiraCloudActions;
