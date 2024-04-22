import { BPMNElement } from '#src-app/views/process/ProcessBuildView/Modeler/helpers/elementParameters';

export enum Activity {
    GATEWAY = 'gateway',
    ACTION = 'action',
    LOOP = 'loop'
}

export const getActivityType = (element: BPMNElement): string | null => {
    if (element.businessObject.actionId === 'loop.loop') return Activity.LOOP;
    if (element.id.startsWith('Gateway')) return Activity.GATEWAY;
    if (element.id.startsWith('Activity')) return Activity.ACTION;

    return null;
};

