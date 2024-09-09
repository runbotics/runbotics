import React, { useEffect, useState } from 'react';

import { Box } from '@mui/material';

import { useSearchParams } from 'next/navigation';

import CredentialsCollectionTile from '#src-app/components/Tile/CredentialsCollectionTile/CredentialsCollectionTile';
import { CredentialCollectionDelete } from '#src-app/components/Tile/CredentialsCollectionTile/MenuItems/CredentialCollectionDelete/CredentialCollectionDelete';
import If from '#src-app/components/utils/If';
import LoadingScreen from '#src-app/components/utils/LoadingScreen';
import { useReplaceQueryParams } from '#src-app/hooks/useReplaceQueryParams';
import CredentialsPageProvider from '#src-app/providers/CredentialsPage.provider';
import { useDispatch, useSelector } from '#src-app/store';

import { credentialCollectionsActions } from '#src-app/store/slices/CredentialCollections';
import { usersActions } from '#src-app/store/slices/Users';

import { TileGrid } from './GridView';
import Paging from './Paging';
import CredentialsCollectionModifyDialog from '../CredentialsCollection/CredentialsCollectionModifyDialog';

const CredentialCollectionsGridView = () => {
    const dispatch = useDispatch();
    const collections = useSelector(state => state.credentialCollections.credentialCollections);
    const isLoading = useSelector(state => state.credentialCollections.loading);
    const searchParams = useSearchParams();
    const replaceQueryParams = useReplaceQueryParams();

    const collectionsPage = useSelector(state => state.credentialCollections.page);
    const pageFromUrl = searchParams.get('page');
    const [page, setPage] = useState(pageFromUrl ? parseInt(pageFromUrl, 10) : 0);
    const pageSizeFromUrl = searchParams.get('pageSize');
    const [pageSize, setPageSize] = useState(pageSizeFromUrl ? parseInt(pageSizeFromUrl, 10) : 12);
    const totalPages = Math.ceil(collections.length / pageSize);
    const startingPageItemIndex = page * pageSize;
    const endingPageItemIndex = startingPageItemIndex + pageSize;
    const currentPageCollections = collections ? collections.slice(startingPageItemIndex, endingPageItemIndex) : [];

    const [currentCollection, setCurrentCollection] = useState(null);
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

    useEffect(() => {
        dispatch(credentialCollectionsActions.fetchAllCredentialCollections());
        dispatch(usersActions.getAllLimited());
        dispatch(usersActions.getActiveNonAdmins());
    }, []);

    useEffect(() => {
        const pageNotAvailable = collectionsPage && page >= totalPages;

        if (pageNotAvailable) {
            setPage(0);
            replaceQueryParams({ collectionId: currentCollection.id, page: 0, pageSize });
        }
    }, [page]);

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

    const collectionTiles = [...currentPageCollections]
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
        <CredentialsPageProvider
            {...{ pageSize, setPageSize, page, setPage, collectionId: null }}
        >
            <If condition={!isLoading} else={<LoadingScreen />}>
                <TileGrid>
                    {collectionTiles}
                    <If condition={currentCollection}>
                        <CredentialsCollectionModifyDialog
                            open={isEditDialogOpen}
                            onClose={handleCloseEditDialog}
                            collection={currentCollection}
                        />
                        <CredentialCollectionDelete
                            collection={currentCollection}
                            isDialogOpen={isDeleteDialogOpen}
                            handleDialogClose={handleCloseDeleteDialog}
                        />
                    </If>
                </TileGrid>
                <Box mt={6} display="flex" justifyContent="center">
                    <Paging totalPages={totalPages} />
                </Box>
            </If>
        </CredentialsPageProvider>
    );
};

export default CredentialCollectionsGridView;
