import { IProcess } from 'runbotics-common';

import { FormValidationState } from '../EditProcessDialog.types';
import { InputErrorType } from '../EditProcessDialog.utils';

export interface GeneralOptionsProps {
    processData: IProcess;
    setProcessData: (IProcess) => void;
    isOwner: boolean;
    isEditDialogOpen: boolean;
    formValidationState: FormValidationState;
    setFormValidationState: (FormValidationState) => void;
    inputErrorType: InputErrorType;
    formState: IProcess;
    setFormState: (newState: IProcess) => void;
}
