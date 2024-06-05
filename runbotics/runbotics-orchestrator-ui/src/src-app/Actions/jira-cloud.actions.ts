import { ActionRegex, JiraCloudAction } from 'runbotics-common';

import { ActionCredentialType } from '#src-app/Actions/action-credential-type';
import { translate } from '#src-app/hooks/useTranslations';

import { IBpmnAction, Runner } from './types';

const getJiraCloudActions: () => Record<string, IBpmnAction & Required<Pick<IBpmnAction, 'credentialType'>>> = () => {
    const dateMode = {
        date: {
            title: translate('Process.Details.Modeler.Actions.Common.Date'),
            value: 'date',
        },
        period: {
            title: translate('Process.Details.Modeler.Actions.Common.Period'),
            value: 'period'
        },
        collection: {
            title: translate('Process.Details.Modeler.Actions.Common.Collection'),
            value: 'collection'
        }
    } as const;

    return ({
        [JiraCloudAction.GET_USER_WORKLOGS]: {
            id: JiraCloudAction.GET_USER_WORKLOGS,
            credentialType: ActionCredentialType.ATLASSIAN,
            label: translate('Process.Details.Modeler.Actions.JiraCloud.GetUserWorklogs.Label'),
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
                                    title: translate('Process.Details.Modeler.Actions.JiraCloud.GetUserWorklogs.Origin'),
                                    type: 'string',
                                },
                                usernameEnv: {
                                    title: translate('Process.Details.Modeler.Actions.JiraCloud.GetUserWorklogs.Username'),
                                    type: 'string',
                                },
                                passwordEnv: {
                                    title: translate('Process.Details.Modeler.Actions.JiraCloud.GetUserWorklogs.Password'),
                                    type: 'string',
                                },
                                email: {
                                    title: translate('Process.Details.Modeler.Actions.Common.Email'),
                                    type: 'string',
                                },
                                groupByDay: {
                                    title: translate('Process.Details.Modeler.Actions.JiraCloud.GetUserWorklogs.GroupByDay'),
                                    type: 'boolean',
                                },
                                mode: {
                                    title: translate('Process.Details.Modeler.Actions.JiraCloud.GetUserWorklogs.DateMode'),
                                    type: 'string',
                                    enum: [dateMode.date.value, dateMode.period.value, dateMode.collection.value],
                                    enumNames: [dateMode.date.title, dateMode.period.title, dateMode.collection.title],
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
                                                title: translate('Process.Details.Modeler.Actions.JiraCloud.GetUserWorklogs.StartDate'),
                                                type: 'string',
                                            },
                                            endDate: {
                                                title: translate('Process.Details.Modeler.Actions.JiraCloud.GetUserWorklogs.EndDate'),
                                                type: 'string',
                                            },
                                        },
                                        required: ['startDate', 'endDate'],
                                    }, {
                                        properties: {
                                            mode: {
                                                enum: [dateMode.collection.value],
                                            },
                                            dates: {
                                                title: translate('Process.Details.Modeler.Actions.JiraCloud.GetUserWorklogs.DatesList'),
                                                type: 'string',
                                            },
                                        },
                                        required: ['dates']
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
                                info: translate('Process.Details.Modeler.Actions.JiraCloud.GetUserWorklogs.Output.Info'),
                            }
                        },
                    }
                },
                formData: {},
            },
        },
    });
};

export default getJiraCloudActions;
