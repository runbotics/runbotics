import { IProcess } from 'runbotics-common';

export interface AccessOptionsProps {
    processData: IProcess;
    setProcessData: (IProcess) => void;
    isOwner: boolean;
    isEditDialogOpen: boolean;
}
