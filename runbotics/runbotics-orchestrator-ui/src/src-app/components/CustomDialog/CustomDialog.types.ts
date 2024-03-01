export interface CustomDialogProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    children?: React.ReactNode;
    confirmButtonOprions?: DialogButton;
    cancelButtonOptions?: DialogButton;
}

export interface DialogButton {
    label?: string;
    onClick?: () => void;
    isDisabled?: boolean;
    isLoading?: boolean;
}
