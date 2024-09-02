import { FC, useEffect, useState } from 'react';

import { useSnackbar } from 'notistack';

import CustomDialog from '#src-app/components/CustomDialog';
import If from '#src-app/components/utils/If';
import useTranslations from '#src-app/hooks/useTranslations';
import { useDispatch } from '#src-app/store';

import { credentialCollectionsActions } from '#src-app/store/slices/CredentialCollections';
import { Content, Form } from '#src-app/views/utils/FormDialog.styles';

import { BasicCredentialsCollectionDto, EditCredentialsCollectionDto } from './CredentialsCollection.types';
import {
    getInitialCredentialsCollectionData,
    initialCredentialsCollectionData,
    initialFormValidationState,
    inputErrorMessages,
    InputErrorType,
    mapToEditCredentialCollectionDto
} from './EditCredentialsCollection/EditCredentialsCollection.utils';
import { GeneralOptions } from './EditCredentialsCollection/GeneralOptions/GeneralOptions';
import { SharedWithUsers } from './EditCredentialsCollection/SharedWithUsers/SharedWithUsers';

interface CredentialCollectionModifyDialogProps {
    open: boolean;
    collection: null | BasicCredentialsCollectionDto;
    onClose(event: React.MouseEvent<HTMLElement>): void;
}

const CredentialsCollectionModifyDialog: FC<CredentialCollectionModifyDialogProps> = ({ open: isOpen, onClose, collection }) => {
    const editableCollection = collection ? mapToEditCredentialCollectionDto(collection) : null;
    const { translate } = useTranslations();
    const dispatch = useDispatch();
    const [credentialsCollectionFormState, setCredentialsCollectionFormState] = useState<EditCredentialsCollectionDto>(
        getInitialCredentialsCollectionData(editableCollection)
    );
    const [formValidationState, setFormValidationState] = useState(initialFormValidationState);
    const [inputErrorType, setInputErrorType] = useState<InputErrorType>(null);
    const [collectionData, setCollectionData] = useState<EditCredentialsCollectionDto>(
        getInitialCredentialsCollectionData(editableCollection)
    );

    const { enqueueSnackbar } = useSnackbar();

    useEffect(() => {
        setFormValidationState(initialFormValidationState);
        const updatedCollection = collection ? mapToEditCredentialCollectionDto(collection) : null;
        setCredentialsCollectionFormState(getInitialCredentialsCollectionData(updatedCollection));
    }, [collection]);

    const closeDialog = (event: React.MouseEvent<HTMLElement>) => {
        onClose(event);
        setCredentialsCollectionFormState(collectionData);
        if (!collection) setTimeout(() => clearForm(), 100);
    };

    useEffect(() => {
        if (!credentialsCollectionFormState.name.trim()) {
            setFormValidationState(false);
            setInputErrorType(InputErrorType.NAME_IS_REQUIRED);
            return;
        }

        setInputErrorType(null);
    }, [credentialsCollectionFormState.name]);

    const handleSubmit = async (event: React.MouseEvent<HTMLElement>) => {
        if (inputErrorType) {
            enqueueSnackbar(inputErrorMessages[InputErrorType.NAME_IS_REQUIRED], { variant: 'error' });
            return;
        }

        const action = collection
            ? credentialCollectionsActions.updateCredentialCollection({
                resourceId: collection.id,
                payload: credentialsCollectionFormState as EditCredentialsCollectionDto
            })
            : credentialCollectionsActions.createCredentialCollection({ payload: credentialsCollectionFormState });

        await dispatch(action)
            .unwrap()
            .then(() => {
                dispatch(credentialCollectionsActions.fetchAllCredentialCollections());
                setCredentialsCollectionFormState(collectionData);
                closeDialog(event);
            }).catch((error) => {
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
                isOpen={isOpen}
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
                            credentialsCollectionData={collectionData}
                            setCredentialsCollectionData={setCollectionData}
                            formValidationState={formValidationState}
                            setFormValidationState={setFormValidationState}
                            inputErrorType={inputErrorType}
                            setInputErrorType={setInputErrorType}
                            formState={credentialsCollectionFormState}
                            setFormState={setCredentialsCollectionFormState}
                        />
                        <SharedWithUsers collection={collectionData} setCredentialsCollectionData={setCollectionData} />
                    </Form>
                </Content>
            </CustomDialog>
        </If>
    );
};

export default CredentialsCollectionModifyDialog;
