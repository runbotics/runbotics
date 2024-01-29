import React, { VFC } from 'react';

import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Typography,
} from '@mui/material';
import { useSnackbar } from 'notistack';
import { IBot } from 'runbotics-common';

import useTranslations from '#src-app/hooks/useTranslations';

import { useDispatch } from '../../../store';
import { botActions } from '../../../store/slices/Bot';

interface ActionBotButtonDelete {
    bot: IBot;
    open: boolean;
    setOpen: (state: boolean) => void;
    onClose: () => void;
}

const ActionBotButtonDelete: VFC<ActionBotButtonDelete> = ({ bot, open, setOpen, onClose }) => {
    const dispatch = useDispatch();
    const { enqueueSnackbar } = useSnackbar();
    const { translate } = useTranslations();

    const { id, installationId: name } = bot;

    const handleSubmit = async () => {
        setOpen(false);

        await dispatch(botActions.deleteById({ id }))
            .unwrap()
            .then(() => {
                enqueueSnackbar(
                    translate('Bot.Actions.DeletionSuccessMessage', { name }),
                    {
                        variant: 'success',
                    },
                );
            })
            .catch(() => {
                enqueueSnackbar(
                    translate('Bot.Actions.DeletionFailedMessage', { name }),
                    {
                        variant: 'error',
                    },
                );
            })
            .finally(() => {
                onClose();
            });
    };

    return (
        <>
            <Dialog open={open} onClose={() => setOpen(false)} fullWidth maxWidth="sm">
                <DialogTitle>
                    {translate('Bot.Actions.Delete.TitleWithName', { name })}
                </DialogTitle>
                <DialogContent>
                    <Typography variant="body1">
                        {translate('Bot.Actions.Delete.Confirmation.Question', { name })}
                    </Typography>
                </DialogContent>
                <DialogActions>
                    <Button color="primary" onClick={() => setOpen(false)}>
                        {translate('Common.Cancel')}
                    </Button>
                    <Button variant="contained" color="primary" autoFocus onClick={handleSubmit}>
                        {translate('Common.Confirm')}
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
};

export default ActionBotButtonDelete;
