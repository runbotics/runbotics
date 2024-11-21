import { StatelessActionHandler } from '@runbotics/runbotics-sdk';
import { ActionRegex } from 'runbotics-common';
import { Injectable } from '@nestjs/common';
import { externalAxios, ServerConfigService } from '#config';
import {
    BeeOfficeActionRequest,
    BeeOfficeAuth,
    BeeOfficeCreateHolidayLeaveActionInput,
    BeeOfficeCreateHolidayLeaveActionOutput,
    BeeOfficeCreateNewTimetableActivityActionInput,
    BeeOfficeCreateNewTimetableActivityActionOutput,
    BeeOfficeCredential,
    BeeOfficeDeleteTimeTableActionInput,
    BeeOfficeDeleteTimeTableActionOutput,
    BeeOfficeGetActivitiesByURLParametersActionInput,
    BeeOfficeGetActivitiesByURLParametersActionOutput,
    BeeOfficeGetActivityActionInput,
    BeeOfficeGetActivityActionOutput,
    BeeOfficeGetActivityGroupsActionInput,
    BeeOfficeGetActivityGroupsActionOutput,
    BeeOfficeGetEmployeeActionInput,
    BeeOfficeGetEmployeeActionOutput,
    BeeOfficeGetEmployeeByIdActionInput,
    BeeOfficeGetEmployeeByIdActionOutput,
    BeeOfficeGetScheduleActionInput,
    BeeOfficeGetScheduleActionOutput,
    IBeeOfficeActivity,
    IBeeOfficeEmployee
} from './bee-office.types';
import { credentialAttributesMapper } from '#utils/credentialAttributesMapper';

@Injectable()
export default class BeeOfficeActionHandler extends StatelessActionHandler {
    constructor(
        private readonly serverConfigService: ServerConfigService,
    ) {
        super();
    }

    async getBearerToken({ url, ...authData }: BeeOfficeCredential) {
        const auth: BeeOfficeAuth = {
            ...authData,
            grant_type: 'password',
        };

        const data = Object.keys(auth)
            .map((key) => `${key}=${encodeURIComponent(auth[key])}`)
            .join('&');

        const response = await externalAxios({
            method: 'POST',
            headers: {
                'content-type': 'application/x-www-form-urlencoded',
            },
            data,
            url: `${url}/Token`,
            maxRedirects: 0,
        });

        return response.data.access_token;
    }

    async getEmployee(
        input: BeeOfficeGetEmployeeActionInput,
        credential: BeeOfficeCredential,
    ): Promise<BeeOfficeGetEmployeeActionOutput> {
        const response = await externalAxios.get<IBeeOfficeEmployee[]>(
            `${credential.url}/api/employees/email%3BADD%3Beq%3B${input.email}/1`,
            {
                headers: {
                    Authorization: 'Bearer ' + (await this.getBearerToken(credential)),
                },
                maxRedirects: 0,
            },
        );

        return response.data[0];
    }

    async getEmployeeById(
        input: BeeOfficeGetEmployeeByIdActionInput,
        credential: BeeOfficeCredential,
    ): Promise<BeeOfficeGetEmployeeByIdActionOutput> {
        const response = await externalAxios.get<IBeeOfficeEmployee[]>(
            `${credential.url}/api/employees/ID;ADD;eq;${input.id}`,
            {
                headers: {
                    Authorization: 'Bearer ' + (await this.getBearerToken(credential)),
                },
                maxRedirects: 0,
            },
        );

        return response.data[0];
    }

    async getActivity(
        input: BeeOfficeGetActivityActionInput,
        credential: BeeOfficeCredential,
    ): Promise<BeeOfficeGetActivityActionOutput> {
        const methods = {
            Equals: 'eq',
            Contains: 'ct',
        };
        const method = input.method ? methods[input.method] : 'ct';
        const response = await externalAxios.get<IBeeOfficeActivity[]>(
            `${credential.url}/api/activity/name%3BADD%3B${method}%3B${input.query}/1`,
            {
                headers: {
                    Authorization: 'Bearer ' + (await this.getBearerToken(credential)),
                },
                maxRedirects: 0,
            },
        );

        return response.data[0];
    }

    async createNewTimetableActivity(
        input: BeeOfficeCreateNewTimetableActivityActionInput,
        credential: BeeOfficeCredential,
    ): Promise<BeeOfficeCreateNewTimetableActivityActionOutput> {
        const requestBody = {
            activity_id_mainvalue: '',
            activitygroup_id_mainvalue: '',
            activitygroup_id_abbreviation: '',
            ID: '',
            HasEditRight: true,
            activity_id: input.activity.ID,
            activitygroup_id: input.activity.activitygroup_id,
            approval_status: 1,
            approval_status_name: '',
            approval_status_foreground: null,
            approval_status_background: null,
            attribute1: null,
            attribute2: null,
            attribute3: null,
            attribute4: null,
            cat1_dic: Number(input.specialization),
            cat1_dic_name: null,
            cat2_dic: Number(input.category),
            cat2_dic_name: '',
            cat3_dic: 1,
            cat3_dic_name: '',
            cat4_dic: Number(input.localization),
            cat4_dic_name: null,
            description: input.description,
            duration: Number(input.duration),
            employee_id: `${input.employee.ID}`,
            employee_id_mainvalue: '',
            end_time: null,
            main_activity: true,
            mailSent: false,
            payment_dic: null,
            start_time: null,
            timetabledate: input.date,
            approver_id: '',
            approver_id_mainvalue: '',
            approve_date: '',
            approver2_id: null,
            approver2_id_mainvalue: null,
            approve2_date: null,
            leave_id: null,
            leaveConfig_id: null,
        };

        const response = await externalAxios.post(`${credential.url}/api/timetableactivity`, requestBody, {
            headers: {
                Authorization: 'Bearer ' + (await this.getBearerToken(credential)),
            },
            maxRedirects: 0,
        });

        return response.data;
    }

