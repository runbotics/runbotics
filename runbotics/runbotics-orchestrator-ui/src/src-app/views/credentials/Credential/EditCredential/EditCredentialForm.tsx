import { FC, useContext, useState } from 'react';

import { Grid, Typography, TextField } from '@mui/material';

import { useSnackbar } from 'notistack';

import { FrontCredentialDto } from 'runbotics-common';

import CustomDialog from '#src-app/components/CustomDialog';
import If from '#src-app/components/utils/If';
import useTranslations from '#src-app/hooks/useTranslations';

import { useDispatch } from '#src-app/store';
import { credentialsActions } from '#src-app/store/slices/Credentials';
import { Content, Form } from '#src-app/views/utils/FormDialog.styles';

import { inputErrorMessages, InputErrorType } from './EditCredential.utils';
import { PagingContext } from '../../GridView/Paging.provider';

interface EditCredentialFormProps {
    open: boolean;
    credential: FrontCredentialDto;
    collectionId: string;
    onClose: () => void;
}

export const EditCredentialForm: FC<EditCredentialFormProps> = ({ open: isOpen, onClose, credential, collectionId }) => {
    const { translate } = useTranslations();
    const dispatch = useDispatch();
    const { enqueueSnackbar } = useSnackbar();
    const { pageSize } = useContext(PagingContext);

    const [credentialFormState, setCredentialFormState] = useState({ name: credential.name, description: credential.description });
    const [isFormValid, setIsFormValid] = useState(true);

    const closeDialog = () => {
        onClose();
    };
    const handleSubmit = () => {
        if (!isFormValid) {
            enqueueSnackbar(inputErrorMessages[InputErrorType.NAME_IS_REQUIRED], { variant: 'error' });
            return;
        }

        const payload = {
            name: credentialFormState.name,
            description: credentialFormState.description.trim()
        };

        dispatch(credentialsActions.updateCredential({ resourceId: `${collectionId}/credentials/${credential.id}`, payload }))
            .unwrap()
            .then(() => {
                enqueueSnackbar(translate('Credential.Form.Edit.Success', { name: credentialFormState.name }), { variant: 'success' });
                dispatch(
                    credentialsActions.fetchAllCredentialsAccessibleInTenantByPage({
                        pageParams: {
                            page: 0,
                            size: pageSize,
                            filter: {
                                equals: {
                                    collectionId: collectionId ? collectionId : ''
                                }
                            }
                        }
                    })
                );
                closeDialog();
            })
            .catch(error => {
                enqueueSnackbar(error.message, { variant: 'error' });
            });
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;

        setCredentialFormState(prevState => ({
            ...prevState,
            [name]: value
        }));

        if (name === 'name') {
            value.trim() === '' ? setIsFormValid(false) : setIsFormValid(true);
        }
    };

    return (
        <If condition={isOpen}>
            <CustomDialog
                isOpen={true}
                onClose={closeDialog}
                title={translate('Credential.Dialog.Modify.Edit.Title')}
                confirmButtonOptions={{
                    label: translate('Common.Save'),
                    onClick: handleSubmit
                }}
                cancelButtonOptions={{
                    onClick: closeDialog
                }}
            >
                <Content sx={{ overflowX: 'hidden', padding: 0 }}>
                    <Form $gap={0}>
                        <Grid container spacing={2}>
                            <Grid item xs={12}>
                                <Typography variant="h5">{translate('Credential.GeneralInfo.Title')}</Typography>
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    label={translate('Credential.Details.Name.Label')}
                                    required
                                    name="name"
                                    InputLabelProps={{ shrink: true }}
                                    value={credentialFormState.name}
                                    onChange={handleInputChange}
                                    error={!isFormValid}
                                    helperText={!isFormValid && inputErrorMessages.NAME_IS_REQUIRED}
                                ></TextField>
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    label={translate('Credential.Details.Description.Label')}
                                    multiline
                                    name="description"
                                    value={credentialFormState.description}
                                    onChange={handleInputChange}
                                ></TextField>
                            </Grid>
                        </Grid>
                    </Form>
                </Content>
            </CustomDialog>
        </If>
    );
};
