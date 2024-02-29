
import { FC, useState, useEffect, ChangeEvent, useMemo } from 'react';

import { Button, Dialog, DialogActions, TextField } from '@mui/material';
import { useSearchParams } from 'next/navigation';
import { useSnackbar } from 'notistack';
import { COLLECTION_ID_PARAM, IUser, ProcessCollection, ProcessCollectionKeys, ROOT_PROCESS_COLLECTION_ID, Role } from 'runbotics-common';

import { hasRoleAccess } from '#src-app/components/utils/Secured';
import useTranslations from '#src-app/hooks/useTranslations';
import { useDispatch, useSelector } from '#src-app/store';
import { processCollectionActions } from '#src-app/store/slices/ProcessCollection/ProcessCollection.slice';
import { usersActions } from '#src-app/store/slices/Users';
import { User } from '#src-app/types/user';
import { capitalizeFirstLetter } from '#src-app/utils/text';

import AccessOptions from './AccessOptions/';
import { ProcessCollectionModifyDialogProps } from './ProcessCollectionModifyDialog.types';
import { Content, Form, Title } from '../../../utils/FormDialog.styles';
import { checkTranslationKey, completeCollectionEntity, prepareIncompleteCollectionEntity } from '../ProcessCollection.utils';

const CREATE_COLLECTION_REJECTED_TYPE = 'processCollection/createCollection/rejected';
const UPDATE_COLLECTION_REJECTED_TYPE = 'processCollection/createCollection/{id}/rejected';

const ProcessCollectionModifyDialog: FC<ProcessCollectionModifyDialogProps> = ({ open: isOpen, onClose, collection }) => {
    const { translate } = useTranslations();
    const { enqueueSnackbar } = useSnackbar();
    const dispatch = useDispatch();
    const currentCollectionId = useSearchParams().get(COLLECTION_ID_PARAM) ?? ROOT_PROCESS_COLLECTION_ID;

    const { all: allUsers } = useSelector((state) => state.users);
    const { user: currentUser } = useSelector((state) => state.auth);

    const [initialCollectionData, setInitialCollectionData] = useState<ProcessCollection>(prepareIncompleteCollectionEntity(currentUser, currentCollectionId, collection));
    const [collectionData, setCollectionData] = useState<ProcessCollection>(initialCollectionData);

    const usersWithoutAdmin = useMemo(() => allUsers.filter((user: IUser) => !hasRoleAccess(user as User, [Role.ROLE_ADMIN])), [allUsers]);

    const isOwner = !collection || currentUser.login === collection?.createdBy.login || hasRoleAccess(currentUser, [Role.ROLE_ADMIN]);
    const isUpdated = Boolean(collection);

    useEffect(() => {
        if (isOpen) dispatch(usersActions.getAllLimited());

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
        ? dispatch(processCollectionActions.updateOne({ id: collection.id, body, parentId: currentCollectionId}))
        : dispatch(processCollectionActions.createOne({ body, parentId: currentCollectionId }));

    const handleSubmit = async () => {
        const body = completeCollectionEntity(collectionData);
        const { type: responseType, payload } = await updateCollection(body);
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
            // await dispatch(processCollectionActions.getByPage(pageParams));
            onClose();
            clearForm();
        }
    };

    const handleFormPropertyChange = <Key extends ProcessCollectionKeys>(
        propertyName: Key,
        value: ProcessCollection[Key]
    ) => setCollectionData({ ...collectionData, [propertyName]: value });

    return (
        <Dialog
            open={isOpen}
            onClose={() => {
                onClose();
                setTimeout(() => clearForm(), 500);
            }}
        >
            <Title>{translate(`Process.Collection.Dialog.Modify.${collection ? 'Edit' : 'Create'}.Title`)}</Title>
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
                        usersWithoutAdmin={usersWithoutAdmin}
                        isModifyDialogOpen={isOpen}
                    />
                </Form>
            </Content>
            <DialogActions>
                <Button
                    color="primary"
                    onClick={() => {
                        onClose();
                        setTimeout(() => clearForm(), 500);
                    }}
                >
                    {translate('Common.Cancel')}
                </Button>
                <Button type="submit" variant="contained" color="primary" autoFocus onClick={() => handleSubmit()}>
                    {translate('Common.Save')}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default ProcessCollectionModifyDialog;
