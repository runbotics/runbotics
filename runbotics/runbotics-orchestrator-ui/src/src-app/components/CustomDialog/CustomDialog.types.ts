export interface CustomDialogProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    children?: React.ReactNode;
    confirmButtonOptions?: DialogButton;
    cancelButtonOptions?: DialogButton;
}

export interface DialogButton {
    label?: string;
    onClick?: () => void;
    isDisabled?: boolean;
    isLoading?: boolean;
}
