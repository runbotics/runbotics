import { StatelessActionHandler } from 'runbotics-sdk';
import { DesktopRunRequest } from 'runbotics-sdk';
import { DesktopRunResponse } from 'runbotics-sdk';

import { Injectable } from '@nestjs/common';
import { IBeeOfficeActivity, IBeeOfficeEmployee } from './types';
import { externalAxios } from '../../config/axios-configuration';

// ----
export type BeeOfficeGetActivityGroupsActionInput = {
    group: string;
};
export type BeeOfficeGetActivityGroupsActionOutput = any;

// ----
export type BeeOfficeGetActivitiesByURLParametersActionInput = {
    query: string;
};
export type BeeOfficeGetActivitiesByURLParametersActionOutput = any;

// ----
export type BeeOfficeDeleteTimeTableActionInput = {
    timeTableActivity: IBeeOfficeActivity;
};
export type BeeOfficeDeleteTimeTableActionOutput = any;

// ----
export type BeeOfficeGetScheduleActionInput = {
    employee: IBeeOfficeEmployee;
    date: string;
    limit?: string;
};
export type BeeOfficeGetScheduleActionOutput = any;

// ----
export type BeeOfficeGetEmployeeActionInput = {
    email: string;
};
export type BeeOfficeGetEmployeeActionOutput = any;

// ----
export type BeeOfficeGetEmployeeByIdActionInput = {
    id: string;
};
export type BeeOfficeGetEmployeeByIdActionOutput = any;

// ----
export type BeeOfficeGetActivityActionInput = {
    method: string;
    query: string;
};
export type BeeOfficeGetActivityActionOutput = IBeeOfficeActivity;

// ----
export type BeeOfficeCreateNewTimetableActivityActionInput = {
    activity: IBeeOfficeActivity;
    category: string;
    employee: IBeeOfficeEmployee;
    date: string;
    duration: string;
    description: string;
};
export type BeeOfficeCreateNewTimetableActivityActionOutput = any;

// ----
export type BeeOfficeActionRequest<I> = DesktopRunRequest<any> & {
    script:
        | 'beeOffice.createNewTimetableActivity'
        | 'beeOffice.getEmployee'
        | 'beeOffice.getEmployeeById'
        | 'beeOffice.getActivity'
        | 'beeOffice.getSchedule'
        | 'beeOffice.deleteTimeTableActivity'
        | 'beeOffice.getActivityGroups'
        | 'beeOffice.getActivitiesByURLParameters';
};

@Injectable()
export class BeeOfficeActionHandler extends StatelessActionHandler {
    constructor() {
        super();
    }

    async getBearerToken() {
        const obj = {
            grant_type: 'password',
            username: process.env.BEE_USER,
            password: process.env.BEE_PASS,
            logsys: process.env.BEE_LOGSYS,
        };

        const data = Object.keys(obj)
            .map((key, index) => `${key}=${encodeURIComponent(obj[key])}`)
            .join('&');

        const response = await externalAxios({
            method: 'POST',
            headers: {
                'content-type': 'application/x-www-form-urlencoded',
            },
            data,
            url: `${process.env.BEE_URL}/Token`,
            maxRedirects: 0,
        });

        return response.data.access_token;
    }

    async getEmployee(input: BeeOfficeGetEmployeeActionInput): Promise<BeeOfficeGetEmployeeActionOutput> {
        const response = await externalAxios.get<IBeeOfficeEmployee[]>(
            `${process.env.BEE_URL}/api/employees/email%3BADD%3Beq%3B${input.email}/1`,
            {
                headers: {
                    Authorization: 'Bearer ' + (await this.getBearerToken()),
                },
                maxRedirects: 0,
            },
        );

        return response.data[0];
    }

    async getEmployeeById(input: BeeOfficeGetEmployeeByIdActionInput): Promise<BeeOfficeGetEmployeeByIdActionOutput> {
        const response = await externalAxios.get<IBeeOfficeEmployee[]>(
            `${process.env.BEE_URL}/api/employees/ID;ADD;eq;${input.id}`,
            {
                headers: {
                    Authorization: 'Bearer ' + (await this.getBearerToken()),
                },
                maxRedirects: 0,
            },
        );

        return response.data[0];
    }

