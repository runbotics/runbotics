import { translate } from 'src/hooks/useTranslations';
import { IBpmnAction, Runner } from './types';

const getBeeOfficeActions: () => Record<string, IBpmnAction> = () => ({
    'beeOffice.createNewTimetableActivity': {
        id: 'beeOffice.createNewTimetableActivity',
        label: translate('Process.Details.Modeler.Actions.BeeOffice.CreateNewTimetableActivity.Label'),
        script: 'beeOffice.createNewTimetableActivity',
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
                        title: translate('Process.Details.Modeler.Actions.BeeOffice.Create.Input'),
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
                        },
                        required: ['employee', 'activity', 'date', 'duration'],
                    },
                    output: {
                        title: translate('Process.Details.Modeler.Actions.BeeOffice.Create.Output'),
                        type: 'object',
                        properties: {
                            variableName: {
                                title: translate('Process.Details.Modeler.Actions.BeeOffice.Create.VariableName'),
                                description: translate('Process.Details.Modeler.Actions.BeeOffice.Create.VariableText'),
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
                    employee: '',
                    activity: '',
                    category: '',
                    specialization: '',
                    localization: '',
                    date: '',
                    duration: '',
                    description: '',
                },
                output: {
                    variableName: '',
                },
            },
        },
    },
    'beeOffice.getEmployee': {
        id: 'beeOffice.getEmployee',
        label: translate('Process.Details.Modeler.Actions.BeeOffice.GetEmployee.Label'),
        script: 'beeOffice.getEmployee',
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
                        title: translate('Process.Details.Modeler.Actions.BeeOffice.GetEmployeeByEmail.Input'),
                        type: 'object',
                        properties: {
                            email: {
                                title: translate('Process.Details.Modeler.Actions.BeeOffice.GetEmployeeByEmail.Email'),
                                type: 'string',
                            },
                        },
                        required: ['email'],
                    },
                    output: {
                        title: translate('Process.Details.Modeler.Actions.BeeOffice.GetEmployeeByEmail.Output'),
                        type: 'object',
                        properties: {
                            variableName: {
                                title: translate(
                                    'Process.Details.Modeler.Actions.BeeOffice.GetEmployeeByEmail.Variable',
                                ),
                                description: translate(
                                    'Process.Details.Modeler.Actions.BeeOffice.GetEmployeeByEmail.VariableText',
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
    'beeOffice.getEmployeeById': {
        id: 'beeOffice.getEmployeeById',
        label: translate('Process.Details.Modeler.Actions.BeeOffice.GetEmployeeById.Label'),
        script: 'beeOffice.getEmployeeById',
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
                        title: translate('Process.Details.Modeler.Actions.BeeOffice.GetEmployeeById.Input'),
                        type: 'object',
                        properties: {
                            id: {
                                title: translate('Process.Details.Modeler.Actions.BeeOffice.GetEmployeeById.Id'),
                                type: 'string',
                            },
                        },
                        required: ['id'],
                    },
                    output: {
                        title: translate('Process.Details.Modeler.Actions.BeeOffice.GetEmployeeById.Output'),
                        type: 'object',
                        properties: {
                            variableName: {
                                title: translate('Process.Details.Modeler.Actions.BeeOffice.GetEmployeeById.Variable'),
                                description: translate(
                                    'Process.Details.Modeler.Actions.BeeOffice.GetEmployeeById.VariableText',
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
                    id: '',
                },
                output: {
                    variableName: '',
                },
            },
        },
    },
    'beeOffice.getActivity': {
        id: 'beeOffice.getActivity',
        label: translate('Process.Details.Modeler.Actions.BeeOffice.GetActivity.Label'),
        script: 'beeOffice.getActivity',
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
                        title: translate('Process.Details.Modeler.Actions.BeeOffice.GetActivity.Input'),
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
                        },
                        required: ['query'],
                    },
                    output: {
                        title: translate('Process.Details.Modeler.Actions.BeeOffice.GetActivity.Output'),
                        type: 'object',
                        properties: {
                            variableName: {
                                title: translate('Process.Details.Modeler.Actions.BeeOffice.GetActivity.Variable'),
                                description: translate(
                                    'Process.Details.Modeler.Actions.BeeOffice.GetActivity.VariableText',
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
                    query: '',
                    method: 'Contains',
                },
                output: {
                    variableName: '',
                },
            },
        },
    },
    'beeOffice.getSchedule': {
        id: 'beeOffice.getSchedule',
        label: translate('Process.Details.Modeler.Actions.BeeOffice.GetSchedule.Label'),
        script: 'beeOffice.getSchedule',
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
                        title: translate('Process.Details.Modeler.Actions.BeeOffice.GetTimeTable.Input'),
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
                        },
                        required: ['employee', 'date'],
                    },
                    output: {
                        title: translate('Process.Details.Modeler.Actions.BeeOffice.GetTimeTable.Output'),
                        type: 'object',
                        properties: {
                            variableName: {
                                title: translate(
                                    'Process.Details.Modeler.Actions.BeeOffice.GetTimeTable.Output.Variable',
                                ),
                                description: translate(
                                    'Process.Details.Modeler.Actions.BeeOffice.GetTimeTable.Output.VariableText',
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
                    employee: '',
                    date: '',
                },
                output: {
                    variableName: '',
                },
            },
        },
    },
    'beeOffice.deleteTimeTableActivity': {
        id: 'beeOffice.deleteTimeTableActivity',
        label: translate('Process.Details.Modeler.Actions.BeeOffice.DeleteTimeTableActivity.Label'),
        script: 'beeOffice.deleteTimeTableActivity',
        runner: Runner.DESKTOP_SCRIPT,
        form: {
            schema: {
                type: 'object',
                properties: {
                    input: {
                        title: translate('Process.Details.Modeler.Actions.BeeOffice.DeleteTimeTable.Input'),
                        type: 'object',
                        properties: {
                            timeTableActivity: {
                                title: translate(
                                    'Process.Details.Modeler.Actions.BeeOffice.DeleteTimeTable.TimeTableActivity',
                                ),
                                type: 'string',
                            },
                        },
                        required: ['timeTableActivity'],
                    },
                },
            },
            uiSchema: {
                'ui:order': ['input'],
            },
            formData: {
                input: {
                    timeTableActivity: '',
                },
            },
        },
    },
    'beeOffice.getActivityGroups': {
        id: 'beeOffice.getActivityGroups',
        label: translate('Process.Details.Modeler.Actions.BeeOffice.GetActivityGroups.Label'),
        script: 'beeOffice.getActivityGroups',
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
                        title: translate('Process.Details.Modeler.Actions.BeeOffice.GetActivityGroups.Input'),
                        type: 'object',
                        properties: {
                            group: {
                                title: translate('Process.Details.Modeler.Actions.BeeOffice.GetActivityGroups.Group'),
                                type: 'string',
                            },
                        },
                        required: ['group'],
                    },
                    output: {
                        title: translate('Process.Details.Modeler.Actions.BeeOffice.GetActivityGroups.Output'),
                        type: 'object',
                        properties: {
                            variableName: {
                                title: translate(
                                    'Process.Details.Modeler.Actions.BeeOffice.GetActivityGroups.Variable',
                                ),
                                description: translate(
                                    'Process.Details.Modeler.Actions.BeeOffice.GetActivityGroups.VariableText',
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
                    group: '',
                },
                output: {
                    variableName: '',
                },
            },
        },
    },
    'beeOffice.getActivitiesByURLParameters': {
        id: 'beeOffice.getActivitiesByURLParameters',
        label: translate('Process.Details.Modeler.Actions.BeeOffice.GetActivitiesByURLParameters.Label'),
        script: 'beeOffice.getActivitiesByURLParameters',
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
                            'Process.Details.Modeler.Actions.BeeOffice.GetActivitiesByUrl.Input',
                        ),
                        type: 'object',
                        properties: {
                            query: {
                                title: translate(
                                    'Process.Details.Modeler.Actions.BeeOffice.GetActivitiesByUrl.UrlParameters',
                                ),
                                type: 'string',
                            },
                        },
                        required: ['query'],
                    },
                    output: {
                        title: translate('Process.Details.Modeler.Actions.BeeOffice.GetActivitiesByUrl.Output'),
                        type: 'object',
                        properties: {
                            variableName: {
                                title: translate(
                                    'Process.Details.Modeler.Actions.BeeOffice.GetActivitiesByUrl.Variable',
                                ),
                                description: translate(
                                    'Process.Details.Modeler.Actions.BeeOffice.GetActivitiesByUrl.VariableText',
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
                    query: '',
                },
                output: {
                    variableName: '',
                },
            },
        },
    },
})

export default getBeeOfficeActions;
