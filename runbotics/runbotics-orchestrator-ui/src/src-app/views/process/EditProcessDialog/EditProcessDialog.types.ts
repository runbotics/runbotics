import { ProcessDto } from 'runbotics-common';

export interface EditProcessDialogProps {
    process: ProcessDto;
    onClose: () => void;
    onAdd: (process: ProcessDto) => void;
    open?: boolean;
};

export interface FormValidationState {
    name: boolean;
}
