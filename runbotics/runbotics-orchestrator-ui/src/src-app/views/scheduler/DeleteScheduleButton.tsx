import React, { useState, VFC } from 'react';

import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    IconButton,
    SvgIcon,
    Typography,
} from '@mui/material';
import { useSnackbar } from 'notistack';
import { Trash as TrashIcon } from 'react-feather';

import useTranslations from '#src-app/hooks/useTranslations';

import { schedulerActions } from '#src-app/store/slices/Scheduler';

import { useDispatch } from '../../store';

import { scheduleProcessActions } from '../../store/slices/ScheduleProcess';




interface DeleteScheduleButtonProps {
    id: number;
    processName: string;
}

const DeleteScheduleButton: VFC<DeleteScheduleButtonProps> = ({ id, processName }) => {
    const dispatch = useDispatch();
    const [show, setShow] = useState(false);
    const { translate } = useTranslations();
    const { enqueueSnackbar } = useSnackbar();

    const changeVisibility = () => {
        setShow((prevState) => !prevState);
    };

    const handleDelete = async () => {
        setShow(false);
        await dispatch(scheduleProcessActions.removeScheduledProcess({ resourceId: id }))
            .then(() => {
                enqueueSnackbar(translate('Scheduler.Delete.ScheduledProcess.Success', { processName }), {
                    variant: 'success',
                });
                dispatch(schedulerActions.removeScheduledProcess(id.toString()));
            })
            .catch(() => enqueueSnackbar(translate('Scheduler.Delete.ScheduledProcess.Failed', { processName }), {
                variant: 'error',
            }));
    };

    return (
        <>
            <IconButton onClick={() => changeVisibility()}>
                <SvgIcon fontSize="small" color="secondary">
                    <TrashIcon />
                </SvgIcon>
            </IconButton>
            <Dialog open={show} onClose={changeVisibility} fullWidth maxWidth="sm">
                <DialogTitle>{translate('Scheduler.Delete.Dialog.Title', { processName })}</DialogTitle>
                <DialogContent>
                    <Typography variant="body1">
                        {translate('Scheduler.Delete.Dialog.Confirmation.Message', { processName })}
                    </Typography>
                </DialogContent>
                <DialogActions>
                    <Button color="primary" onClick={changeVisibility}>
                        {translate('Common.Cancel')}
                    </Button>
                    <Button variant="contained" color="primary" autoFocus onClick={() => handleDelete()}>
                        {translate('Common.Confirm')}
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
};

export default DeleteScheduleButton;
