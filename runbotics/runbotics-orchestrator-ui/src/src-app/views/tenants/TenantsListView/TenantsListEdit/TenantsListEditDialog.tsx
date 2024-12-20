import { VFC, useState, useEffect, useContext } from 'react';

import { LoadingButton } from '@mui/lab';
import { Box, Dialog } from '@mui/material';
import { useSnackbar } from 'notistack';
import { Tenant } from 'runbotics-common';


import If from '#src-app/components/utils/If';
import useTenantSearch from '#src-app/hooks/useTenantSearch';
import useTranslations from '#src-app/hooks/useTranslations';
import { useDispatch, useSelector } from '#src-app/store';
import { tenantsActions, tenantsSelector } from '#src-app/store/slices/Tenants';
import englishEditListTranslations from '#src-app/translations/en/tenants/list/edit';
import { Form, Title, Content } from '#src-app/views/utils/FormDialog.styles';

import { TablePagingContext } from '#src-app/views/utils/TablePaging.provider';

import { DeleteButton, StyledButton, StyledDialogActions } from './TenantListEdit.styles';
import { FormValidationState, TenantsListEditDialogProps } from './TenantsListEdit.types';
import {
    getTenantDataWithoutEmptyStrings,
    getTenantDataWithoutNulls,
    initialValidationState
} from './TenantsListEdit.utils';
import TenantsListEditForm from './TenantsListEditForm';
import DeleteTenantDialog from '../../DeleteTenantDialog';

const TenantsListEditDialog: VFC<TenantsListEditDialogProps> = ({
    open, onClose, tenantData
}) => {
    const dispatch = useDispatch();
    const { translate } = useTranslations();
    const { enqueueSnackbar } = useSnackbar();

    const { page, pageSize } = useContext(TablePagingContext);
    const { refreshSearch } = useTenantSearch({ page, pageSize });

    const { loading } = useSelector(tenantsSelector);
    const [tenant, setTenant] = useState<Tenant>(tenantData);
    const [formValidationState, setFormValidationState] = useState<FormValidationState>(initialValidationState);
    const [isDeleteDialogVisible, setIsDeleteDialogVisible] = useState(false);

    const handleOpenDeleteDialog = () => {
        setIsDeleteDialogVisible(true);
    };

    const handleCloseDeleteDialog = () => {
        setIsDeleteDialogVisible(false);
    };

    const checkFormFieldsValidation = () => Object.values(formValidationState).every(Boolean);

    const handleClose = () => {
        onClose();
        setFormValidationState(initialValidationState);
        setTenant(getTenantDataWithoutNulls(tenantData));
    };

    const handleSave = () => {
        if (!checkFormFieldsValidation()) return;

        const dataPayload = getTenantDataWithoutEmptyStrings(tenant);

        dispatch(tenantsActions.partialUpdate(
            dataPayload
        )).unwrap()
            .then(() => {
                handleClose();
                enqueueSnackbar(
                    translate('Tenants.List.Edit.Form.Event.Success'),
                    { variant: 'success' }
                );
                refreshSearch();
            })
            .catch(({ errorKey }) => {
                handleClose();
                enqueueSnackbar(
                    translate(
                        `Tenants.List.Edit.Form.Event.Error${errorKey ? `.${errorKey}` : ''}` as keyof typeof englishEditListTranslations
                    ),
                    { variant: 'error' }
                );
            });
    };

    useEffect(() => {
        setTenant(getTenantDataWithoutNulls(tenantData));
    }, [tenantData]);

    return (
        <>
            <DeleteTenantDialog
                open={isDeleteDialogVisible}
                onClose={handleCloseDeleteDialog}
                onDelete={handleClose}
                tenant={tenant}
            />
            <If condition={open}>
                <Dialog open>
                    <Title>
                        {translate('Tenants.List.Edit.Form.Title')}
                    </Title>
                    <Content>
                        <Form>
                            <TenantsListEditForm
                                tenant={tenant}
                                setTenant={setTenant}
                                formValidationState={formValidationState}
                                setFormValidationState={setFormValidationState}
                                currentTenantName={tenantData?.name}
                            />
                        </Form>
                    </Content>
                    <StyledDialogActions>
                        <DeleteButton
                            variant='contained'
                            onClick={handleOpenDeleteDialog}
                            loading={loading}
                        >
                            {translate('Common.Delete')}
                        </DeleteButton>
                        <Box>
                            <StyledButton
                                onClick={handleClose}
                                disabled={loading}
                            >
                                {translate('Common.Cancel')}
                            </StyledButton>
                            <LoadingButton
                                variant='contained'
                                onClick={handleSave}
                                loading={loading}
                                disabled={!checkFormFieldsValidation()}
                            >
                                {translate('Common.Save')}
                            </LoadingButton>
                        </Box>
                    </StyledDialogActions>
                </Dialog>
            </If>
        </>
    );
};

export default TenantsListEditDialog;
