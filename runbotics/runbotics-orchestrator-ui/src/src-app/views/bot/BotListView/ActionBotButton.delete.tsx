import React, { useState, VFC } from 'react';

import {
    Button, Dialog, DialogActions, DialogContent, DialogTitle, MenuItem, Typography,
} from '@mui/material';
import { useSnackbar } from 'notistack';
import { IBot } from 'runbotics-common';


import useTranslations from '#src-app/hooks/useTranslations';

import { useDispatch } from '../../../store';
import { botActions } from '../../../store/slices/Bot';


const ActionBotButtonDelete: VFC<{ name: IBot['installationId']; id: IBot['id'] }> = ({ name, id }) => {
    const [show, setShow] = useState(false);
    const dispatch = useDispatch();
    const { enqueueSnackbar } = useSnackbar();
    const { translate } = useTranslations();

    const handleDelete = () => {
        setShow(false);
    };

    const changeVisibility = () => {
        setShow((prevState) => !prevState);
    };

    const handleSubmit = async () => {
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
            });
        handleDelete();
    };

    return (
        <>
            <MenuItem onClick={() => setShow(true)}>{translate('Bot.Actions.Delete.Title')}</MenuItem>
            <Dialog open={show} onClose={changeVisibility} fullWidth maxWidth="sm">
                <DialogTitle>
                    {translate('Bot.Actions.Delete.TitleWithName', { name })}
                </DialogTitle>
                <DialogContent>
                    <Typography variant="body1">
                        {translate('Bot.Actions.Delete.Confirmation.Question', { name })}
                    </Typography>
                </DialogContent>
                <DialogActions>
                    <Button color="primary" onClick={changeVisibility}>
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
