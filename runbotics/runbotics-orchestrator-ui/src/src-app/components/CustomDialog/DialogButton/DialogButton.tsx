import { FC } from 'react';

import { DialogLoadingButton, NormalDialogButton } from './DialogButton.styles';
import { DialogButtonProps } from './DialogButton.types';

const DialogButton: FC<DialogButtonProps> = ({ children, options, variant }) => (
    options.isLoading === undefined ? (
        <NormalDialogButton
            variant={variant}
            disabled={options.isDisabled}
            onClick={options.onClick}
        >
            {children}
        </NormalDialogButton>
    ) : (
        <DialogLoadingButton
            variant={variant}
            loading={options.isLoading}
            onClick={options.onClick}
            disabled={options.isDisabled}
        >
            {children}
        </DialogLoadingButton>
    )
);

export default DialogButton;
