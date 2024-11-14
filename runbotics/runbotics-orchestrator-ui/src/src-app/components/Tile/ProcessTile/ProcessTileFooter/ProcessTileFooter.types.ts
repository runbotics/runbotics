import { ProcessDto, IProcessInstance } from 'runbotics-common';

export interface ProcessTileFooterProps {
    process: ProcessDto;
    processInstance: IProcessInstance;
    isJobWaiting?: boolean;
    isJobCreating?: boolean;
}

export type Color = 'primary' | 'secondary' | 'error' | 'warning' | 'info' | 'success' | 'grey';
