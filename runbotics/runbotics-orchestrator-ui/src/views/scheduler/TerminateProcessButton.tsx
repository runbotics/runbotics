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
import { X as CancelIcon } from 'react-feather';
import { useSnackbar } from 'notistack';
import useTranslations from 'src/hooks/useTranslations';
import { schedulerActions } from '../../store/slices/Scheduler';
import { useDispatch } from '../../store';

interface TerminateProcessButtonProps {
    id: string;
    processName: string;
}

const TerminateProcessButton: VFC<TerminateProcessButtonProps> = ({ id, processName }) => {
    const dispatch = useDispatch();
    const [show, setShow] = useState(false);
    const { translate } = useTranslations();
    const { enqueueSnackbar } = useSnackbar();

    const changeVisibility = () => {
        setShow((prevState) => !prevState);
    };

    const handleTerminate = async () => {
        setShow(false);
        await dispatch(schedulerActions.terminateActiveJob({ jobId: id }))
            .catch(() => enqueueSnackbar(translate('Scheduler.ActiveProcess.Terminate.Failed', { processName }), {
                variant: 'error',
            }));
    };

    return (
        <>
            <IconButton onClick={() => changeVisibility()}>
                <SvgIcon fontSize="small" color="secondary">
                    <CancelIcon />
                </SvgIcon>
            </IconButton>
            <Dialog open={show} onClose={changeVisibility} fullWidth maxWidth="sm">
                <DialogTitle>
                    {translate('Scheduler.ActiveProcess.Terminate.Dialog.Title', { processName })}
                </DialogTitle>
                <DialogContent>
                    <Typography variant="body1">
                        {translate('Scheduler.ActiveProcess.Terminate.Dialog.Confirmation.Message', { processName })}
                    </Typography>
                </DialogContent>
                <DialogActions>
                    <Button color="primary" onClick={changeVisibility}>
                        {translate('Common.Cancel')}
                    </Button>
                    <Button variant="contained" color="primary" autoFocus onClick={() => handleTerminate()}>
                        {translate('Common.Confirm')}
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
};

export default TerminateProcessButton;
