import {  EditCredentialsCollectionDto } from '../../CredentialsCollection.types';
import { InputErrorType } from '../EditCredentialsCollection.utils';

export interface CredentalsCollectionGeneralOptionsProps{
    credentialsCollectionData: EditCredentialsCollectionDto;
    setCredentialsCollectionData: (collection: EditCredentialsCollectionDto) => void;
    formValidationState: boolean;
    setFormValidationState: (formValidationState: boolean) => void;
    inputErrorType: InputErrorType;
    setInputErrorType: (errorType: InputErrorType) => void;
    formState: EditCredentialsCollectionDto;
    setFormState: (newState: EditCredentialsCollectionDto) => void;
}
