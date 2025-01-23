
import { FC, useState, useEffect, ChangeEvent, useMemo } from 'react';

import { TextField } from '@mui/material';
import { useSearchParams } from 'next/navigation';
import { useSnackbar } from 'notistack';
import { COLLECTION_ID_PARAM, FeatureKey, ProcessCollection, ProcessCollectionKeys, ROOT_PROCESS_COLLECTION_ID } from 'runbotics-common';

import CustomDialog from '#src-app/components/CustomDialog';
import { hasFeatureKeyAccess } from '#src-app/components/utils/Secured';
import useTranslations from '#src-app/hooks/useTranslations';
import { useDispatch, useSelector } from '#src-app/store';
import { processCollectionActions } from '#src-app/store/slices/ProcessCollection/ProcessCollection.slice';
import { usersActions } from '#src-app/store/slices/Users';
import { capitalizeFirstLetter } from '#src-app/utils/text';

import AccessOptions from './AccessOptions/';
import { ProcessCollectionModifyDialogProps } from './ProcessCollectionModifyDialog.types';
import { Content, Form } from '../../../utils/FormDialog.styles';
import { checkTranslationKey, completeCollectionEntity, prepareIncompleteCollectionEntity } from '../ProcessCollection.utils';

const CREATE_COLLECTION_REJECTED_TYPE = 'processCollection/createCollection/rejected';
const UPDATE_COLLECTION_REJECTED_TYPE = 'processCollection/createCollection/{id}/rejected';

const ProcessCollectionModifyDialog: FC<ProcessCollectionModifyDialogProps> = ({ open: isOpen, onClose, collection }) => {
    const { translate } = useTranslations();
    const { enqueueSnackbar } = useSnackbar();
    const dispatch = useDispatch();
    const currentCollectionId = useSearchParams().get(COLLECTION_ID_PARAM) ?? ROOT_PROCESS_COLLECTION_ID;

    const { tenantActivated } = useSelector((state) => state.users);
    const { user: currentUser } = useSelector((state) => state.auth);

    const [initialCollectionData, setInitialCollectionData] = useState<ProcessCollection>(prepareIncompleteCollectionEntity(currentUser, currentCollectionId, collection));
    const [collectionData, setCollectionData] = useState<ProcessCollection>(initialCollectionData);

    const shareableUsers = useMemo(() => ({
        loading: tenantActivated.loading,
        all: tenantActivated.all.filter(user => user.id !== currentUser.id)
    }), [tenantActivated, currentUser.id]);

    const isOwner = !collection || currentUser.id === collection?.createdBy?.id || hasFeatureKeyAccess(currentUser, [FeatureKey.PROCESS_COLLECTION_ALL_ACCESS]);
    const isUpdated = Boolean(collection);

    useEffect(() => {
        if (isOpen) dispatch(usersActions.getAllUsersInTenant());
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isOpen]);

    useEffect(() => {
        setInitialCollectionData(prepareIncompleteCollectionEntity(currentUser, currentCollectionId, collection));
    }, [collection, currentUser, currentCollectionId]);

    useEffect(() => {
        setCollectionData(initialCollectionData);
    }, [initialCollectionData]);

    const clearForm = () => {
        setCollectionData(initialCollectionData);
    };

    const updateCollection = (body) => collection
        ? dispatch(processCollectionActions.updateOne({ id: body.id, body, parentId: currentCollectionId}))
        : dispatch(processCollectionActions.createOne({ body, parentId: currentCollectionId }));

    const handleSubmit = async () => {
        const body = completeCollectionEntity(collectionData);
        const { type: responseType, payload } = await updateCollection(body);
        // @ts-ignore
        const { detail, status, errorKey } = payload?.response?.data || {};

        if (responseType === CREATE_COLLECTION_REJECTED_TYPE || responseType === UPDATE_COLLECTION_REJECTED_TYPE) {
            const translationPrefix = 'Process.Collection.Dialog.Modify.Form.ErrorMessage';
            const translateKey = `${translationPrefix}.${errorKey ? capitalizeFirstLetter({ text: errorKey }) : ''}`;
            const errorMessage =
                checkTranslationKey(translateKey)
                    ? translate(translateKey)
                    : translate(`${translationPrefix}.Default`, { detail, status });
            enqueueSnackbar((errorMessage), {
                variant: 'error',
                autoHideDuration: 15000,
            });
        } else {
            const successMessage = isUpdated
                ? translate('Process.Collection.Dialog.Update.Success')
                : translate('Process.Collection.Dialog.Create.Success');

            enqueueSnackbar((successMessage), {
                variant: 'success',
                autoHideDuration: 5000,
            });
            onClose();
            clearForm();
        }
    };

    const handleFormPropertyChange = <Key extends ProcessCollectionKeys>(
        propertyName: Key,
        value: ProcessCollection[Key]
    ) => setCollectionData({ ...collectionData, [propertyName]: value });

    const closeDialog = () => {
        onClose();
        setTimeout(() => clearForm(), 1000);
    };

    return (
        <CustomDialog
            isOpen={isOpen}
            onClose={closeDialog}
            title={translate(`Process.Collection.Dialog.Modify.${collection ? 'Edit' : 'Create'}.Title`)}
            confirmButtonOptions={{
                label: translate('Common.Save'),
                onClick: handleSubmit,
                isDisabled: !isOwner,
            }}
            cancelButtonOptions={{
                onClick: closeDialog,
            }}
        >
            <Content sx={{ overflowX: 'hidden' }}>
                <Form>
                    <TextField
                        label={translate('Process.Collection.Dialog.Modify.Form.Name.Label')}
                        required
                        disabled={!isOwner}
                        onChange={(e: ChangeEvent<HTMLInputElement>) => handleFormPropertyChange('name', e.target.value)}
                        value={collectionData.name}
                        size="small"
                        fullWidth
                    />
                    <TextField
                        label={translate('Process.Collection.Dialog.Modify.Form.Description.Label')}
                        disabled={!isOwner}
                        onChange={(e: ChangeEvent<HTMLInputElement>) => handleFormPropertyChange('description', e.target.value)}
                        size="small"
                        value={collectionData.description}
                        fullWidth
                    />
                    <AccessOptions
                        collectionData={collectionData}
                        handleChange={handleFormPropertyChange}
                        isOwner={isOwner}
                        shareableUsers={shareableUsers}
                        isModifyDialogOpen={isOpen}
                    />
                </Form>
            </Content>
        </CustomDialog>

    );
};

export default ProcessCollectionModifyDialog;
