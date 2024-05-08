import { FC, useEffect, useState } from 'react';

import { useSnackbar } from 'notistack';

import CustomDialog from '#src-app/components/CustomDialog';
import useTranslations, { checkIfKeyExists } from '#src-app/hooks/useTranslations';

import { useDispatch } from '#src-app/store';

import { capitalizeFirstLetter } from '#src-app/utils/text';

import { Content, Form } from '#src-app/views/utils/FormDialog.styles';

import CollectionColorSelect from './CollectionColor/CollectionColorSelect';
import { EditCredentialsCollectionProps } from './EditCredentialCollection.types';
import { InputErrorType, initialFormValidationState, inputErrorMessages } from './EditCredentialsCollection.utils';
import { GeneralOptions } from './GeneralOptions/GeneralOptions';
import { CredentialsCollection } from '../CredentialsCollection.types';

const EditCredentialsCollection: FC<EditCredentialsCollectionProps> = ({
    collection, onAdd, onClose, open,
}) => {
    const [formValidationState, setFormValidationState] = useState(initialFormValidationState);
    const [inputErrorType, setInputErrorType] = useState<InputErrorType>(null);
    const [credentialsCollectionFormState, setCredentialsCollectionFormState] = useState<CredentialsCollection>({...collection });
    const [isNameDirty, setIsNameDirty] = useState<boolean>(false);

    const resetState = () => {
        setCredentialsCollectionFormState(collection);
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
    }, [collection]);

    useEffect(() => {
        if (credentialsCollectionFormState.name) {
            setIsNameDirty(true);
        }
        if (isNameDirty && (!credentialsCollectionFormState.name || !credentialsCollectionFormState.name.trim())) {
            setInputErrorType(InputErrorType.NAME_IS_REQUIRED);
            setFormValidationState(false);
            return;
        }
        setFormValidationState(true);
        setInputErrorType(null);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [credentialsCollectionFormState.name]);

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
            onAdd(credentialsCollectionFormState);
        } catch (error) {
            const message = error?.message ?? translate('Credentials.Collection.Add.Form.Error.General');
            const translationKey = `Credentials.Collection.Add.Form.Error.${capitalizeFirstLetter({ text: error.message, delimiter: ' ' })}`;
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
        setCredentialsCollectionFormState(collection);
    }, [collection]);

    return (
        <CustomDialog
            isOpen={open}
            onClose={handleClose}
            title={collection.id ? translate('Credentials.Collection.Edit.Title') : translate('Credentials.Collection.Add')}
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
                        credentialsCollectionData={credentialsCollectionFormState}
                        setCredentialsCollectionData={setCredentialsCollectionFormState}
                        formValidationState={formValidationState}
                        setFormValidationState={setFormValidationState}
                        inputErrorType={inputErrorType}
                        isEditDialogOpen={open}
                        formState={credentialsCollectionFormState}
                        setFormState={setCredentialsCollectionFormState}
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

export default EditCredentialsCollection;
