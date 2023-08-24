import { IUser } from 'runbotics-common';

export interface UsersListEditDialogProps {
    open: boolean;
    openDeleteTab: () => void;
    onClose: () => void;
    userData: IUser;
};

export interface IFormValidationState {
    email: boolean;
    login: boolean;
};

export interface UsersListEditFormProps {
    user: IUser;
    setUser: (IUser) => void;
    formValidationState: IFormValidationState;
    setFormValidationState: (IFormValidationState) => void;
};

export interface FieldValidation {
    error?: boolean;
    helperText?: string;
};
