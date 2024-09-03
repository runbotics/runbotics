import React, { FC, useState } from 'react';

import { MenuItem } from '@mui/material';
import { useSnackbar } from 'notistack';

import CustomDialog from '#src-app/components/CustomDialog';
import If from '#src-app/components/utils/If';
import useTranslations from '#src-app/hooks/useTranslations';
import { useDispatch } from '#src-app/store';
import { deleteCredentialCollections } from '#src-app/store/slices/CredentialCollections/CredentialCollections.thunks';
import { BasicCredentialDto } from '#src-app/views/credentials/Credential/Credential.types';

interface CredentialCollectionDeleteProps {
    credentials: BasicCredentialDto[];
    id: string;
    name: string;
    handleClose(event: React.MouseEvent<HTMLElement>): void;
    // handleDialogOpen(event: React.MouseEvent<HTMLElement>): void;
}

export const CredentialCollectionDelete: FC<CredentialCollectionDeleteProps> = ({
    credentials,
    id,
    name,
    handleClose,
    // handleDialogOpen
}) => {
    const dispatch = useDispatch();
    const { translate } = useTranslations();
    const { enqueueSnackbar } = useSnackbar();
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

    const handleDelete = (event: React.MouseEvent<HTMLElement>) => {
        if (credentials && credentials.length > 0) {
            enqueueSnackbar(translate('Credentials.Collection.Tile.MenuItem.Delete.ConfirmationDialog.Warning'), { variant: 'error' });
            return;
        }

        dispatch(deleteCredentialCollections({ resourceId: id }))
            .unwrap()
            .then(() => {
                enqueueSnackbar(translate('Credentials.Collection.Tile.MenuItem.Delete.Success', { name }), { variant: 'success' });
            })
            .catch(error => {
                if (error.statusCode === 409) {
                    enqueueSnackbar(error.message, { variant: 'error' });
                } else {
                    enqueueSnackbar(translate('Credentials.Collection.Tile.MenuItem.Delete.Fail', { name }), { variant: 'error' });
                }
            });
        handleClose(event);
    };

    const toggleDeleteDialog = (e: React.MouseEvent<HTMLLIElement, MouseEvent>) => {
        e.stopPropagation();
        setIsDeleteDialogOpen(prevState => !prevState);
    };

    return (
        <>
            <MenuItem
                onClick={e => {
                    toggleDeleteDialog(e);
                    // handleDialogOpen(e);
                }}
            >
                {translate('Process.Collection.Tile.MenuItem.Delete')}
            </MenuItem>
            <If condition={isDeleteDialogOpen}>
                <CustomDialog
                    isOpen={true}
                    title={translate('Credentials.Collection.Tile.MenuItem.Delete.ConfirmationDialog.Title', { name })}
                    onClose={e => {
                        toggleDeleteDialog(e);
                        handleClose(e);
                    }}
                    confirmButtonOptions={{ onClick: handleDelete }}
                    cancelButtonOptions={{
                        onClick: e => {
                            toggleDeleteDialog(e);
                            handleClose(e);
                        }
                    }}
                />
            </If>
        </>
    );
};
