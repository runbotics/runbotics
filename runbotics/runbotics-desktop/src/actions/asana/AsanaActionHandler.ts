import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { DesktopRunResponse, StatelessActionHandler } from 'runbotics-sdk';
import { StatefulActionHandler } from 'runbotics-sdk';
import { DesktopRunRequest } from 'runbotics-sdk';
import asana from 'asana';
import objFromArray from '../../utils/objFromArray';

export type AsanaActionRequest<I> = DesktopRunRequest<any> & {
    script: 'asana.test';
};

export type AsanaSendActionInput = {};
export type AsanaSendActionOutput = any;

@Injectable()
class AsanaActionHandler extends StatelessActionHandler {
    constructor() {
        super();
    }

    async test(input: AsanaSendActionInput): Promise<AsanaSendActionOutput> {
        const client = asana.Client.create().useAccessToken('1/1200556829381683:1d4c7d240249b837e1370a2d6ac7ca6b');

        const all: Record<string, any> = {};
        const workspaces = await client.workspaces.findAll();
        console.log('workspaces', workspaces);

        const projectsResponse = await client.projects.findAll({
            workspace: '1200556829674642',
        });

        for (let project of projectsResponse.data) {
            const projectId = project.gid;
            const tasksResponse = await client.tasks.findByProject(projectId);
            const tasks = tasksResponse.data;
            all[projectId] = {
                project: project,
            };
            all[projectId].tasks = objFromArray(tasks, 'gid');

            for (let task of tasks) {
                const taskResponse = await client.tasks.findById(task.gid);
                const taskParsed: any & { custom_fields_obj: Record<string, any> } = {
                    ...taskResponse,
                    custom_fields_obj: objFromArray(taskResponse.custom_fields, 'name'),
                };
                all[projectId].tasks[task.gid] = taskParsed;
            }

            all[projectId].tasks = Object.values(all[projectId].tasks);
        }
        const result = Object.values(all);
        return result;
    }

    async run(request: AsanaActionRequest<any>): Promise<DesktopRunResponse<any>> {
        let output = {};
        switch (request.script) {
            case 'asana.test':
                output = await this.test(request.input);
                break;
        }
        return {
            status: 'ok',
            output: output,
        };
    }
}

export default AsanaActionHandler;
