import { UserDto } from 'runbotics-common';

export interface UsersListEditDialogProps {
    open: boolean;
    onClose: () => void;
    userData: UserDto;
    isForAdmin: boolean;
};

export interface FormValidationState {
    email: boolean;
};

export interface UsersListEditFormProps {
    user: UserDto;
    setUser: (UserDto) => void;
    formValidationState: FormValidationState;
    setFormValidationState: (FormValidationState) => void;
};
