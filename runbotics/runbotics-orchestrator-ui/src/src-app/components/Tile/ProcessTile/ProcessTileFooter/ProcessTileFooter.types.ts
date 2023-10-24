import { IProcess, IProcessInstance } from 'runbotics-common';

export interface ProcessTileFooterProps {
    process: IProcess;
    processInstance: IProcessInstance;
}

export type Color = 'primary' | 'secondary' | 'error' | 'warning' | 'info' | 'success' | 'grey';
