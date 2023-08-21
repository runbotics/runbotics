import { IUser } from 'runbotics-common';

export interface UsersListEditDialogProps {
    open: boolean;
    openDeleteTab: () => void;
    onClose: () => void;
    userData: IUser;
};

export interface UserDataValidationType {
    email: boolean;
    login: boolean;
};

export interface UsersListEditFormProps {
    user: IUser;
    setUser: (IUser) => void;
    validation: UserDataValidationType;
    setValidation: (UserDataValidation) => void;
};

export interface ValidatorType {
    error: boolean;
    helperText: string;
};

export type UserUpdateErrorMessageType =
    'Users.List.Edit.Form.Event.Error.BadEmail'
    | 'Users.List.Edit.Form.Event.Error.BadLogin';
