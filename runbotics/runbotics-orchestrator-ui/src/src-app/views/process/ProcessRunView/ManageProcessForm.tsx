import React, { VFC, useState } from 'react';

import { Button } from '@mui/material';
import { useSnackbar } from 'notistack';

import { ManageAttendedProcessModal } from '#src-app/components/AttendedProcessModal';

import If from '#src-app/components/utils/If';
import useTranslations from '#src-app/hooks/useTranslations';
import { useDispatch, useSelector } from '#src-app/store';
import { processActions } from '#src-app/store/slices/Process';
import { scheduleProcessSelector } from '#src-app/store/slices/ScheduleProcess';


const ManageProcessForm: VFC = () => {
    const dispatch = useDispatch();
    const { translate } = useTranslations();
    const { enqueueSnackbar } = useSnackbar();
    const { process } = useSelector((state) => state.process.draft);
    const { schedules } = useSelector(scheduleProcessSelector);
    const [modalOpen, setModalOpen] = useState(false);
    const openModal = () => setModalOpen(true);
    const closeModal = () => setModalOpen(false);

    const handleSubmit = async (executionInfoSchema: string) => {
        await dispatch(processActions.updateExecutionInfo({
            resourceId: process.id,
            payload: {
                executionInfo: executionInfoSchema,
            },
        }))
            .unwrap()
            .then(() => {
                enqueueSnackbar(
                    translate('Component.AttendedProcessFormModal.ManageAttendedProcessModal.Submit.Success', {
                        name: process.name,
                    }),
                    {
                        variant: 'success',
                    },
                );
                closeModal();
            })
            .catch(() => {
                enqueueSnackbar(
                    translate('Component.AttendedProcessFormModal.ManageAttendedProcessModal.Submit.Failed', {
                        name: process.name,
                    }),
                    {
                        variant: 'error',
                    },
                );
            });
    };

    const handleDelete = async () => {
        await dispatch(processActions.updateExecutionInfo({
            resourceId: process.id,
            payload: {
                executionInfo: '',
            },
        }))
            .unwrap()
            .then(() => {
                enqueueSnackbar(
                    translate('Component.AttendedProcessFormModal.ManageAttendedProcessModal.Delete.Success', {
                        name: process.name,
                    }),
                    {
                        variant: 'success',
                    },
                );
                closeModal();
            })
            .catch(() => {
                enqueueSnackbar(
                    translate('Component.AttendedProcessFormModal.ManageAttendedProcessModal.Delete.Failed', {
                        name: process.name,
                    }),
                    {
                        variant: 'error',
                    },
                );
            });
    };

    return (
        <>
            <If condition={modalOpen}>
                <ManageAttendedProcessModal
                    key={process.id}
                    open={modalOpen}
                    setOpen={setModalOpen}
                    process={process}
                    onSubmit={handleSubmit}
                    onDelete={handleDelete}
                />
            </If>
            <Button color="secondary" variant="text" onClick={openModal} disabled={!process.isAttended}>
                {translate('Process.Run.ManageProcessForm')}
            </Button>
        </>
    );
};

export default ManageProcessForm;
