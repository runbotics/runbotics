import { JiraServerAction, ActionRegex } from 'runbotics-common';

import { translate } from '#src-app/hooks/useTranslations';

import { IBpmnAction, Runner } from './types';



const getJiraServerActions: () => Record<string, IBpmnAction> = () => {
    const dateMode = {
        date: {
            title: translate('Process.Details.Modeler.Actions.Common.Date'),
            value: 'date',
        },
        period: {
            title: translate('Process.Details.Modeler.Actions.Common.Period'),
            value: 'period'
        }
    } as const;

    return ({
        [JiraServerAction.GET_USER_WORKLOGS]: {
            id: JiraServerAction.GET_USER_WORKLOGS,
            label: translate('Process.Details.Modeler.Actions.JiraServer.GetUserWorklogs.Label'),
            script: JiraServerAction.GET_USER_WORKLOGS,
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
                                    title: translate('Process.Details.Modeler.Actions.JiraServer.GetUserWorklogs.Origin'),
                                    type: 'string',
                                },
                                usernameEnv: {
                                    title: translate('Process.Details.Modeler.Actions.JiraServer.GetUserWorklogs.Username'),
                                    type: 'string',
                                },
                                passwordEnv: {
                                    title: translate('Process.Details.Modeler.Actions.JiraServer.GetUserWorklogs.Password'),
                                    type: 'string',
                                },
                                email: {
                                    title: translate('Process.Details.Modeler.Actions.Common.Email'),
                                    type: 'string',
                                },
                                groupByDay: {
                                    title: translate('Process.Details.Modeler.Actions.JiraServer.GetUserWorklogs.GroupByDay'),
                                    type: 'boolean',
                                },
                                mode: {
                                    title: translate('Process.Details.Modeler.Actions.JiraServer.GetUserWorklogs.DateMode'),
                                    type: 'string',
                                    enum: [dateMode.date.value, dateMode.period.value],
                                    enumNames: [dateMode.date.title, dateMode.period.title],
                                    default: dateMode.date.value,
                                },
                            },
                            dependencies: {
                                mode: {
                                    oneOf: [{
                                        properties: {
                                            mode: {
                                                enum: [dateMode.date.value],
                                            },
                                            date: {
                                                title: translate('Process.Details.Modeler.Actions.Common.Date'),
                                                type: 'string',
                                            },
                                        },
                                        required: ['date'],
                                    }, {
                                        properties: {
                                            mode: {
                                                enum: [dateMode.period.value],
                                            },
                                            startDate: {
                                                title: translate('Process.Details.Modeler.Actions.JiraServer.GetUserWorklogs.StartDate'),
                                                type: 'string',
                                            },
                                            endDate: {
                                                title: translate('Process.Details.Modeler.Actions.JiraServer.GetUserWorklogs.EndDate'),
                                                type: 'string',
                                            },
                                        },
                                        required: ['startDate', 'endDate'],
                                    }],
                                },
                            },
                            required: ['originEnv', 'usernameEnv', 'passwordEnv', 'email']
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
                                info: translate('Process.Details.Modeler.Actions.JiraServer.GetUserWorklogs.Output.Info'),
                            }
                        },
                    }
                },
                formData: {},
            },
        },
    });
};

export default getJiraServerActions;
