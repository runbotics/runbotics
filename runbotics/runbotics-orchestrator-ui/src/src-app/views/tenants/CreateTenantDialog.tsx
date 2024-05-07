import { ChangeEvent, useState, VFC } from 'react';

import { Button, Dialog, DialogActions, TextField } from '@mui/material';
import { useSnackbar } from 'notistack';

import If from '#src-app/components/utils/If';
import useTenantSearch from '#src-app/hooks/useTenantSearch';
import useTranslations from '#src-app/hooks/useTranslations';
import { useDispatch } from '#src-app/store';
import { tenantsActions } from '#src-app/store/slices/Tenants';

import { Content, Form, Title } from '../utils/FormDialog.styles';

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

    const { refreshSearch } = useTenantSearch();
    const [name, setName] = useState('');
    const isFieldEmpty = !(name.trim() !== '');

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
                            error={isFieldEmpty}
                            {...(isFieldEmpty && { helperText: translate('Tenants.List.Edit.Form.Error.FieldRequired') })}
                        />
                    </Form>
                </Content>
                <DialogActions>
                    <Button
                        onClick={handleClose}
                    >
                        {translate('Tenants.Actions.Modals.CreateModal.Button.Close')}
                    </Button>
                    <Button
                        variant='contained'
                        onClick={handleSubmit}
                        disabled={isFieldEmpty}
                    >
                        {translate('Tenants.Actions.Modals.CreateModal.Button.Create')}
                    </Button>
                </DialogActions>
            </Dialog>
        </If>
    );
};

export default CreateTenantDialog;
