import React, { FC, useEffect, useState } from 'react';

import { Pagination, Box } from '@mui/material';

import { useRouter } from 'next/router';
import { useDispatch } from 'react-redux';
import styled from 'styled-components';

import CredentialsCollectionTile from '#src-app/components/Tile/CredentialsCollectionTile/CredentialsCollectionTile';
import { CredentialCollectionDelete } from '#src-app/components/Tile/CredentialsCollectionTile/MenuItems/CredentialCollectionDelete/CredentialCollectionDelete';
import CredentialTile from '#src-app/components/Tile/CredentialTile/CredentialTile';

import If from '#src-app/components/utils/If';

import { useSelector } from '#src-app/store';
import {
    fetchAllCredentialCollections
} from '#src-app/store/slices/CredentialCollections/CredentialCollections.thunks';
import { fetchAllCredentialsAccessibleInTenant } from '#src-app/store/slices/Credentials/Credentials.thunks';
import { fetchAllTemplates } from '#src-app/store/slices/CredentialTemplates/CredentialTemplates.thunks';
import { usersActions } from '#src-app/store/slices/Users';
import { getLastParamOfUrl } from '#src-app/views/utils/routerUtils';

import CredentialsCollectionModifyDialog from './CredentialsCollection/CredentialsCollectionModifyDialog';
import { GridViewProps } from './GridView.types';
import { CredentialsTabs } from './Header';

const TileGrid = styled.div`
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(400px, 1fr));
    grid-auto-rows: 1fr;
    min-height: 8rem;
    gap: 1rem;
`;

const GridView: FC<GridViewProps> = () => {
    const dispatch = useDispatch();
    const collections = useSelector(state => state.credentialCollections.credentialCollections);
    const credentials = useSelector(state => state.credentials.all);
    const router = useRouter();
    const isCollectionsTab = getLastParamOfUrl(router) === CredentialsTabs.COLLECTIONS;
    const credentialTemplates = useSelector(state => state.credentialTemplates.data);

    const collectionIdFromUrl = router.query.collectionId;
    const [currentCollection, setCurrentCollection
    ] = useState(() => 
        collectionIdFromUrl ? collections.find(collection => collection.id === collectionIdFromUrl) : null
    );
    const [currentDialogCollection, setCurrentDialogCollection] = useState(null);
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

    const filteredCredentials = currentCollection ? credentials.filter(credential => credential.collectionId === currentCollection.id) : credentials;

    const handleOpenEditDialog = (id: string) => {
        setCurrentDialogCollection(collections.find(collection => collection.id === id));
        setIsEditDialogOpen(true);
    };

    const handleCloseEditDialog = () => {
        setCurrentDialogCollection(null);
        setIsEditDialogOpen(false);
    };

    const handleOpenDeleteDialog = (id: string) => {
        setCurrentDialogCollection(collections.find(collection => collection.id === id));
        setIsDeleteDialogOpen(true);
    };

    const handleCloseDeleteDialog = () => {
        setCurrentDialogCollection(null);
        setIsDeleteDialogOpen(false);
    };

    useEffect(() => {
        dispatch(fetchAllCredentialCollections());
        dispatch(fetchAllTemplates());
    }, []);

    useEffect(() => {
        if (!isCollectionsTab) {
            dispatch(fetchAllCredentialsAccessibleInTenant());
        }

        if (isCollectionsTab) {
            dispatch(usersActions.getAllLimited());
            dispatch(usersActions.getActiveNonAdmins());
        }
    }, [isCollectionsTab]);

    const credentialsTiles = filteredCredentials.map(credential => (
        <CredentialTile
            key={credential.id}
            credential={credential}
            collection={collections.find(collection => credential.collectionId === collection.id)}
            templateName={credentialTemplates.find(template => template.id === credential.templateId).name}
            collectionName={collections.find(collection => collection.id === credential.collectionId)?.name}
        />
    ));

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
            <TileGrid>
                <If condition={!isCollectionsTab}>{credentialsTiles}</If>
                <If condition={isCollectionsTab}>{collectionTiles}</If>
            </TileGrid>
            <If condition={currentDialogCollection}>
                <CredentialsCollectionModifyDialog
                    open={isEditDialogOpen}
                    onClose={handleCloseEditDialog}
                    collection={currentDialogCollection}
                />
                <CredentialCollectionDelete
                    collection={currentDialogCollection}
                    isDialogOpen={isDeleteDialogOpen}
                    handleDialogClose={handleCloseDeleteDialog}
                />
            </If>
            <Box mt={6} display="flex" justifyContent="center">
                <Pagination count={1} />
            </Box>
        </>
    );
};

export default GridView;
