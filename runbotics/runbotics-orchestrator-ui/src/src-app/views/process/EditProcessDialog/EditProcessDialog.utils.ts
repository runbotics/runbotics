import { FormValidationState } from './EditProcessDialog.types';

export const DEBOUNCE_TIME = 300;
export const MAX_NUMBER_OF_TAGS = 15;
export const MAX_TAG_LENGTH = 20;

export const initialFormValidationState: FormValidationState = {
    name: true
};
