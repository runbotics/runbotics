import { ButtonProps } from '@mui/material/Button';

import { DialogButton } from '../CustomDialog.types';

export interface DialogButtonProps {
    options: DialogButton;
    children: React.ReactNode;
    variant?: ButtonProps['variant'];
}
