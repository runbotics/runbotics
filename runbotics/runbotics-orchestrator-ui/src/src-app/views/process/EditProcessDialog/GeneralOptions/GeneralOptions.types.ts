import { IProcess } from 'runbotics-common';

import { FormValidationState } from '../EditProcessDialog.types';

export interface GeneralOptionsProps {
    processData: IProcess;
    setProcessData: (IProcess) => void;
    isOwner: boolean;
    isEditDialogOpen: boolean;
    formValidationState: FormValidationState;
    setFormValidationState: (FormValidationState) => void;
}
