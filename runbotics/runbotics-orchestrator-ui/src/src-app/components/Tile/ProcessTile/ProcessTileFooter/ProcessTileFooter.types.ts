import { IProcess } from 'runbotics-common';

export interface ProcessTileFooterProps {
    process: IProcess;
}

export type Color = 'primary' | 'secondary' | 'error' | 'warning' | 'info' | 'success' | 'grey';
