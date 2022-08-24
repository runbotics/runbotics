import React, { FC, useState } from 'react';
import useTranslations from 'src/hooks/useTranslations';
import { ManageAttendedProcessModal } from 'src/components/AttendedProcessModal';
import If from 'src/components/utils/If';
import { useDispatch, useSelector } from 'src/store';
import { processActions } from 'src/store/slices/Process';
import { useSnackbar } from 'notistack';
import Button from '@mui/material/Button';

interface AddProcessFormProps {}

const ManageProcessForm: FC<AddProcessFormProps> = ({}) => {
    const dispatch = useDispatch();
    const { translate } = useTranslations();
    const { enqueueSnackbar } = useSnackbar();
    const { process } = useSelector((state) => state.process.draft);
    const [modalOpen, setModalOpen] = useState(false);
    const openModal = () => setModalOpen(true);
    const closeModal = () => setModalOpen(false);

    const handleSubmit = async (executionInfoSchema: string) => {
        try {
            await dispatch(processActions.partialUpdateProcess({ ...process, executionInfo: executionInfoSchema }));
            enqueueSnackbar(
                translate('Component.AttendedProcessFormModal.ManageAttendedProcessModal.Submit.Success', {
                    name: process.name,
                }),
                {
                    variant: 'success',
                },
            );
            closeModal();
        } catch (e) {
            enqueueSnackbar(
                translate('Component.AttendedProcessFormModal.ManageAttendedProcessModal.Submit.Failed', {
                    name: process.name,
                }),
                {
                    variant: 'error',
                },
            );
        }
    };

    const handleDelete = async () => {
        try {
            await dispatch(processActions.partialUpdateProcess({ ...process, executionInfo: '' }));
            enqueueSnackbar(
                translate('Component.AttendedProcessFormModal.ManageAttendedProcessModal.Delete.Success', {
                    name: process.name,
                }),
                {
                    variant: 'success',
                },
            );
            closeModal();
        } catch (e) {
            enqueueSnackbar(
                translate('Component.AttendedProcessFormModal.ManageAttendedProcessModal.Delete.Failed', {
                    name: process.name,
                }),
                {
                    variant: 'error',
                },
            );
        }
    };

    return (
        <>
            <If condition={modalOpen}>
                <ManageAttendedProcessModal
                    open={modalOpen}
                    setOpen={setModalOpen}
                    process={process}
                    onSubmit={handleSubmit}
                    onDelete={handleDelete}
                />
            </If>
            <Button color="secondary" variant="text" onClick={openModal}>
                {translate('Process.Run.ManageProcessForm')}
            </Button>
        </>
    );
};

export default ManageProcessForm;
