import { FC, useEffect, useState } from 'react';

import CustomDialog from '#src-app/components/CustomDialog';
import useAuth from '#src-app/hooks/useAuth';
import useTranslations from '#src-app/hooks/useTranslations';
import { useDispatch } from '#src-app/store';

import { credentialCollectionsActions } from '#src-app/store/slices/CredentialCollections';
import { Content, Form } from '#src-app/views/utils/FormDialog.styles';

import { BasicCredentialsCollectionDto, EditCredentialsCollectionDto } from './CredentialsCollection.types';
import {
    getInitialCredentialsCollectionData,
    initialCredentialsCollectionData,
    initialFormValidationState,
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
    const { user: currentUser } = useAuth();
    const [credentialsCollectionFormState, setCredentialsCollectionFormState] = useState<EditCredentialsCollectionDto>(
        getInitialCredentialsCollectionData(editableCollection)
    );
    const [formValidationState, setFormValidationState] = useState(initialFormValidationState);
    const [inputErrorType, setInputErrorType] = useState<InputErrorType>(null);
    const [collectionData, setCollectionData] = useState<EditCredentialsCollectionDto>(
        getInitialCredentialsCollectionData(editableCollection)
    );
    const isOwner = collection ? parseInt(collection.createdById) === currentUser.id : true;

    const closeDialog = (event: React.MouseEvent<HTMLElement>) => {
        onClose(event);
        setTimeout(() => clearForm(), 1000);
    };

    useEffect(() => {
        dispatch(credentialCollectionsActions.fetchAllCredentialCollections());
    }, [dispatch, collection]);

    const handleSubmit = (event: React.MouseEvent<HTMLElement>) => {
        collection
            ? dispatch(
                credentialCollectionsActions.updateCredentialCollection({
                    resourceId: collection.id,
                    payload: collectionData as EditCredentialsCollectionDto
                })
            )
            : dispatch(credentialCollectionsActions.createCredentialCollection({ payload: collectionData }));
        onClose(event);
    };

    const clearForm = () => {
        setCollectionData(initialCredentialsCollectionData);
    };

    return (
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
                        formState={credentialsCollectionFormState}
                        setFormState={setCredentialsCollectionFormState}
                        // isOwner={isOwner}
                    />
                    <SharedWithUsers collection={collectionData} setCredentialsCollectionData={setCollectionData} />
                </Form>
            </Content>
        </CustomDialog>
    );
};

export default CredentialsCollectionModifyDialog;
