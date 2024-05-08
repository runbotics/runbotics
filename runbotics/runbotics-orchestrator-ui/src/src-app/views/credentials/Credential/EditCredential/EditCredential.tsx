import { FC, useEffect, useState } from 'react';

import { useSnackbar } from 'notistack';

import CustomDialog from '#src-app/components/CustomDialog';
import useTranslations, { checkIfKeyExists } from '#src-app/hooks/useTranslations';

import { useDispatch } from '#src-app/store';

import { capitalizeFirstLetter } from '#src-app/utils/text';

import { Content, Form } from '#src-app/views/utils/FormDialog.styles';

import { EditCredentialProps } from './EditCredential.types';
import { InputErrorType, initialFormValidationState, inputErrorMessages } from './EditCredential.utils';
import { GeneralOptions } from './GeneralOptions/GeneralOptions';
import CollectionColorSelect from '../../CredentialsCollection/EditCredentialsCollection/CollectionColor/CollectionColorSelect';
import { Credential } from '../Credential.types';

const EditCredential: FC<EditCredentialProps> = ({
    credential, onAdd, onClose, open,
}) => {
    const [formValidationState, setFormValidationState] = useState(initialFormValidationState);
    const [inputErrorType, setInputErrorType] = useState<InputErrorType>(null);
    const [credentialFormState, setCredentialFormState] = useState<Credential>({...credential });
    const [isNameDirty, setIsNameDirty] = useState<boolean>(false);

    const resetState = () => {
        setCredentialFormState(credential);
        setFormValidationState(initialFormValidationState);
        setInputErrorType(null);
        setIsNameDirty(false);
    };

    const handleClose = () => {
        onClose();
        resetState();
    };

    const { enqueueSnackbar } = useSnackbar();
    const { translate } = useTranslations();
    // const { user: currentUser } = useSelector((state) => state.auth);

    // const isOwner = !process || currentUser.login === process?.createdBy.login || hasFeatureKeyAccess(currentUser, [FeatureKey.PROCESS_COLLECTION_ALL_ACCESS]);

    const checkIsFormValid = () => Object.values(formValidationState).every(Boolean);
    const dispatch = useDispatch();

    useEffect(() => {
        setFormValidationState(initialFormValidationState);
    }, [credential]);

    useEffect(() => {
        if (credentialFormState.name) {
            setIsNameDirty(true);
        }
        if (isNameDirty && (!credentialFormState.name || !credentialFormState.name.trim())) {
            setInputErrorType(InputErrorType.NAME_IS_REQUIRED);
            setFormValidationState(false);
            return;
        }
        setFormValidationState(true);
        setInputErrorType(null);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [credentialFormState.name]);

    const handleSubmit = () => {
        try {
            if (!checkIsFormValid()) {
                enqueueSnackbar(inputErrorMessages[inputErrorType], { variant: 'error' });
                return;
            }
            // if (!credential.id) {
            //     const credentialInfo: Credential = { ...credential };
            //     dispatch(
            //         credentialActions.createCredential(credentialInfo)
            //     ).then((res) => onAdd(res.payload));
            //     return;
            // }
            // if (credentialFormState.collection?.id === null) {
            //     const { collection: _collection, ...rest } = credentialFormState;
            //     onAdd(rest);
            // }
            onAdd(credentialFormState);
        } catch (error) {
            const message = error?.message ?? translate('Credential.Add.Form.Error.General');
            const translationKey = `Process.Add.Form.Error.${capitalizeFirstLetter({ text: error.message, delimiter: ' ' })}`;
            checkIfKeyExists(translationKey)
                ? enqueueSnackbar(
                    translate(translationKey), {
                        variant: 'error'
                    }
                )
                : enqueueSnackbar(
                    message, {
                        variant: 'error'
                    }
                );
        }
    };

    useEffect(() => {
        setCredentialFormState(credential);
    }, [credential]);

    return (
        <CustomDialog
            isOpen={open}
            onClose={handleClose}
            title={credential.id ? translate('Credential.Edit.Title') : translate('Credential.Add.Title')}
            confirmButtonOptions={{
                label: translate('Common.Save'),
                onClick: handleSubmit,
                isDisabled: !checkIsFormValid(),
            }}
            cancelButtonOptions={{
                label: translate('Common.Cancel'),
                onClick: handleClose,
            }}
        >
            <Content sx={{ overflowX: 'hidden' }}>
                <Form $gap={0}>
                    <GeneralOptions
                        credentialData={credentialFormState}
                        setCredentialData={setCredentialFormState}
                        formValidationState={formValidationState}
                        setFormValidationState={setFormValidationState}
                        inputErrorType={inputErrorType}
                        isEditDialogOpen={open}
                        formState={credentialFormState}
                        setFormState={setCredentialFormState}
                        // isOwner={isOwner}
                    />
                    {/* <AccessOptions
                        processData={processFormState}
                        setProcessData={setProcessFormState}
                        isEditDialogOpen={open}
                        isOwner={isOwner}
                    /> */}
                </Form>
            </Content>
        </CustomDialog>
    );
};

export default EditCredential;
