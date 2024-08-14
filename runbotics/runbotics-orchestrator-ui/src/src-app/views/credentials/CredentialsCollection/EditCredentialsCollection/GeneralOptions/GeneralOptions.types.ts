import {  EditCredentialsCollectionDto } from '../../CredentialsCollection.types';
import { InputErrorType } from '../EditCredentialsCollection.utils';

export interface CredentalsCollectionGeneralOptionsProps{
    credentialsCollectionData: EditCredentialsCollectionDto;
    setCredentialsCollectionData: (collection: EditCredentialsCollectionDto) => void;
    // isOwner?: boolean;
    formValidationState: boolean;
    setFormValidationState: (formValidationState: boolean) => void;
    inputErrorType: InputErrorType;
    formState: EditCredentialsCollectionDto;
    setFormState: (newState: EditCredentialsCollectionDto) => void;
}
