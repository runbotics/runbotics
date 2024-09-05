import React, { useEffect, useState } from 'react';

import CredentialsCollectionTile from '#src-app/components/Tile/CredentialsCollectionTile/CredentialsCollectionTile';
import { CredentialCollectionDelete } from '#src-app/components/Tile/CredentialsCollectionTile/MenuItems/CredentialCollectionDelete/CredentialCollectionDelete';
import If from '#src-app/components/utils/If';
import { useDispatch, useSelector } from '#src-app/store';

import { credentialCollectionsActions } from '#src-app/store/slices/CredentialCollections';
import { usersActions } from '#src-app/store/slices/Users';

import CredentialsCollectionModifyDialog from '../CredentialsCollection/CredentialsCollectionModifyDialog';

const CredentialCollectionsGridView = () => {
    const dispatch = useDispatch();
    const collections = useSelector(state => state.credentialCollections.credentialCollections);

    const [currentCollection, setCurrentCollection] = useState(null);
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

    useEffect(() => {
        dispatch(credentialCollectionsActions.fetchAllCredentialCollections());
        dispatch(usersActions.getAllLimited());
        dispatch(usersActions.getActiveNonAdmins());
    }, []);

    const handleOpenEditDialog = (id: string) => {
        setCurrentCollection(collections.find(collection => collection.id === id));
        setIsEditDialogOpen(true);
    };

    const handleCloseEditDialog = () => {
        setCurrentCollection(null);
        setIsEditDialogOpen(false);
    };

    const handleOpenDeleteDialog = (id: string) => {
        setCurrentCollection(collections.find(collection => collection.id === id));
        setIsDeleteDialogOpen(true);
    };

    const handleCloseDeleteDialog = () => {
        setCurrentCollection(null);
        setIsDeleteDialogOpen(false);
    };

    const collectionTiles = [...collections]
        .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
        .map(collection => (
            <CredentialsCollectionTile
                key={collection.id}
                collection={collection}
                handleOpenEditDialog={handleOpenEditDialog}
                handleOpenDeleteDialog={handleOpenDeleteDialog}
                setCurrentDialogCollection={setCurrentCollection}
            />
        ));
    return (
        <>
            {collectionTiles}
            <If condition={currentCollection}>
                <CredentialsCollectionModifyDialog open={isEditDialogOpen} onClose={handleCloseEditDialog} collection={currentCollection} />
                <CredentialCollectionDelete
                    collection={currentCollection}
                    isDialogOpen={isDeleteDialogOpen}
                    handleDialogClose={handleCloseDeleteDialog}
                />
            </If>
        </>
    );
};

export default CredentialCollectionsGridView;
