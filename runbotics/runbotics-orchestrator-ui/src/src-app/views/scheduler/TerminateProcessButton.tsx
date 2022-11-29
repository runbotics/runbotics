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
import { X as CancelIcon } from 'react-feather';

import { FeatureKey } from 'runbotics-common';

import If from '#src-app/components/utils/If';
import useFeatureKey from '#src-app/hooks/useFeatureKey';
import useTranslations from '#src-app/hooks/useTranslations';


import { useDispatch } from '../../store';
import { schedulerActions } from '../../store/slices/Scheduler';

interface TerminateProcessButtonProps {
    id: string;
    processName: string;
}

const TerminateProcessButton: VFC<TerminateProcessButtonProps> = ({ id, processName }) => {
    const dispatch = useDispatch();
    const [show, setShow] = useState(false);
    const { translate } = useTranslations();
    const { enqueueSnackbar } = useSnackbar();
    const hasTerminateProcessAccess = useFeatureKey([FeatureKey.PROCESS_INSTANCE_TERMINATE]);

    const changeVisibility = () => {
        setShow((prevState) => !prevState);
    };

    const handleTerminate = async () => {
        setShow(false);
        await dispatch(schedulerActions.terminateActiveJob({ jobId: id }))
            .catch(() => {
                enqueueSnackbar(translate('Scheduler.ActiveProcess.Terminate.Failed', { processName }), {
                    variant: 'error',
                });
            });
    };

    return (
        <If condition={hasTerminateProcessAccess}>
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
        </If>
    );
};

export default TerminateProcessButton;
