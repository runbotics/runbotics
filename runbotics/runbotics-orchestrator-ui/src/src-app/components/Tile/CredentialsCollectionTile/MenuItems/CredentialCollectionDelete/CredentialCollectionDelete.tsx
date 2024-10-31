import React, { FC } from 'react';

import { useSnackbar } from 'notistack';

import { FrontCredentialCollectionDto } from 'runbotics-common';

import CustomDialog from '#src-app/components/CustomDialog';
import If from '#src-app/components/utils/If';
import useTranslations from '#src-app/hooks/useTranslations';
import { useDispatch } from '#src-app/store';
import { credentialCollectionsActions } from '#src-app/store/slices/CredentialCollections';
import { deleteCredentialCollections } from '#src-app/store/slices/CredentialCollections/CredentialCollections.thunks';

interface CredentialCollectionDeleteProps {
    collection: FrontCredentialCollectionDto;
    isDialogOpen: boolean;
    handleDialogClose(): void;
    pageSize: number;
}

export const CredentialCollectionDelete: FC<CredentialCollectionDeleteProps> = ({ collection, isDialogOpen, handleDialogClose, pageSize }) => {
    const dispatch = useDispatch();
    const { translate } = useTranslations();
    const { enqueueSnackbar } = useSnackbar();

    const handleDelete = () => {
        if (collection.credentials && collection.credentials.length > 0) {
            enqueueSnackbar(translate('Credentials.Collection.Tile.MenuItem.Delete.ConfirmationDialog.Warning'), { variant: 'error' });
            return;
        }

        dispatch(deleteCredentialCollections({ resourceId: collection.id }))
            .unwrap()
            .then(() => {
                enqueueSnackbar(translate('Credentials.Collection.Tile.MenuItem.Delete.Success', { name: collection.name }), {
                    variant: 'success'
                });
                dispatch(credentialCollectionsActions.fetchAllCredentialCollectionsByPage({ pageParams: {page: 0, pageSize }}));
            })
            .catch(error => {
                if (error.statusCode === 409) {
                    enqueueSnackbar(error.message, { variant: 'error' });
                } else {
                    enqueueSnackbar(translate('Credentials.Collection.Tile.MenuItem.Delete.Fail', { name: collection.name }), {
                        variant: 'error'
                    });
                }
            });

        handleDialogClose();
    };

    return (
        <If condition={isDialogOpen}>
            <CustomDialog
                isOpen={true}
                title={translate('Credentials.Collection.Tile.MenuItem.Delete.ConfirmationDialog.Title', { name: collection.name })}
                onClose={() => handleDialogClose()}
                confirmButtonOptions={{ onClick: handleDelete }}
                cancelButtonOptions={{ onClick: handleDialogClose }}
            />
        </If>
    );
};
