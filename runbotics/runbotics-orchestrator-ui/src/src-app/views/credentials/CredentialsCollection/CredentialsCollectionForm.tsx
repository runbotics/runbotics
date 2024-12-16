import { FC, useEffect, useState } from 'react';

import { useSnackbar } from 'notistack';

import { FrontCredentialCollectionDto } from 'runbotics-common';

import CustomDialog from '#src-app/components/CustomDialog';
import If from '#src-app/components/utils/If';
import useTranslations from '#src-app/hooks/useTranslations';
import { useDispatch } from '#src-app/store';

import { credentialCollectionsActions } from '#src-app/store/slices/CredentialCollections';
import { Content, Form } from '#src-app/views/utils/FormDialog.styles';

import { EditCredentialsCollectionDto } from './CredentialsCollection.types';
import {
    getInitialCredentialsCollectionData,
    initialCredentialsCollectionData,
    initialFormValidationState,
    inputErrorMessages,
    InputErrorType,
    adjustShareWithProperty,
    mapToEditCredentialCollectionDto
} from './EditCredentialsCollection/EditCredentialsCollection.utils';
import { GeneralOptions } from './EditCredentialsCollection/GeneralOptions/GeneralOptions';
import { SharedWithUsers } from './EditCredentialsCollection/SharedWithUsers/SharedWithUsers';

interface CredentialCollectionFormProps {
    open: boolean;
    collection: FrontCredentialCollectionDto | null;
    onClose: () => void;
    pageSize: number;
}

const CredentialsCollectionForm: FC<CredentialCollectionFormProps> = ({ open: isOpen, onClose, collection, pageSize }) => {
    const { translate } = useTranslations();
    const dispatch = useDispatch();
    const { enqueueSnackbar } = useSnackbar();

    const editableCollection = collection ? mapToEditCredentialCollectionDto(collection) : null;
    const [credentialsCollectionFormState, setCredentialsCollectionFormState] = useState<EditCredentialsCollectionDto>(
        getInitialCredentialsCollectionData(editableCollection)
    );
    const [formValidationState, setFormValidationState] = useState(initialFormValidationState);
    const [inputErrorType, setInputErrorType] = useState<InputErrorType>(null);
    const [collectionData, setCollectionData] = useState<EditCredentialsCollectionDto>(
        getInitialCredentialsCollectionData(editableCollection)
    );

    useEffect(() => {
        const updatedCollection = collection ? mapToEditCredentialCollectionDto(collection) : null;
        setCredentialsCollectionFormState(getInitialCredentialsCollectionData(updatedCollection));
    }, [collection]);

    useEffect(() => {
        if (!credentialsCollectionFormState.name.trim() && !collectionData.name) {
            setFormValidationState((prevState) => ({
                ...prevState,
                name: false
            }));
        } else if (credentialsCollectionFormState.name.trim()) {
            setInputErrorType(null);
        }
    }, [credentialsCollectionFormState, collectionData, inputErrorType]);

    const closeDialog = () => {
        onClose();
        setCredentialsCollectionFormState(collectionData);
        if (collection) setFormValidationState(initialFormValidationState);
        if (!collection) setTimeout(() => clearForm(), 100);
    };

    const handleSubmit = async () => {
        if (credentialsCollectionFormState.name.trim() === '' || inputErrorType) {
            enqueueSnackbar(inputErrorMessages[InputErrorType.NAME_IS_REQUIRED], { variant: 'error' });
            return;
        }

        const credentialCollectionObject = adjustShareWithProperty(credentialsCollectionFormState);

        const action = collection
            ? credentialCollectionsActions.updateCredentialCollection({
                resourceId: collection.id,
                payload: credentialCollectionObject
            })
            : credentialCollectionsActions.createCredentialCollection({ payload: credentialCollectionObject });

        await dispatch(action)
            .unwrap()
            .then(() => {
                dispatch(credentialCollectionsActions.fetchAllCredentialCollectionsByPage({ pageParams: { page: 0, pageSize } }));
                const successMessage = collection
                    ? translate('Credential.Form.Create.Success', { name: credentialsCollectionFormState.name })
                    : translate('Credential.Form.Edit.Success', { name: credentialsCollectionFormState.name });
                enqueueSnackbar(successMessage, { variant: 'success' });
                closeDialog();
            })
            .catch(error => {
                enqueueSnackbar(error.message, { variant: 'error' });
            });
    };

    const clearForm = () => {
        setCollectionData(initialCredentialsCollectionData);
        setFormValidationState(initialFormValidationState);
        setInputErrorType(null);
    };

    return (
        <If condition={isOpen}>
            <CustomDialog
                isOpen={true}
                onClose={closeDialog}
                title={translate(`Credentials.Collection.Dialog.Modify.${collection ? 'Edit' : 'Create'}.Title`)}
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
                        <GeneralOptions
                            formValidationState={formValidationState}
                            setFormValidationState={setFormValidationState}
                            inputErrorType={inputErrorType}
                            setInputErrorType={setInputErrorType}
                            formState={credentialsCollectionFormState}
                            setFormState={setCredentialsCollectionFormState}
                        />
                        <SharedWithUsers
                            credentialsCollectionFormState={credentialsCollectionFormState}
                            setCredentialsCollectionFormState={setCredentialsCollectionFormState}
                        />
                    </Form>
                </Content>
            </CustomDialog>
        </If>
    );
};

export default CredentialsCollectionForm;
