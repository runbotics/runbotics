import { ProcessDto } from 'runbotics-common';

import { FormValidationState } from '../EditProcessDialog.types';
import { InputErrorType } from '../EditProcessDialog.utils';

export interface GeneralOptionsProps {
    processData: ProcessDto;
    setProcessData: (ProcessDto) => void;
    isOwner: boolean;
    isEditDialogOpen: boolean;
    formValidationState: FormValidationState;
    setFormValidationState: (FormValidationState) => void;
    inputErrorType: InputErrorType;
    formState: ProcessDto;
    setFormState: (newState: ProcessDto) => void;
}
