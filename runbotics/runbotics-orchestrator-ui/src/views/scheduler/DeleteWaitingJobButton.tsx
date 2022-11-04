import React, { VFC } from 'react';

import { IconButton, SvgIcon } from '@mui/material';
import { useSnackbar } from 'notistack';
import { Trash as TrashIcon } from 'react-feather';

import useTranslations from 'src/hooks/useTranslations';

import { useDispatch } from '../../store';
import { schedulerActions } from '../../store/slices/Scheduler';

interface DeleteWaitingJobButtonProps {
    id: string;
    processName: string;
}

const DeleteWaitingJobButton: VFC<DeleteWaitingJobButtonProps> = ({ id, processName }) => {
    const dispatch = useDispatch();
    const { translate } = useTranslations();
    const { enqueueSnackbar } = useSnackbar();

    const handleDelete = () => {
        dispatch(schedulerActions.removeWaitingJob({ jobId: id }))
            .then(() => enqueueSnackbar(translate('Scheduler.Delete.WaitingJobs.Success', { processName }), {
                variant: 'success',
            }))
            .catch(() => enqueueSnackbar(translate('Scheduler.Delete.WaitingJobs.Failed', { processName }), {
                variant: 'error',
            }));
    };

    return (
        <IconButton onClick={() => handleDelete()}>
            <SvgIcon fontSize="small" color="secondary">
                <TrashIcon />
            </SvgIcon>
        </IconButton>
    );
};

export default DeleteWaitingJobButton;
