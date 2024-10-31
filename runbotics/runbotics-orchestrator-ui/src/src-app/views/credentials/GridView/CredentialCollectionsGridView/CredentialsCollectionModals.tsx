import React, { FC } from 'react';

import { FrontCredentialCollectionDto } from 'runbotics-common';

import { CredentialCollectionDelete } from '#src-app/components/Tile/CredentialsCollectionTile/MenuItems/CredentialCollectionDelete/CredentialCollectionDelete';

import CredentialsCollectionForm from '../../CredentialsCollection/CredentialsCollectionForm';

interface CredentialsCollectionModalsProps {
    isEditDialogOpen: boolean;
    isDeleteDialogOpen: boolean;
    currentCollection: FrontCredentialCollectionDto;
    setIsEditDialogOpen: (state: boolean) => void
    setIsDeleteDialogOpen: (state: boolean) => void;
    setCurrentCollection: (state: null) => void;
    pageSize: number;
}

export const CredentialsCollectionModals: FC<CredentialsCollectionModalsProps> = ({
    isEditDialogOpen,
    isDeleteDialogOpen,
    currentCollection,
    setIsEditDialogOpen,
    setIsDeleteDialogOpen,
    setCurrentCollection,
    pageSize,
}) => {
    const handleCloseEditDialog = () => {
        setCurrentCollection(null);
        setIsEditDialogOpen(false);
    };

    const handleCloseDeleteDialog = () => {
        setCurrentCollection(null);
        setIsDeleteDialogOpen(false);
    };

    return (
        <>
            <CredentialsCollectionForm
                open={isEditDialogOpen}
                onClose={handleCloseEditDialog}
                collection={currentCollection}
                pageSize={pageSize}/>
            <CredentialCollectionDelete
                collection={currentCollection}
                isDialogOpen={isDeleteDialogOpen}
                handleDialogClose={handleCloseDeleteDialog}
                pageSize={pageSize}
            />
        </>
    );
};
