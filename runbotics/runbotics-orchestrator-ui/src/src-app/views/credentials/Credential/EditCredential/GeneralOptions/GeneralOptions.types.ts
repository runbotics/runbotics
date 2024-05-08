import { Credential } from '../../Credential.types';
import { InputErrorType } from '../EditCredential.utils';

export interface CredentalGeneralOptionsProps{
    credentialData: Credential;
    setCredentialData: (credential: Credential) => void;
    isOwner?: boolean;
    isEditDialogOpen: boolean;
    formValidationState: boolean;
    setFormValidationState: (formValidationState: boolean) => void;
    inputErrorType: InputErrorType;
    formState: Credential;
    setFormState: (newState: Credential) => void;
}
