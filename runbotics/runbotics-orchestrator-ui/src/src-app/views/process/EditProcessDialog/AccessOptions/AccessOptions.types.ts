import { ProcessDto } from 'runbotics-common';

export interface AccessOptionsProps {
    processData: ProcessDto;
    setProcessData: (ProcessDto) => void;
    isOwner: boolean;
    isEditDialogOpen: boolean;
}