    async getSchedule(
        input: BeeOfficeGetScheduleActionInput,
        credential: BeeOfficeCredential,
    ): Promise<BeeOfficeGetScheduleActionOutput> {
        const limit = input.limit ? input.limit : 100;
        const response = await externalAxios.get<IBeeOfficeActivity[]>(
            `${credential.url}/api/timetableactivity/employee_id%3BADD%3Beq%3B${input.employee.ID}%7Ctimetabledate%3BADD%3Beq%3B${input.date}/${limit}`,
            {
                headers: {
                    Authorization: 'Bearer ' + (await this.getBearerToken(credential)),
                },
                maxRedirects: 0,
            },
        );

        return response.data;
    }

    async deleteTimeTableActivity(
        input: BeeOfficeDeleteTimeTableActionInput,
        credential: BeeOfficeCredential,
    ): Promise<BeeOfficeDeleteTimeTableActionOutput> {
        const response = await externalAxios.delete<any>(
            `${credential.url}/api/timetableactivity/${input.timeTableActivity.ID}`,
            {
                headers: {
                    Authorization: 'Bearer ' + (await this.getBearerToken(credential)),
                },
                maxRedirects: 0,
            },
        );

        return response.data;
    }

    async getActivityGroups(
        input: BeeOfficeGetActivityGroupsActionInput,
        credential: BeeOfficeCredential,
    ): Promise<BeeOfficeGetActivityGroupsActionOutput> {
        const response = await externalAxios.get<IBeeOfficeActivity[]>(
            `${credential.url}/api/activitygroup/name;ADD;eq;${input.group}`,
            {
                headers: {
                    Authorization: 'Bearer ' + (await this.getBearerToken(credential)),
                },
                maxRedirects: 0,
            },
        );

        return response.data;
    }

    async getActivitiesByURLParameters(
        input: BeeOfficeGetActivitiesByURLParametersActionInput,
        credential: BeeOfficeCredential,
    ): Promise<BeeOfficeGetActivitiesByURLParametersActionOutput> {
        const response = await externalAxios.get<IBeeOfficeActivity[]>(
            `${credential.url}/api/activity/${input.query}`,
            {
                headers: {
                    Authorization: 'Bearer ' + (await this.getBearerToken(credential)),
                },
                maxRedirects: 0,
            },
        );

        return response.data;
    }

    async createHolidayLeave(
        input: BeeOfficeCreateHolidayLeaveActionInput,
        credential: BeeOfficeCredential,
    ): Promise<BeeOfficeCreateHolidayLeaveActionOutput> {

        const dateRegex = new RegExp(ActionRegex.DATE_FORMAT);
        if (!dateRegex.test(input.dateFrom) || !dateRegex.test(input.dateTo)) {
            throw new Error('Date format not correct');
        }

        const matchedLeaveConfig = await externalAxios.get(
            `${credential.url}/api/leaveconfig`, {
                headers: {
                    Authorization: 'Bearer ' + (await this.getBearerToken(credential)),
                },
                maxRedirects: 0,
            }).then(response => response.data.find(config => config.name === input.leaveConfigName));
        if (!matchedLeaveConfig) {
            throw new Error('Cannot find leave config with specific name');
        }

        const requestBody = {
            employee_id: input.employeeId,
            leaveconfig_id: matchedLeaveConfig.ID,
            fromdate: input.dateFrom,
            todate: input.dateTo,
            ...(input?.description && { descr_schedule: input.description }),
            ...(input.isAdditional && this.parseAdditionalProperties(input.additionalProperties))
        };

        const response = await externalAxios.post(
            `${credential.url}/api/leaves`,
            requestBody, {
                headers: {
                    Authorization: 'Bearer ' + (await this.getBearerToken(credential)),
                },
                maxRedirects: 0,
            })
            .then(res => res.data)
            .catch(err => {
                throw new Error(err.response.data);
            });

        return response;
    }

    private parseAdditionalProperties(inputObject: string) {
        try {
            return JSON.parse(inputObject);
        } catch {
            throw new Error('Cannot parse additional object');
        }
    }

    private verifyHasRequiredCredentials(credentials: BeeOfficeCredential) {
        const missing = Object.entries(credentials).filter(([_, value]) => !value.trim()).map(([key]) => key);
        if (missing.length) return;
        throw new Error(`Some credential attributes are not specified. Missing: ${missing.join(',')}`);
    }

    run(request: BeeOfficeActionRequest) {
        const credential = credentialAttributesMapper<BeeOfficeCredential>(request.credentials);

        switch (request.script) {
            case 'beeOffice.createNewTimetableActivity':
                return this.createNewTimetableActivity(request.input, credential);
            case 'beeOffice.getEmployee':
                return this.getEmployee(request.input, credential);
            case 'beeOffice.getEmployeeById':
                return this.getEmployeeById(request.input, credential);
            case 'beeOffice.getActivity':
                return this.getActivity(request.input, credential);
            case 'beeOffice.getActivitiesByURLParameters':
                return this.getActivitiesByURLParameters(request.input, credential);
            case 'beeOffice.getSchedule':
                return this.getSchedule(request.input, credential);
            case 'beeOffice.deleteTimeTableActivity':
                return this.deleteTimeTableActivity(request.input, credential);
            case 'beeOffice.getActivityGroups':
                return this.getActivityGroups(request.input, credential);
            case 'beeOffice.createHolidayLeave':
                return this.createHolidayLeave(request.input, credential);
            default:
                throw new Error('Action not found');
        }
    }
}
