import { CredentialsCollection } from '../../CredentialsCollection.types';
import { InputErrorType } from '../EditCredentialsCollection.utils';

export interface CredentalsCollectionGeneralOptionsProps{
    credentialsCollectionData: CredentialsCollection;
    setCredentialsCollectionData: (collection: CredentialsCollection) => void;
    isOwner?: boolean;
    isEditDialogOpen: boolean;
    formValidationState: boolean;
    setFormValidationState: (formValidationState: boolean) => void;
    inputErrorType: InputErrorType;
    formState: CredentialsCollection;
    setFormState: (newState: CredentialsCollection) => void;
}
