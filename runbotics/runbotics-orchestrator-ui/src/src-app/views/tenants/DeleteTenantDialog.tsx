import { VFC, useState, useEffect } from 'react';

import { Typography } from '@mui/material';
import { useSnackbar } from 'notistack';
import { Tenant } from 'runbotics-common';

import CustomDialog from '#src-app/components/CustomDialog';
import useTenantSearch from '#src-app/hooks/useTenantSearch';
import useTranslations from '#src-app/hooks/useTranslations';
import { useDispatch } from '#src-app/store';
import { tenantsActions } from '#src-app/store/slices/Tenants';

interface DeleteTenantDialogProps {
    open: boolean;
    onClose: () => void;
    onDelete: () => void;
    tenant: Tenant;
}

const DeleteTenantDialog: VFC<DeleteTenantDialogProps> = ({
    open,
    onClose,
    onDelete,
    tenant
}) => {
    const { translate } = useTranslations();
    const { enqueueSnackbar } = useSnackbar();
    const dispatch = useDispatch();

    const { refreshSearch } = useTenantSearch();
    const [tenantId, setTenantId] = useState(null);

    const handleSubmit = () => {
        dispatch(tenantsActions.deleteOne(tenantId)).unwrap()
            .then(() => {
                onClose();
                onDelete();
                enqueueSnackbar(
                    'Success',
                    { variant: 'success' }
                );
                refreshSearch();
            })
            .catch(() => {
                onClose();
                enqueueSnackbar(
                    'Fail',
                    { variant: 'error' }
                );
            });
    };

    useEffect(() => {
        open && setTenantId(tenant.id);
    }, [open]);

    return (
        <CustomDialog
            isOpen={open}
            onClose={onClose}
            title='Are you sure you want to delete this tenant?'
            cancelButtonOptions={{
                isDisabled: false,
                label: 'cancel',
                onClick: onClose
            }}
            confirmButtonOptions={{
                isLoading: false,
                label: 'confirm',
                onClick: handleSubmit
            }}
        >
            <Typography>
                {tenant?.name}
            </Typography>
        </CustomDialog>
    );
};

export default DeleteTenantDialog;
