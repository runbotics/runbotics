import { BeeOfficeAction, ActionRegex, ActionCredentialType } from 'runbotics-common';

import { translate } from '#src-app/hooks/useTranslations';

import { propertyCustomCredential, schemaCustomCredential } from './actions.utils';
import { IBpmnAction, Runner } from './types';

// eslint-disable-next-line max-lines-per-function
const getBeeOfficeActions: () => Record<string, IBpmnAction> = () => ({
    'beeOffice.createNewTimetableActivity': {
        id: BeeOfficeAction.CREATE_NEW_TIMETABLE_ACTIVITY,
        credentialType: ActionCredentialType.BEE_OFFICE,
        label: translate('Process.Details.Modeler.Actions.BeeOffice.CreateNewTimetableActivity.Label'),
        script: BeeOfficeAction.CREATE_NEW_TIMETABLE_ACTIVITY,
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
                            employee: {
                                title: translate('Process.Details.Modeler.Actions.BeeOffice.Create.Variables.Employee'),
                                type: 'string',
                            },
                            activity: {
                                title: translate('Process.Details.Modeler.Actions.BeeOffice.Create.Variables.Activity'),
                                type: 'string',
                            },
                            category: {
                                title: translate('Process.Details.Modeler.Actions.BeeOffice.Create.Variables.Category'),
                                type: 'string',
                            },
                            specialization: {
                                title: translate(
                                    'Process.Details.Modeler.Actions.BeeOffice.Create.Variables.Specialization'
                                ),
                                type: 'string',
                            },
                            localization: {
                                title: translate(
                                    'Process.Details.Modeler.Actions.BeeOffice.Create.Variables.Localization'
                                ),
                                type: 'string',
                            },
                            date: {
                                title: translate('Process.Details.Modeler.Actions.BeeOffice.Create.Variables.Date'),
                                type: 'string',
                            },
                            duration: {
                                title: translate('Process.Details.Modeler.Actions.BeeOffice.Create.Variables.Duration'),
                                type: 'string',
                            },
                            description: {
                                title: translate('Process.Details.Modeler.Actions.BeeOffice.Create.Variables.Text'),
                                type: 'string',
                            },
                            customCredentialId: propertyCustomCredential,
                        },
                        required: ['employee', 'activity', 'date', 'duration'],
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
                        required: ['variableName'],
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
                            info: translate('Process.Details.Modeler.Actions.Common.VariableName.Info'),
                        },
                    },
                },
            },
            formData: {
                input: {
                    employee: undefined,
                    activity: undefined,
                    category: '',
                    specialization: '',
                    localization: '',
                    date: undefined,
                    duration: undefined,
                    description: '',
                },
                output: {
                    variableName: undefined,
                },
            },
        },
    },
    'beeOffice.getEmployee': {
        id: BeeOfficeAction.GET_EMPLOYEE,
        credentialType: ActionCredentialType.BEE_OFFICE,
        label: translate('Process.Details.Modeler.Actions.BeeOffice.GetEmployee.Label'),
        script: BeeOfficeAction.GET_EMPLOYEE,
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
                                title: translate('Process.Details.Modeler.Actions.BeeOffice.GetEmployeeByEmail.Email'),
                                type: 'string',
                            },
                            customCredentialId: propertyCustomCredential,
                        },
                        required: ['email'],
                    },
                    output: {
                        title: translate('Process.Details.Modeler.Actions.Common.Output'),
                        type: 'object',
                        properties: {
                            variableName: {
                                title: translate(
                                    'Process.Details.Modeler.Actions.Common.VariableName',
                                ),
                                type: 'string',
                                pattern: ActionRegex.VARIABLE_NAME,
                            },
                        },
                        required: ['variableName'],
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
    'beeOffice.getEmployeeById': {
        id: BeeOfficeAction.GET_EMPLOYEE_BY_ID,
        credentialType: ActionCredentialType.BEE_OFFICE,
        label: translate('Process.Details.Modeler.Actions.BeeOffice.GetEmployeeById.Label'),
        script: BeeOfficeAction.GET_EMPLOYEE_BY_ID,
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
                            id: {
                                title: translate('Process.Details.Modeler.Actions.BeeOffice.GetEmployeeById.Id'),
                                type: 'string',
                            },
                            customCredentialId: propertyCustomCredential,
                        },
                        required: ['id'],
                    },
                    output: {
                        title: translate('Process.Details.Modeler.Actions.Common.Output'),
                        type: 'object',
                        properties: {
                            variableName: {
                                title: translate('Process.Details.Modeler.Actions.Common.VariableName'),
                                description: translate(
                                    'Process.Details.Modeler.Actions.Common.VariableName',
                                ),
                                type: 'string',
                                pattern: ActionRegex.VARIABLE_NAME,
                            },
                        },
                        required: ['variableName'],
                    },
                },
            },
            uiSchema: {
                'ui:order': ['input', 'output'],
                input: {
                    customCredentialId: schemaCustomCredential,
                },
            },
            formData: {
                input: {
                    id: undefined,
                },
                output: {
                    variableName: undefined,
                },
            },
        },
    },
    'beeOffice.getActivity': {
        id: BeeOfficeAction.GET_ACTIVITY,
        credentialType: ActionCredentialType.BEE_OFFICE,
        label: translate('Process.Details.Modeler.Actions.BeeOffice.GetActivity.Label'),
        script: BeeOfficeAction.GET_ACTIVITY,
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
                            query: {
                                title: translate('Process.Details.Modeler.Actions.BeeOffice.GetActivity.Name'),
                                type: 'string',
                            },
                            method: {
                                title: translate('Process.Details.Modeler.Actions.BeeOffice.GetActivity.Method'),
                                type: 'string',
                                enum: ['Contains', 'Equals'],
                                default: 'Contains',
                            },
                            customCredentialId: propertyCustomCredential,
                        },
                        required: ['query'],
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
                        required: ['variableName'],
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
                            info: translate('Process.Details.Modeler.Actions.Common.VariableName.Info'),
                        },
                    },
                },
            },
            formData: {
                input: {
                    query: undefined,
                    method: 'Contains',
                },
                output: {
                    variableName: undefined,
                },
            },
        },
    },
    'beeOffice.getSchedule': {
        id: BeeOfficeAction.GET_SCHEDULE,
        credentialType: ActionCredentialType.BEE_OFFICE,
        label: translate('Process.Details.Modeler.Actions.BeeOffice.GetSchedule.Label'),
        script: BeeOfficeAction.GET_SCHEDULE,
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
                            employee: {
                                title: translate(
                                    'Process.Details.Modeler.Actions.BeeOffice.GetTimeTable.VariableEmployee',
                                ),
                                type: 'string',
                            },
                            date: {
                                title: translate('Process.Details.Modeler.Actions.BeeOffice.GetTimeTable.Date'),
                                type: 'string',
                            },
                            customCredentialId: propertyCustomCredential,
                        },
                        required: ['employee', 'date'],
                    },
                    output: {
                        title: translate('Process.Details.Modeler.Actions.Common.Output'),
                        type: 'object',
                        properties: {
                            variableName: {
                                title: translate(
                                    'Process.Details.Modeler.Actions.Common.VariableName',
                                ),
                                type: 'string',
                                pattern: ActionRegex.VARIABLE_NAME,
                            },
                        },
                        required: ['variableName'],
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
                            info: translate('Process.Details.Modeler.Actions.Common.VariableName.Info'),
                        },
                    },
                },
            },
            formData: {
                input: {
                    employee: undefined,
                    date: undefined,
                },
                output: {
                    variableName: undefined,
                },
            },
        },
    },
    'beeOffice.deleteTimeTableActivity': {
        id: BeeOfficeAction.DELETE_TIMETABLE_ACTIVITY,
        credentialType: ActionCredentialType.BEE_OFFICE,
        label: translate('Process.Details.Modeler.Actions.BeeOffice.DeleteTimeTableActivity.Label'),
        script: BeeOfficeAction.DELETE_TIMETABLE_ACTIVITY,
        runner: Runner.DESKTOP_SCRIPT,
        form: {
            schema: {
                type: 'object',
                properties: {
                    input: {
                        title: translate('Process.Details.Modeler.Actions.Common.Input'),
                        type: 'object',
                        properties: {
                            timeTableActivity: {
                                title: translate(
                                    'Process.Details.Modeler.Actions.BeeOffice.DeleteTimeTable.TimeTableActivity',
                                ),
                                type: 'string',
                            },
                            customCredentialId: propertyCustomCredential,
                        },
                        required: ['timeTableActivity'],
                    },
                },
            },
            uiSchema: {
                'ui:order': ['input'],
                input: {
                    customCredentialId: schemaCustomCredential,
                },
            },
            formData: {
                input: {
                    timeTableActivity: undefined,
                },
            },
        },
    },
    'beeOffice.getActivityGroups': {
        id: BeeOfficeAction.GET_ACTIVITY_GROUPS,
        credentialType: ActionCredentialType.BEE_OFFICE,
        label: translate('Process.Details.Modeler.Actions.BeeOffice.GetActivityGroups.Label'),
        script: BeeOfficeAction.GET_ACTIVITY_GROUPS,
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
                            group: {
                                title: translate('Process.Details.Modeler.Actions.BeeOffice.GetActivityGroups.Group'),
                                type: 'string',
                            },
                            customCredentialId: propertyCustomCredential,
                        },
                        required: ['group'],
                    },
                    output: {
                        title: translate('Process.Details.Modeler.Actions.Common.Output'),
                        type: 'object',
                        properties: {
                            variableName: {
                                title: translate(
                                    'Process.Details.Modeler.Actions.Common.VariableName',
                                ),
                                type: 'string',
                                pattern: ActionRegex.VARIABLE_NAME,
                            },
                        },
                        required: ['variableName'],
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
                            info: translate('Process.Details.Modeler.Actions.Common.VariableName.Info'),
                        },
                    },
                },
            },
            formData: {
                input: {
                    group: undefined,
                },
                output: {
                    variableName: undefined,
                },
            },
        },
    },
    'beeOffice.getActivitiesByURLParameters': {
        id: BeeOfficeAction.GET_ACTIVITIES_BY_URL_PARAMETERS,
        credentialType: ActionCredentialType.BEE_OFFICE,
        label: translate('Process.Details.Modeler.Actions.BeeOffice.GetActivitiesByURLParameters.Label'),
        script: BeeOfficeAction.GET_ACTIVITIES_BY_URL_PARAMETERS,
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
                            'Process.Details.Modeler.Actions.Common.Input',
                        ),
                        type: 'object',
                        properties: {
                            query: {
                                title: translate(
                                    'Process.Details.Modeler.Actions.BeeOffice.GetActivitiesByUrl.UrlParameters',
                                ),
                                type: 'string',
                            },
                            customCredentialId: propertyCustomCredential,
                        },
                        required: ['query'],
                    },
                    output: {
                        title: translate('Process.Details.Modeler.Actions.Common.Output'),
                        type: 'object',
                        properties: {
                            variableName: {
                                title: translate(
                                    'Process.Details.Modeler.Actions.Common.VariableName',
                                ),
                                description: translate(
                                    'Process.Details.Modeler.Actions.Common.VariableName',
                                ),
                                type: 'string',
                                pattern: ActionRegex.VARIABLE_NAME,
                            },
                        },
                        required: ['variableName'],
                    },
                },
            },
            uiSchema: {
                'ui:order': ['input', 'output'],
                input: {
                    customCredentialId: schemaCustomCredential,
                },
            },
            formData: {
                input: {
                    query: undefined,
                },
                output: {
                    variableName: undefined,
                },
            },
        },
    },
    'beeOffice.createHolidayLeave': {
        id: BeeOfficeAction.CREATE_HOLIDAY_LEAVE,
        credentialType: ActionCredentialType.BEE_OFFICE,
        label: translate('Process.Details.Modeler.Actions.BeeOffice.CreateHolidayLeave.Label'),
        script: BeeOfficeAction.CREATE_HOLIDAY_LEAVE,
        runner: Runner.DESKTOP_SCRIPT,
        form: {
            schema: {
                type: 'object',
                properties: {
                    input: {
                        type: 'object',
                        title: translate('Process.Details.Modeler.Actions.Common.Input'),
                        properties: {
                            employeeId: {
                                title: translate('Process.Details.Modeler.Actions.BeeOffice.CreateHolidayLeave.EmployeeId'),
                                type: 'string'
                            },
                            leaveConfigName: {
                                title: translate('Process.Details.Modeler.Actions.BeeOffice.CreateHolidayLeave.LeaveConfig'),
                                type: 'string'
                            },
                            dateFrom: {
                                title: translate('Process.Details.Modeler.Actions.BeeOffice.CreateHolidayLeave.DateFrom'),
                                type: 'string',
                                pattern: ActionRegex.DATE_FORMAT
                            },
                            dateTo: {
                                title: translate('Process.Details.Modeler.Actions.BeeOffice.CreateHolidayLeave.DateTo'),
                                type: 'string',
                                pattern: ActionRegex.DATE_FORMAT
                            },
                            description: {
                                title: translate('Process.Details.Modeler.Actions.BeeOffice.CreateHolidayLeave.Description'),
                                type: 'string'
                            },
                            isAdditional: {
                                title: translate('Process.Details.Modeler.Actions.BeeOffice.CreateHolidayLeave.AdditionalData'),
                                type: 'boolean'
                            },
                        },
                        if: {
                            properties: {
                                isAdditional: {
                                    const: true
                                }
                            }
                        },
                        then: {
                            properties: {
                                additionalProperties: {
                                    title: 'Object',
                                    type: 'string'
                                }
                            }
                        },
                        customCredentialId: propertyCustomCredential,
                        required: ['employeeId', 'leaveConfigName', 'dateFrom', 'dateTo']
                    },
                },
            },
            uiSchema: {
                'ui:order': ['input'],
                input: {
                    customCredentialId: schemaCustomCredential,
                    leaveConfigName: {
                        'ui:options': {
                            info: translate('Process.Details.Modeler.Actions.BeeOffice.CreateHolidayLeave.LeaveConfig.Tooltip')
                        }
                    },
                    dateFrom: {
                        'ui:options': {
                            info: translate('Process.Details.Modeler.Actions.Common.DateFormat')
                        }
                    },
                    dateTo: {
                        'ui:options': {
                            info: translate('Process.Details.Modeler.Actions.Common.DateFormat')
                        }
                    },
                    additionalProperties: {
                        'ui:widget': 'EditorWidget',
                        'ui:options': { language: 'json' }
                    }
                },
            },
            formData: {
                input: {
                    employeeId: undefined,
                    leaveConfigName: undefined,
                    dateFrom: undefined,
                    dateTo: undefined,
                    description: undefined,
                    isAdditional: false,
                    additionalProperties: undefined
                },
            },
        },
    },
});

export default getBeeOfficeActions;
