/* eslint-disable max-lines-per-function */
import { JiraCloudAction, ActionRegex, JiraTaskStatus, JiraSprintState, ActionCredentialType } from 'runbotics-common';

import { translate } from '#src-app/hooks/useTranslations';

import { propertyCustomCredential, schemaCustomCredential } from './actions.utils';
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
                                            customCredentialId: propertyCustomCredential,
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
                                            customCredentialId: propertyCustomCredential,
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
                                            customCredentialId: propertyCustomCredential,
                                        },
                                        required: ['dates']
                                    }],
                                },
                            },
                            required: ['email']
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
                    input: {
                        customCredentialId: schemaCustomCredential,
                    },
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
            credentialType: ActionCredentialType.ATLASSIAN,
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
                                            customCredentialId: propertyCustomCredential,
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
                                            customCredentialId: propertyCustomCredential,
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
                                            customCredentialId: propertyCustomCredential,
                                        },
                                        required: ['dates']
                                    }],
                                },
                            },
                            required: ['project']
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
                    input: {
                        customCredentialId: schemaCustomCredential,
                    },
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
        [JiraCloudAction.GET_BOARD_SPRINTS]: {
            id: JiraCloudAction.GET_BOARD_SPRINTS,
            credentialType: ActionCredentialType.ATLASSIAN,
            label: translate('Process.Details.Modeler.Actions.JiraCloud.GetBoardSprints.Label'),
            script: JiraCloudAction.GET_BOARD_SPRINTS,
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
                                boardId: {
                                    title: translate('Process.Details.Modeler.Actions.JiraCloud.GetBoardSprints.Board'),
                                    type: 'string',
                                },
                                state: {
                                    title: translate('Process.Details.Modeler.Actions.JiraCloud.GetBoardSprints.State'),
                                    type: 'string',
                                    enum: [undefined, JiraSprintState.CLOSED, JiraSprintState.ACTIVE, JiraSprintState.FUTURE],
                                    enumNames: ['None', 'Closed', 'Active', 'Future'],
                                    default: undefined,
                                },
                                customCredentialId: propertyCustomCredential,
                            },
                            required: ['boardId']
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
                    input: {
                        customCredentialId: schemaCustomCredential,
                    },
                    output: {
                        variableName: {
                            'ui:options': {
                                info: translate('Process.Details.Modeler.Actions.JiraCloud.GetBoardSprints.Output.Info'),
                            }
                        },
                    }
                },
                formData: {},
            },
        },
        [JiraCloudAction.GET_SPRINT_TASKS]: {
            id: JiraCloudAction.GET_SPRINT_TASKS,
            credentialType: ActionCredentialType.ATLASSIAN,
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
                                sprint: {
                                    title: translate('Process.Details.Modeler.Actions.JiraCloud.GetSprintTasks.Sprint'),
                                    type: 'string',
                                },
                                email: {
                                    title: translate('Process.Details.Modeler.Actions.JiraCloud.GetSprintTasks.Email'),
                                    type: 'string',
                                },
                                fields: {
                                    title: translate('Process.Details.Modeler.Actions.JiraCloud.GetSprintTasks.Fields'),
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
                                customCredentialId: propertyCustomCredential,
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
                            required: ['sprint']
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
                    input: {
                        fields: {
                            'ui:options': {
                                info: translate('Process.Details.Modeler.Actions.JiraCloud.GetSprintTasks.Fields.Info'),
                            },
                        },
                        customCredentialId: schemaCustomCredential,
                    },
                    output: {
                        variableName: {
                            'ui:options': {
                                info: translate('Process.Details.Modeler.Actions.JiraCloud.GetSprintTasks.Output.Info'),
                            },
                        },
                    }
                },
                formData: {},
            },
        },
    });
};

export default getJiraCloudActions;
