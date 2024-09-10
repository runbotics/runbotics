import { VFC, useState, useEffect } from 'react';

import { Typography } from '@mui/material';
import { useSnackbar } from 'notistack';
import { Tenant } from 'runbotics-common';

import CustomDialog from '#src-app/components/CustomDialog';
import useTenantSearch from '#src-app/hooks/useTenantSearch';
import useTranslations from '#src-app/hooks/useTranslations';
import { useDispatch, useSelector } from '#src-app/store';
import { tenantsActions, tenantsSelector } from '#src-app/store/slices/Tenants';
import modalsActionsTranslations from '#src-app/translations/en/tenants/actions/modals';

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

    const { loading } = useSelector(tenantsSelector);
    const { refreshSearch } = useTenantSearch();
    const [tenantId, setTenantId] = useState(null);

    const handleSubmit = () => {
        dispatch(tenantsActions.deleteOne(tenantId))
            .unwrap()
            .then(() => {
                onClose();
                onDelete();
                enqueueSnackbar(
                    translate('Tenants.Actions.Modals.DeleteModal.Message.Success'),
                    { variant: 'success' }
                );
                refreshSearch();
            })
            .catch(({ error }) => {
                onClose();
                enqueueSnackbar(
                    translate(
                        `Tenants.Actions.Modals.DeleteModal.Message.Fail${error ? `.${error}` : ''}` as keyof typeof modalsActionsTranslations
                    ),
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
            title={translate('Tenants.Actions.Modals.DeleteModal.TitleMessage')}
            cancelButtonOptions={{
                isDisabled: loading,
                label: translate('Common.Cancel'),
                onClick: onClose
            }}
            confirmButtonOptions={{
                isLoading: loading,
                label: translate('Common.Delete'),
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
