import React, { FC, useState } from 'react';

import { Alert, MenuItem } from '@mui/material';
import { useSnackbar } from 'notistack';

import CustomDialog from '#src-app/components/CustomDialog';
import useTranslations from '#src-app/hooks/useTranslations';
import { useDispatch } from '#src-app/store';
import { deleteCredentialCollections } from '#src-app/store/slices/CredentialCollections/CredentialCollections.thunks';
import { BasicCredentialDto } from '#src-app/views/credentials/Credential/Credential.types';

interface CredentialCollectionDeleteProps {
    credentials: BasicCredentialDto[];
    id: string;
    name: string;
    isOwner: boolean;
    handleClose(event: React.MouseEvent<HTMLElement>): void;
}

export const CredentialCollectionDelete: FC<CredentialCollectionDeleteProps> = ({ credentials, id, name, isOwner, handleClose }) => {
    const dispatch = useDispatch();
    const { translate } = useTranslations();
    const { enqueueSnackbar } = useSnackbar();
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

    if (!credentials || credentials.length > 0) {
        return <Alert severity="warning">{translate('Credentials.Collection.Tile.MenuItem.Delete.ConfirmationDialog.Warning')}</Alert>;
    }

    const handleDelete = (event: React.MouseEvent<HTMLElement>) => {
        dispatch(deleteCredentialCollections({ resourceId: id })).then(response => {
            if (response.type.split('/').at(-1) === 'fulfilled')
            { enqueueSnackbar(translate('Credentials.Collection.Tile.MenuItem.Delete.Success', { name }), { variant: 'success' }); }
            else { enqueueSnackbar(translate('Credentials.Collection.Tile.MenuItem.Delete.Fail', { name }), { variant: 'error' }); }
        });
        handleClose(event);
    };

    const toggleDeleteDialog = (e: React.MouseEvent<HTMLLIElement, MouseEvent>) => {
        e.stopPropagation();
        setIsDeleteDialogOpen(prevState => !prevState);
    };

    return (
        <>
            <MenuItem onClick={e => toggleDeleteDialog(e)} disabled={!isOwner}>
                {translate('Process.Collection.Tile.MenuItem.Delete')}
            </MenuItem>
            <CustomDialog
                isOpen={isDeleteDialogOpen}
                title={translate('Credentials.Collection.Tile.MenuItem.Delete.ConfirmationDialog.Title', { name })}
                onClose={e => {
                    toggleDeleteDialog(e);
                    handleClose(e);
                }}
                confirmButtonOptions={{ onClick: handleDelete }}
                cancelButtonOptions={{ onClick: e => {
                    toggleDeleteDialog(e);
                    handleClose(e);
                } }}
            ></CustomDialog>
        </>
    );
};
