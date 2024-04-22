import { IProcess } from 'runbotics-common';

export interface ConfigureOptionsProps {
    processData: IProcess;
    setProcessData: (IProcess) => void;
    isOwner: boolean;
    isEditDialogOpen: boolean;
}
