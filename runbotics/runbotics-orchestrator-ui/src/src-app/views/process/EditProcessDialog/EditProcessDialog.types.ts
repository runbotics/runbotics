import { IProcess } from 'runbotics-common';

export interface EditProcessDialogProps {
    process: IProcess;
    onClose: () => void;
    onAdd: (process: IProcess) => void;
    open?: boolean;
};

export interface FormValidationState {
    name: boolean;
}
