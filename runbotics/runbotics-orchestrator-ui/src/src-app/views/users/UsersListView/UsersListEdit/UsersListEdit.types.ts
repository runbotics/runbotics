import { IUser } from 'runbotics-common';

export interface UsersListEditDialogProps {
    open: boolean;
    onClose: () => void;
    userData: IUser;
    isForAdmin: boolean;
};

export interface FormValidationState {
    email: boolean;
    login: boolean;
};

export interface UsersListEditFormProps {
    user: IUser;
    setUser: (IUser) => void;
    formValidationState: FormValidationState;
    setFormValidationState: (FormValidationState) => void;
};
