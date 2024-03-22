import { FC } from 'react';

import { DialogLoadingButton } from './DialogButton.styles';
import { DialogButtonProps } from './DialogButton.types';

const DialogButton: FC<DialogButtonProps> = ({ children, options, variant }) => (
    <DialogLoadingButton
        variant={variant}
        loading={Boolean(options.isLoading)}
        onClick={options.onClick}
        disabled={options.isDisabled}
    >
        {children}
    </DialogLoadingButton>
);

export default DialogButton;
