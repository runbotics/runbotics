import { translate } from 'src/hooks/useTranslations';
import {
    ElementType,
    TemplatesSchema,
} from 'src/views/process/ProcessBuildView/Modeler/ConfigureActionPanel/Template.types';

export const ApiTemplate: TemplatesSchema = {
    name: translate('Process.Details.Modeler.Templates.Api.Name'),
    id: 'api.test',
    type: ElementType.SERVICE_TASK,
    label: 'api.request',
    bpmnAction: 'api.request',
    output: 'out',
    input: {
        url: 'https://randomuser.me/api/',
        headers: {
            'Content-Type': 'application/json',
        },
        method: 'GET',
    },
    right: {
        type: ElementType.GATEWAY,
        label: 'logicGateway1',
        bottom: {
            expression: '#{out.status == 200}',
            type: ElementType.SERVICE_TASK,
            label: 'assignBodyToVariable',
            bpmnAction: 'variables.assign',
            input: {
                value: '#{out.body}',
                variable: 'body',
            },
        },
        right: {
            type: ElementType.SERVICE_TASK,
            label: 'consoleLogFail',
            bpmnAction: 'general.console.log',
            input: {
                variables: {
                    status: '#{out.status}',
                },
            },
            default: true,
        },
    },
};
