import { Breakpoint } from '@mui/system';

export interface CustomDialogProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    children?: React.ReactNode;
    confirmButtonOptions?: DialogButton;
    cancelButtonOptions?: DialogButton;
    maxWidth?: false | Breakpoint;
    fullWidth?: boolean;
}

export interface DialogButton {
    label?: string;
    onClick?: () => void;
    isDisabled?: boolean;
    isLoading?: boolean;
}
