export interface CustomDialogProps {
    isOpen: boolean;
    onClose: (e?: React.MouseEvent<HTMLLIElement, MouseEvent>) => void;
    title: string;
    children?: React.ReactNode;
    confirmButtonOptions?: DialogButton;
    cancelButtonOptions?: DialogButton;
}

export interface DialogButton {
    label?: string;
    onClick?: (e?: React.MouseEvent<HTMLLIElement, MouseEvent>) => void;
    isDisabled?: boolean;
    isLoading?: boolean;
}
