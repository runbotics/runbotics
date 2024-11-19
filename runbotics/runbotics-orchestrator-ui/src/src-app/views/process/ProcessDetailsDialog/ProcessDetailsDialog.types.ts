import { ProcessDto } from 'runbotics-common';

export interface DetailsInfoTabProps {
    process: ProcessDto;
    value: ProcessDetailsTab;
}

export interface ProcessDetailsDialogProps {
    process: ProcessDto;
    isOpen: boolean;
    onClose: () => void;
}

export enum ProcessDetailsTab {
    GENERAL_INFO = 'general-info',
    SCHEDULES = 'schedules',
    CREDENTIALS = 'credentials',
    ACCESS = 'access',
}
