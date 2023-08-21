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

export type UserUpdateErrorMessageType =
    'Users.List.Edit.Form.Event.Error.BadEmail'
    | 'Users.List.Edit.Form.Event.Error.BadLogin';
