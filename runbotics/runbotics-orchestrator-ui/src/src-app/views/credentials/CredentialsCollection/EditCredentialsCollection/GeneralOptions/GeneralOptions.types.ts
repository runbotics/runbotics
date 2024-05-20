import { CreateCredentialsCollectionDto, EditCredentialsCollectionDto } from '../../CredentialsCollection.types';
import { InputErrorType } from '../EditCredentialsCollection.utils';

export interface CredentalsCollectionGeneralOptionsProps{
    credentialsCollectionData: CreateCredentialsCollectionDto | EditCredentialsCollectionDto;
    // setCredentialsCollectionData: (collection: CreateCredentialsCollectionDto | EditCredentialsCollectionDto) => void;
    // isOwner?: boolean;
    formValidationState: boolean;
    // setFormValidationState: (formValidationState: boolean) => void;
    inputErrorType: InputErrorType;
    // formState: CreateCredentialsCollectionDto | EditCredentialsCollectionDto;
    // setFormState: (newState: CreateCredentialsCollectionDto | EditCredentialsCollectionDto) => void;
}
