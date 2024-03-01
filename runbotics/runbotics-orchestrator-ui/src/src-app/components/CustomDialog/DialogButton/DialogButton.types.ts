import { DialogButton } from '../CustomDialog.types';

export interface DialogButtonProps {
    options: DialogButton;
    children: React.ReactNode;
    variant?: 'contained';
}
