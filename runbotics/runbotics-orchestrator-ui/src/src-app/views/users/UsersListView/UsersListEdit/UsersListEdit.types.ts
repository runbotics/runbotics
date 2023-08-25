import { IUser } from 'runbotics-common';

export interface UsersListEditDialogProps {
    open: boolean;
    openDeleteDialog: () => void;
    onClose: () => void;
    userData: IUser;
};

export interface FormValidationState {
    email: boolean;
    login: boolean;
};

export interface UsersListEditFormProps {
    user: IUser;
    setUser: (IUser) => void;
    formValidationState: FormValidationState;
    setFormValidationState: (IFormValidationState) => void;
};

export interface FieldValidation {
    error?: boolean;
    helperText?: string;
};
