/* eslint-disable max-lines-per-function */
import { JiraCloudAction, ActionRegex, JiraTaskStatus, JiraSprintState } from 'runbotics-common';

import { translate } from '#src-app/hooks/useTranslations';

import { IBpmnAction, Runner } from './types';



const getJiraCloudActions: () => Record<string, IBpmnAction> = () => {
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
        [JiraCloudAction.GET_PROJECT_WORKLOGS]: {
            id: JiraCloudAction.GET_PROJECT_WORKLOGS,
            label: translate('Process.Details.Modeler.Actions.JiraCloud.GetProjectWorklogs.Label'),
            script: JiraCloudAction.GET_PROJECT_WORKLOGS,
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
                                    title: translate('Process.Details.Modeler.Actions.JiraCloud.GetProjectWorklogs.Origin'),
                                    type: 'string',
                                },
                                usernameEnv: {
                                    title: translate('Process.Details.Modeler.Actions.JiraCloud.GetProjectWorklogs.Username'),
                                    type: 'string',
                                },
                                passwordEnv: {
                                    title: translate('Process.Details.Modeler.Actions.JiraCloud.GetProjectWorklogs.Password'),
                                    type: 'string',
                                },
                                project: {
                                    title: translate('Process.Details.Modeler.Actions.JiraCloud.GetProjectWorklogs.Project'),
                                    type: 'string',
                                },
                                groupByDay: {
                                    title: translate('Process.Details.Modeler.Actions.JiraCloud.GetProjectWorklogs.GroupByDay'),
                                    type: 'boolean',
                                },
                                mode: {
                                    title: translate('Process.Details.Modeler.Actions.JiraCloud.GetProjectWorklogs.DateMode'),
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
                                                title: translate('Process.Details.Modeler.Actions.JiraCloud.GetProjectWorklogs.StartDate'),
                                                type: 'string',
                                            },
                                            endDate: {
                                                title: translate('Process.Details.Modeler.Actions.JiraCloud.GetProjectWorklogs.EndDate'),
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
                                                title: translate('Process.Details.Modeler.Actions.JiraCloud.GetProjectWorklogs.DatesList'),
                                                type: 'string',
                                            },
                                        },
                                        required: ['dates']
                                    }],
                                },
                            },
                            required: ['originEnv', 'usernameEnv', 'passwordEnv', 'project']
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
                                info: translate('Process.Details.Modeler.Actions.JiraCloud.GetProjectWorklogs.Output.Info'),
                            }
                        },
                    }
                },
                formData: {},
            },
        },
        [JiraCloudAction.GET_PROJECT_SPRINTS]: {
            id: JiraCloudAction.GET_PROJECT_SPRINTS,
            label: translate('Process.Details.Modeler.Actions.JiraCloud.GetProjectSprints.Label'),
            script: JiraCloudAction.GET_PROJECT_SPRINTS,
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
                                    title: translate('Process.Details.Modeler.Actions.JiraCloud.GetProjectSprints.Origin'),
                                    type: 'string',
                                },
                                usernameEnv: {
                                    title: translate('Process.Details.Modeler.Actions.JiraCloud.GetProjectSprints.Username'),
                                    type: 'string',
                                },
                                passwordEnv: {
                                    title: translate('Process.Details.Modeler.Actions.JiraCloud.GetProjectSprints.Password'),
                                    type: 'string',
                                },
                                project: {
                                    title: translate('Process.Details.Modeler.Actions.JiraCloud.GetProjectSprints.Project'),
                                    type: 'string',
                                },
                                state: {
                                    title: translate('Process.Details.Modeler.Actions.JiraCloud.GetProjectSprints.State'),
                                    type: 'string',
                                    enum: [undefined, JiraSprintState.CLOSED, JiraSprintState.ACTIVE, JiraSprintState.FUTURE],
                                    enumNames: ['None', 'Closed', 'Active', 'Future'],
                                    default: undefined,
                                },
                            },
                            required: ['originEnv', 'usernameEnv', 'passwordEnv', 'project']
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
                                info: translate('Process.Details.Modeler.Actions.JiraCloud.GetProjectSprints.Output.Info'),
                            }
                        },
                    }
                },
                formData: {},
            },
        },
        [JiraCloudAction.GET_SPRINT_TASKS]: {
            id: JiraCloudAction.GET_SPRINT_TASKS,
            label: translate('Process.Details.Modeler.Actions.JiraCloud.GetSprintTasks.Label'),
            script: JiraCloudAction.GET_SPRINT_TASKS,
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
                                    title: translate('Process.Details.Modeler.Actions.JiraCloud.GetSprintTasks.Origin'),
                                    type: 'string',
                                },
                                usernameEnv: {
                                    title: translate('Process.Details.Modeler.Actions.JiraCloud.GetSprintTasks.Username'),
                                    type: 'string',
                                },
                                passwordEnv: {
                                    title: translate('Process.Details.Modeler.Actions.JiraCloud.GetSprintTasks.Password'),
                                    type: 'string',
                                },
                                sprint: {
                                    title: translate('Process.Details.Modeler.Actions.JiraCloud.GetSprintTasks.Sprint'),
                                    type: 'string',
                                },
                                email: {
                                    title: translate('Process.Details.Modeler.Actions.JiraCloud.GetSprintTasks.Email'),
                                    type: 'string',
                                },
                                status: {
                                    title: translate('Process.Details.Modeler.Actions.JiraCloud.GetSprintTasks.Status'),
                                    type: 'string',
                                    enum: [undefined, JiraTaskStatus.TO_DO, JiraTaskStatus.IN_PROGRESS, JiraTaskStatus.DONE],
                                    enumNames: ['None', 'To do', 'In progress', 'Done'],
                                    default: undefined,
                                },
                                mode: {
                                    title: translate('Process.Details.Modeler.Actions.JiraCloud.GetSprintTasks.DateMode'),
                                    type: 'string',
                                    enum: [undefined, dateMode.date.value, dateMode.period.value, dateMode.collection.value],
                                    enumNames: ['None', dateMode.date.title, dateMode.period.title, dateMode.collection.title],
                                    default: undefined,
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
                                                title: translate('Process.Details.Modeler.Actions.JiraCloud.GetSprintTasks.StartDate'),
                                                type: 'string',
                                            },
                                            endDate: {
                                                title: translate('Process.Details.Modeler.Actions.JiraCloud.GetSprintTasks.EndDate'),
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
                                                title: translate('Process.Details.Modeler.Actions.JiraCloud.GetSprintTasks.DatesList'),
                                                type: 'string',
                                            },
                                        },
                                        required: ['dates']
                                    }],
                                },
                            },
                            required: ['originEnv', 'usernameEnv', 'passwordEnv', 'sprint']
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
                                info: translate('Process.Details.Modeler.Actions.JiraCloud.GetSprintTasks.Output.Info'),
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
