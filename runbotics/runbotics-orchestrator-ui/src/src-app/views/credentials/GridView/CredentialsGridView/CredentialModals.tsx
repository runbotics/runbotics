import React, { FC } from 'react';

import { useSnackbar } from 'notistack';

import { FrontCredentialDto } from 'runbotics-common';

import CustomDialog from '#src-app/components/CustomDialog';

import useTranslations from '#src-app/hooks/useTranslations';

import { useDispatch } from '#src-app/store';

import { credentialsActions } from '#src-app/store/slices/Credentials';

import { EditCredentialForm } from '../../Credential/EditCredential/EditCredentialForm';

interface CredentialsModalsProps {
    collectionId: string;
    isEditDialogOpen: boolean;
    isDeleteDialogOpen: boolean;
    currentDialogCredential: FrontCredentialDto;
    setIsDeleteDialogOpen: (state: boolean) => void;
    setIsEditDialogOpen: (state: boolean) => void;
    setCurrentDialogCredential: (state: null) => void;
    pageSize: number;
}

export const CredentialsModals: FC<CredentialsModalsProps> = ({
    isEditDialogOpen,
    setIsDeleteDialogOpen,
    isDeleteDialogOpen,
    setIsEditDialogOpen,
    currentDialogCredential,
    setCurrentDialogCredential,
    collectionId,
    pageSize,
}) => {
    const { translate } = useTranslations();
    const dispatch = useDispatch();
    const { enqueueSnackbar } = useSnackbar();

    const handleEditDialogClose = () => {
        setCurrentDialogCredential(null);
        setIsEditDialogOpen(false);
    };

    const handleDeleteDialogClose = () => {
        setIsDeleteDialogOpen(false);
        setCurrentDialogCredential(null);
    };

    const handleDelete = () => {
        dispatch(credentialsActions.deleteCredential({ resourceId: currentDialogCredential.id }))
            .unwrap()
            .then(() => {
                enqueueSnackbar(translate('Credential.Tile.Delete.Success', { name: currentDialogCredential.name }), {
                    variant: 'success'
                });
                handleDeleteDialogClose();

                dispatch(
                    credentialsActions.fetchAllCredentialsAccessibleInTenantByPage({
                        pageParams: { page: 0, pageSize },
                    })
                );
            })
            .catch(error => {
                enqueueSnackbar(error ? error.message : translate('Credential.Tile.Delete.Fail', { name: currentDialogCredential.name }), {
                    variant: 'error'
                });
            });
    };

    return (
        <>
            <EditCredentialForm
                open={isEditDialogOpen}
                onClose={handleEditDialogClose}
                credential={currentDialogCredential}
                collectionId={collectionId}
                pageSize={pageSize}
            />
            <CustomDialog
                isOpen={isDeleteDialogOpen}
                title={translate('Credential.Tile.Delete.Warning', { name: currentDialogCredential.name })}
                onClose={handleDeleteDialogClose}
                confirmButtonOptions={{ onClick: handleDelete }}
                cancelButtonOptions={{ onClick: () => handleDeleteDialogClose() }}
            />
        </>
    );
};