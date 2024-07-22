import React, { FC } from 'react';

import {
    Button, Dialog, DialogActions, DialogContent, DialogTitle, Typography,
} from '@mui/material';
import { useSnackbar } from 'notistack';
import styled from 'styled-components';


import useTranslations from '#src-app/hooks/useTranslations';
import { useDispatch } from '#src-app/store';
import { globalVariableActions } from '#src-app/store/slices/GlobalVariable';

import { DeleteDialogState } from './Table';


const PREFIX = 'DeleteGlobalVariableDialog';

const classes = {
    content: `${PREFIX}-content`,
};

const StyledDialog = styled(Dialog)(() => ({
    [`& .${classes.content}`]: {
        minWidth: '30rem',
    },
}));

type DeleteActionDialogProps = {
    deleteDialogState: DeleteDialogState;
    onClose: () => void;
};

const DeleteGlobalVariableDialog:
    FC<DeleteActionDialogProps> = ({ deleteDialogState: { globalVariable, open }, onClose }) => {
        const dispatch = useDispatch();
        const { translate, translateHTML } = useTranslations();
        const { enqueueSnackbar } = useSnackbar();

        const successSnackbar = () => enqueueSnackbar(
            <span>
                {translateHTML(
                    'Variables.ListView.Action.Delete.Message.Success',
                    { name: globalVariable.name },
                )}
            </span>,
            { variant: 'success' },
        );

        const errorSnackbar = () => enqueueSnackbar(
            <span>
                {translateHTML(
                    'Variables.ListView.Action.Delete.Message.Error',
                    { name: globalVariable.name },
                )}
            </span>,
            { variant: 'error' },
        );

        const errorProcessUsesVariableSnackbar = (processNames: string[]) => enqueueSnackbar(
            <span>
                {translateHTML(
                    'Variables.ListView.Action.Delete.Message.Processes.Error',
                    {
                        name: globalVariable.name, processNames: processNames.toString()
                    },
                )}
            </span>,
            { variant: 'error' },
        );

        const handleDelete = () => {
            if (!globalVariable) return;

            dispatch(globalVariableActions.deleteGlobalVariable({ resourceId: globalVariable.id }))
                .unwrap()
                .then(() => {
                    successSnackbar();
                })
                .catch((error: { message: string[] }) => {
                    errorProcessUsesVariableSnackbar(error.message);
                });
            onClose();
        };

        return (
            <StyledDialog open={open} onClose={onClose} maxWidth="lg">
                <DialogTitle>
                    <Typography variant="h3">{translate('Variables.ListView.Action.Delete.Dialog.Title')}</Typography>
                </DialogTitle>
                <DialogContent className={classes.content}>
                    <Typography variant="body1">
                        {
                            translateHTML(
                                'Variables.ListView.Action.Delete.Dialog.Confirmation',
                                { name: globalVariable?.name },
                            )
                        }
                    </Typography>
                </DialogContent>
                <DialogActions>
                    <Button
                        color="primary"
                        onClick={onClose}
                    >
                        {translate('Common.Cancel')}
                    </Button>
                    <Button variant="contained" color="primary" autoFocus onClick={handleDelete}>
                        {translate('Common.Delete')}
                    </Button>
                </DialogActions>
            </StyledDialog>
        );
    };

export default DeleteGlobalVariableDialog;
