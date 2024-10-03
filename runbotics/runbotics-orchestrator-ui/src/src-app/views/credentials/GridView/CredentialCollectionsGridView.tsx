import React, { useEffect, useState } from 'react';

import { Box } from '@mui/material';

import { useSearchParams } from 'next/navigation';
import { useSnackbar } from 'notistack';

import InternalPage from '#src-app/components/pages/InternalPage';
import CredentialsCollectionTile from '#src-app/components/Tile/CredentialsCollectionTile/CredentialsCollectionTile';
import { CredentialCollectionDelete } from '#src-app/components/Tile/CredentialsCollectionTile/MenuItems/CredentialCollectionDelete/CredentialCollectionDelete';
import If from '#src-app/components/utils/If';
import LoadingScreen from '#src-app/components/utils/LoadingScreen';
import useTranslations from '#src-app/hooks/useTranslations';
import { useDispatch, useSelector } from '#src-app/store';

import { credentialCollectionsActions, credentialCollectionsSelector } from '#src-app/store/slices/CredentialCollections';

import { TileGrid } from './GridView.styles';
import Header, { CredentialsTabs } from './Header';
import Paging from './Paging';
import CredentialsHeader from '../Credentials/CredentialsHeader/CredentialsHeader';
import CredentialsCollectionForm from '../CredentialsCollection/CredentialsCollectionForm';

const CredentialCollectionsGridView = () => {
    const dispatch = useDispatch();
    const { credentialCollections, loading: isLoading } = useSelector(credentialCollectionsSelector);
    const searchParams = useSearchParams();
    const { translate } = useTranslations();
    const { enqueueSnackbar } = useSnackbar();

    const pageFromUrl = searchParams.get('page');

    const [page, setPage] = useState(pageFromUrl ? parseInt(pageFromUrl) : 0);
    const pageSizeFromUrl = searchParams.get('pageSize');
    const pageSize = pageSizeFromUrl ? parseInt(pageSizeFromUrl) : 12;
    const startingPageItemIndex = page * pageSize;
    const endingPageItemIndex = startingPageItemIndex + pageSize;
    const currentPageCollections = credentialCollections ? credentialCollections.slice(startingPageItemIndex, endingPageItemIndex) : [];

    const [currentCollection, setCurrentCollection] = useState(null);
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

    useEffect(() => {
        dispatch(credentialCollectionsActions.fetchAllCredentialCollections())
            .catch((error) => {
                enqueueSnackbar(error.message, { variant: 'error' });
            });
    }, []);

    const handleOpenEditDialog = (id: string) => {
        setCurrentCollection(credentialCollections.find(collection => collection.id === id));
        setIsEditDialogOpen(true);
    };

    const handleCloseEditDialog = () => {
        setCurrentCollection(null);
        setIsEditDialogOpen(false);
    };

    const handleOpenDeleteDialog = (id: string) => {
        setCurrentCollection(credentialCollections.find(collection => collection.id === id));
        setIsDeleteDialogOpen(true);
    };

    const handleCloseDeleteDialog = () => {
        setCurrentCollection(null);
        setIsDeleteDialogOpen(false);
    };

    const collectionTiles = currentPageCollections
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
        <InternalPage title={translate('Credentials.Collections.Page.Title')}>
            <Header />
            <If condition={!isLoading} else={<LoadingScreen />}>
                <Box display="flex" flexDirection="column" gap="1.5rem" marginTop="1.5rem" mb={5}>
                    <CredentialsHeader credentialCount={credentialCollections.length} tabName={CredentialsTabs.COLLECTIONS} />
                </Box>
                <TileGrid>
                    {collectionTiles}
                    <If condition={currentCollection}>
                        <CredentialsCollectionForm
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
                    <Paging
                        totalItems={credentialCollections.length}
                        itemsPerPage={pageSize}
                        currentPage={page}
                        setPage={setPage}
                    />
                </Box>
            </If>
        </InternalPage>
    );
};

export default CredentialCollectionsGridView;
