import { FC } from 'react';

import { Dialog, DialogActions, DialogContent, DialogTitle, Typography } from '@mui/material';

import { translate } from '#src-app/hooks/useTranslations';

import { CustomDialogProps } from './CustomDialog.types';
import DialogButton from './DialogButton';


const CustomDialog: FC<CustomDialogProps> = ({
    isOpen,
    onClose,
    title,
    children,
    confirmButtonOptions,
    cancelButtonOptions,
    maxWidth = 'sm',
    fullWidth = false
}) => (
    <Dialog
        open={isOpen}
        onClose={onClose}
        maxWidth={maxWidth}
        fullWidth={fullWidth}
    >
        <DialogTitle>
            <Typography variant='h4'>{title}</Typography>
        </DialogTitle>
        <DialogContent>
            {children}
        </DialogContent>
        <DialogActions>
            <DialogButton options={cancelButtonOptions}>
                <Typography variant='body2' fontWeight='medium'>
                    {cancelButtonOptions.label ?? translate('Common.Cancel')}
                </Typography>
            </DialogButton>
            <DialogButton options={confirmButtonOptions} variant='contained'>
                <Typography variant='body2' fontWeight='medium'>
                    {confirmButtonOptions.label ?? translate('Common.Confirm')}
                </Typography>
            </DialogButton>
        </DialogActions>
    </Dialog>
);

export default CustomDialog;