    async getActivity(input: BeeOfficeGetActivityActionInput): Promise<BeeOfficeGetActivityActionOutput> {
        const methods = {
            Equals: 'eq',
            Contains: 'ct',
        };
        const method = input.method ? methods[input.method] : 'ct';
        const response = await externalAxios.get<IBeeOfficeActivity[]>(
            `${process.env.BEE_URL}/api/activity/name%3BADD%3B${method}%3B${input.query}/1`,
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
        input: BeeOfficeCreateNewTimetableActivityActionInput,
    ): Promise<BeeOfficeCreateNewTimetableActivityActionOutput> {
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
            cat1_dic: null,
            cat1_dic_name: null,
            cat2_dic: Number(input.category),
            cat2_dic_name: '',
            cat3_dic: 1,
            cat3_dic_name: '',
            cat4_dic: null,
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

        const response = await externalAxios.post(`${process.env.BEE_URL}/api/timetableactivity`, requestBody, {
            headers: {
                Authorization: 'Bearer ' + (await this.getBearerToken()),
            },
            maxRedirects: 0,
        });

        return response.data;
    }

    async getSchedule(input: BeeOfficeGetScheduleActionInput): Promise<BeeOfficeGetScheduleActionOutput> {
        const limit = input.limit ? input.limit : 100;
        const response = await externalAxios.get<IBeeOfficeActivity[]>(
            `${process.env.BEE_URL}/api/timetableactivity/employee_id%3BADD%3Beq%3B${input.employee.ID}%7Ctimetabledate%3BADD%3Beq%3B${input.date}/${limit}`,
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
        input: BeeOfficeDeleteTimeTableActionInput,
    ): Promise<BeeOfficeDeleteTimeTableActionOutput> {
        const response = await externalAxios.delete<any>(
            `${process.env.BEE_URL}/api/timetableactivity/${input.timeTableActivity.ID}`,
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
        input: BeeOfficeGetActivityGroupsActionInput,
    ): Promise<BeeOfficeGetActivityGroupsActionOutput> {
        const response = await externalAxios.get<IBeeOfficeActivity[]>(
            `${process.env.BEE_URL}/api/activitygroup/name;ADD;eq;${input.group}`,
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
        input: BeeOfficeGetActivitiesByURLParametersActionInput,
    ): Promise<BeeOfficeGetActivitiesByURLParametersActionOutput> {
        const response = await externalAxios.get<IBeeOfficeActivity[]>(
            `${process.env.BEE_URL}/api/activity/${input.query}`,
            {
                headers: {
                    Authorization: 'Bearer ' + (await this.getBearerToken()),
                },
                maxRedirects: 0,
            },
        );

        return response.data;
    }

    async run(request: BeeOfficeActionRequest<any>): Promise<DesktopRunResponse<any>> {
        let output = {};
        switch (request.script) {
            case 'beeOffice.createNewTimetableActivity':
                output = await this.createNewTimetableActivity(request.input);
                break;
            case 'beeOffice.getEmployee':
                output = await this.getEmployee(request.input);
                break;
            case 'beeOffice.getEmployeeById':
                output = await this.getEmployeeById(request.input);
                break;
            case 'beeOffice.getActivity':
                output = await this.getActivity(request.input);
                break;
            case 'beeOffice.getActivitiesByURLParameters':
                output = await this.getActivitiesByURLParameters(request.input);
                break;
            case 'beeOffice.getSchedule':
                output = await this.getSchedule(request.input);
                break;
            case 'beeOffice.deleteTimeTableActivity':
                output = await this.deleteTimeTableActivity(request.input);
                break;
            case 'beeOffice.getActivityGroups':
                output = await this.getActivityGroups(request.input);
                break;
        }
        return {
            status: 'ok',
            output: output,
        };
    }
}
