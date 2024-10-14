import { IProcess } from 'runbotics-common';

export interface DetailsInfoTabProps {
    process: IProcess;
    value: ProcessDetailsTab;
}

export interface ProcessDetailsDialogProps {
    process: IProcess;
    isOpen: boolean;
    onClose: () => void;
}

export enum ProcessDetailsTab {
    GENERAL_INFO = 'general-info',
    SCHEDULES = 'schedules',
    CREDENTIALS = 'credentials',
    ACCESS = 'access',
}
