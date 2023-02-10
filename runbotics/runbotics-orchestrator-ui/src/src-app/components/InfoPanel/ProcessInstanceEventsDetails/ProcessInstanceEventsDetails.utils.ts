import { IProcessInstanceEvent } from 'runbotics-common';

export const sortByFinished = (
    aEvent: IProcessInstanceEvent,
    bEvent: IProcessInstanceEvent 
) => new Date(aEvent.created).getTime() - new Date(bEvent.created).getTime();
