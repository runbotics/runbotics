import { ChangeEvent, useState, VFC, useContext } from 'react';

import { Button, Dialog, DialogActions, TextField } from '@mui/material';
import { useSnackbar } from 'notistack';

import If from '#src-app/components/utils/If';
import useTenantSearch from '#src-app/hooks/useTenantSearch';
import useTranslations from '#src-app/hooks/useTranslations';
import { useDispatch } from '#src-app/store';
import { tenantsActions } from '#src-app/store/slices/Tenants';

import { Content, Form, Title } from '../utils/FormDialog.styles';
import { TablePagingContext } from '../utils/TablePaging.provider';

interface CreateTenantDialogProps {
    open: boolean;
    onClose: () => void;
}

const CreateTenantDialog: VFC<CreateTenantDialogProps> = ({
    open,
    onClose
}) => {
    const { translate } = useTranslations();
    const { enqueueSnackbar } = useSnackbar();
    const dispatch = useDispatch();

    const { page, pageSize } = useContext(TablePagingContext);
    const { refreshSearch } = useTenantSearch({ page, pageSize });

    const [name, setName] = useState(undefined);
    const isFieldEmpty = name?.trim() === '';
    const isNameTooShort = name?.trim().length > 0 && name?.trim().length < 2;

    const handleNameInputChange = (event: ChangeEvent<HTMLInputElement>) => {
        setName(event.target.value);
    };

    const handleClose = () => {
        setName('');
        onClose();
    };

    const handleSubmit = () => {
        dispatch(tenantsActions.createOne({ name }))
            .unwrap()
            .then(() => {
                handleClose();
                enqueueSnackbar(
                    translate('Tenants.Actions.Modals.CreateModal.Message.Success'),
                    { variant: 'success' }
                );
                refreshSearch();
            })
            .catch(() => {
                enqueueSnackbar(
                    translate('Tenants.Actions.Modals.CreateModal.Message.Fail'),
                    { variant: 'error' }
                );
                handleClose();
            });
    };

    return (
        <If condition={open}>
            <Dialog open>
                <Title>
                    {translate('Tenants.Actions.Modals.CreateModal.TitleMessage')}
                </Title>
                <Content>
                    <Form>
                        <TextField
                            label={translate('Tenants.Actions.Modals.CreateModal.Field.Name')}
                            value={name}
                            onChange={handleNameInputChange}
                            error={isFieldEmpty || isNameTooShort}
                            {...(isFieldEmpty && { helperText: translate('Tenants.List.Edit.Form.Error.FieldRequired') })}
                            {...(isNameTooShort && { helperText: translate('Tenants.List.Edit.Form.Error.FieldTooShort') })}

                        />
                    </Form>
                </Content>
                <DialogActions>
                    <Button
                        onClick={handleClose}
                    >
                        {translate('Common.Close')}
                    </Button>
                    <Button
                        variant='contained'
                        onClick={handleSubmit}
                        disabled={!name || isFieldEmpty}
                    >
                        {translate('Tenants.Actions.Modals.CreateModal.Button.Create')}
                    </Button>
                </DialogActions>
            </Dialog>
        </If>
    );
};

export default CreateTenantDialog;
