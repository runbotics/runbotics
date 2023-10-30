import { StatelessActionHandler } from '@runbotics/runbotics-sdk';

import { Injectable } from '@nestjs/common';
import { externalAxios, ServerConfigService } from '#config';
import * as BeeOfficeTypes from './types';

@Injectable()
export default class BeeOfficeActionHandler extends StatelessActionHandler {
    constructor(
        private readonly serverConfigService: ServerConfigService,
    ) {
        super();
    }

    async getBearerToken() {
        const obj = this.serverConfigService.beeAuth;

        const data = Object.keys(obj)
            .map((key, index) => `${key}=${encodeURIComponent(obj[key])}`)
            .join('&');

        const response = await externalAxios({
            method: 'POST',
            headers: {
                'content-type': 'application/x-www-form-urlencoded',
            },
            data,
            url: `${this.serverConfigService.beeUrl}/Token`,
            maxRedirects: 0,
        });

        return response.data.access_token;
    }

    async getEmployee(
        input: BeeOfficeTypes.BeeOfficeGetEmployeeActionInput
    ): Promise<BeeOfficeTypes.BeeOfficeGetEmployeeActionOutput> {
        const response = await externalAxios.get<BeeOfficeTypes.IBeeOfficeEmployee[]>(
            `${this.serverConfigService.beeUrl}/api/employees/email%3BADD%3Beq%3B${input.email}/1`,
            {
                headers: {
                    Authorization: 'Bearer ' + (await this.getBearerToken()),
                },
                maxRedirects: 0,
            },
        );

        return response.data[0];
    }

    async getEmployeeById(
        input: BeeOfficeTypes.BeeOfficeGetEmployeeByIdActionInput
    ): Promise<BeeOfficeTypes.BeeOfficeGetEmployeeByIdActionOutput> {
        const response = await externalAxios.get<BeeOfficeTypes.IBeeOfficeEmployee[]>(
            `${this.serverConfigService.beeUrl}/api/employees/ID;ADD;eq;${input.id}`,
            {
                headers: {
                    Authorization: 'Bearer ' + (await this.getBearerToken()),
                },
                maxRedirects: 0,
            },
        );

        return response.data[0];
    }

    async getActivity(
        input: BeeOfficeTypes.BeeOfficeGetActivityActionInput
    ): Promise<BeeOfficeTypes.BeeOfficeGetActivityActionOutput> {
        const methods = {
            Equals: 'eq',
            Contains: 'ct',
        };
        const method = input.method ? methods[input.method] : 'ct';
        const response = await externalAxios.get<BeeOfficeTypes.IBeeOfficeActivity[]>(
            `${this.serverConfigService.beeUrl}/api/activity/name%3BADD%3B${method}%3B${input.query}/1`,
            {
                headers: {
                    Authorization: 'Bearer ' + (await this.getBearerToken()),
                },
                maxRedirects: 0,
            },
        );

        return response.data[0];
    }

    async createNewTimetableActivity(
        input: BeeOfficeTypes.BeeOfficeCreateNewTimetableActivityActionInput,
    ): Promise<BeeOfficeTypes.BeeOfficeCreateNewTimetableActivityActionOutput> {
        const result = {};

        // "activity_id": "dc96fe19-5177-44ff-a0d5-ec1747b3a662",
        //     "activitygroup_id": "e79d2141-2a75-48f6-b640-56ec82219d43",

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

        const response = await externalAxios.post(`${this.serverConfigService.beeUrl}/api/timetableactivity`, requestBody, {
            headers: {
                Authorization: 'Bearer ' + (await this.getBearerToken()),
            },
            maxRedirects: 0,
        });

        return response.data;
    }

    async getSchedule(
        input: BeeOfficeTypes.BeeOfficeGetScheduleActionInput
    ): Promise<BeeOfficeTypes.BeeOfficeGetScheduleActionOutput> {
        const limit = input.limit ? input.limit : 100;
        const response = await externalAxios.get<BeeOfficeTypes.IBeeOfficeActivity[]>(
            `${this.serverConfigService.beeUrl}/api/timetableactivity/employee_id%3BADD%3Beq%3B${input.employee.ID}%7Ctimetabledate%3BADD%3Beq%3B${input.date}/${limit}`,
            {
                headers: {
                    Authorization: 'Bearer ' + (await this.getBearerToken()),
                },
                maxRedirects: 0,
            },
        );

        return response.data;
    }

    async deleteTimeTableActivity(
        input: BeeOfficeTypes.BeeOfficeDeleteTimeTableActionInput,
    ): Promise<BeeOfficeTypes.BeeOfficeDeleteTimeTableActionOutput> {
        const response = await externalAxios.delete<any>(
            `${this.serverConfigService.beeUrl}/api/timetableactivity/${input.timeTableActivity.ID}`,
            {
                headers: {
                    Authorization: 'Bearer ' + (await this.getBearerToken()),
                },
                maxRedirects: 0,
            },
        );

        return response.data;
    }

    async getActivityGroups(
        input: BeeOfficeTypes.BeeOfficeGetActivityGroupsActionInput,
    ): Promise<BeeOfficeTypes.BeeOfficeGetActivityGroupsActionOutput> {
        const response = await externalAxios.get<BeeOfficeTypes.IBeeOfficeActivity[]>(
            `${this.serverConfigService.beeUrl}/api/activitygroup/name;ADD;eq;${input.group}`,
            {
                headers: {
                    Authorization: 'Bearer ' + (await this.getBearerToken()),
                },
                maxRedirects: 0,
            },
        );

        return response.data;
    }

    async getActivitiesByURLParameters(
        input: BeeOfficeTypes.BeeOfficeGetActivitiesByURLParametersActionInput,
    ): Promise<BeeOfficeTypes.BeeOfficeGetActivitiesByURLParametersActionOutput> {
        const response = await externalAxios.get<BeeOfficeTypes.IBeeOfficeActivity[]>(
            `${this.serverConfigService.beeUrl}/api/activity/${input.query}`,
            {
                headers: {
                    Authorization: 'Bearer ' + (await this.getBearerToken()),
                },
                maxRedirects: 0,
            },
        );

        return response.data;
    }

    run(request: BeeOfficeTypes.BeeOfficeActionRequest) {
        switch (request.script) {
            case 'beeOffice.createNewTimetableActivity':
                return this.createNewTimetableActivity(request.input);
            case 'beeOffice.getEmployee':
                return this.getEmployee(request.input);
            case 'beeOffice.getEmployeeById':
                return this.getEmployeeById(request.input);
            case 'beeOffice.getActivity':
                return this.getActivity(request.input);
            case 'beeOffice.getActivitiesByURLParameters':
                return this.getActivitiesByURLParameters(request.input);
            case 'beeOffice.getSchedule':
                return this.getSchedule(request.input);
            case 'beeOffice.deleteTimeTableActivity':
                return this.deleteTimeTableActivity(request.input);
            case 'beeOffice.getActivityGroups':
                return this.getActivityGroups(request.input);
            default:
                throw new Error('Action not found');
        }
    }
}
