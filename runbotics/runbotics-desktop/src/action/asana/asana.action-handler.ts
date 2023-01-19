import { Injectable } from '@nestjs/common';
import { , StatelessActionHandler } from 'runbotics-sdk';
import asana from 'asana';
import objFromArray from '#utils/objFromArray';

import { AsanaSendActionOutput, AsanaActionRequest } from './types';

@Injectable()
export default class AsanaActionHandler extends StatelessActionHandler {
    constructor() {
        super();
    }

    async test(): Promise<AsanaSendActionOutput> {
        const client = asana.Client.create().useAccessToken('1/1200556829381683:1d4c7d240249b837e1370a2d6ac7ca6b');

        const all: Record<string, any> = {};
        const workspaces = await client.workspaces.findAll();
        console.log('workspaces', workspaces);

        const projectsResponse = await client.projects.findAll({
            workspace: '1200556829674642',
        });

        for (const project of projectsResponse.data) {
            const projectId = project.gid;
            const tasksResponse = await client.tasks.findByProject(projectId);
            const tasks = tasksResponse.data;
            all[projectId] = {
                project: project,
            };
            all[projectId].tasks = objFromArray(tasks, 'gid');

            for (const task of tasks) {
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

    run(request: AsanaActionRequest) {
        switch (request.script) {
            case 'asana.test':
                return this.test();
            default:
                throw new Error('Action not found');
        }
    }
}
