import { IUser } from 'runbotics-common';

export interface UsersListEditDialogProps {
    open: boolean;
    openDeleteTab: () => void;
    onClose: () => void;
    userData: IUser;
};

export interface UsersListEditFormProps {
    user: IUser;
    setUser: (IUser) => void;
    validation: UserDataValidation;
    setValidation: (UserDataValidation) => void;
};

export interface UserDataValidation {
    email: boolean;
    login: boolean;
};

export interface ValidatorType {
    error: boolean;
    helperText: string;
};
