import React, { useEffect, useState } from 'react';

import { Box } from '@mui/material';

import { useSearchParams } from 'next/navigation';
import { useSnackbar } from 'notistack';

import InternalPage from '#src-app/components/pages/InternalPage';
import CredentialsCollectionTile from '#src-app/components/Tile/CredentialsCollectionTile/CredentialsCollectionTile';
import If from '#src-app/components/utils/If';
import LoadingScreen from '#src-app/components/utils/LoadingScreen';
import useTranslations from '#src-app/hooks/useTranslations';
import { useDispatch, useSelector } from '#src-app/store';

import { credentialCollectionsActions, credentialCollectionsSelector } from '#src-app/store/slices/CredentialCollections';

import { CredentialsCollectionModals } from './CredentialsCollectionModals';
import CredentialsHeader from '../../Credentials/CredentialsHeader/CredentialsHeader';
import { TileGrid, TypographyPlaceholder } from '../GridView.styles';
import Header, { CredentialsTabs } from '../Header';
import Paging from '../Paging';
import { getFilterItemsForPage } from '../Paging.utils';

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

    const [currentCollection, setCurrentCollection] = useState(null);
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

    const [filteredCollections, setFilteredCollections] = useState([]);
    const currentPageCollections = filteredCollections ? getFilterItemsForPage(filteredCollections, page, pageSize) : [];

    useEffect(() => {
        setFilteredCollections(credentialCollections);
    }, [credentialCollections]);

    useEffect(() => {
        dispatch(credentialCollectionsActions.fetchAllCredentialCollections()).catch(error => {
            enqueueSnackbar(error.message, { variant: 'error' });
        });
    }, []);

    const handleOpenEditDialog = (id: string) => {
        setCurrentCollection(credentialCollections.find(collection => collection.id === id));
        setIsEditDialogOpen(true);
    };

    const handleOpenDeleteDialog = (id: string) => {
        setCurrentCollection(credentialCollections.find(collection => collection.id === id));
        setIsDeleteDialogOpen(true);
    };

    const collectionTiles = currentPageCollections
        ? currentPageCollections
            .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
            .map(collection => (
                <CredentialsCollectionTile
                    key={collection.id}
                    collection={collection}
                    handleOpenEditDialog={handleOpenEditDialog}
                    handleOpenDeleteDialog={handleOpenDeleteDialog}
                    setCurrentDialogCollection={setCurrentCollection}
                />
            ))
        : [];

    return (
        <InternalPage title={translate('Credentials.Collections.Page.Title')}>
            <Header />
            <If condition={!isLoading} else={<LoadingScreen />}>
                <Box display="flex" flexDirection="row" justifyContent="space-between" mt={2} mb={2} alignItems="center">
                    <CredentialsHeader
                        credentialCount={credentialCollections && credentialCollections.length}
                        tabName={CredentialsTabs.COLLECTIONS}
                        items={credentialCollections}
                        setItems={setFilteredCollections}
                        sharedWithNumber={null}
                    />
                </Box>
                {collectionTiles.length > 0 ? (
                    <>
                        <TileGrid>
                            {collectionTiles}
                            <If condition={currentCollection}>
                                <CredentialsCollectionModals
                                    isEditDialogOpen={isEditDialogOpen}
                                    isDeleteDialogOpen={isDeleteDialogOpen}
                                    currentCollection={currentCollection}
                                    setIsEditDialogOpen={setIsEditDialogOpen}
                                    setIsDeleteDialogOpen={setIsDeleteDialogOpen}
                                    setCurrentCollection={setCurrentCollection}
                                />
                            </If>
                        </TileGrid>
                        <Box mt={6} display="flex" justifyContent="center">
                            <Paging
                                totalItems={filteredCollections && filteredCollections.length}
                                itemsPerPage={pageSize}
                                currentPage={page}
                                setPage={setPage}
                            />
                        </Box>
                    </>
                ) : (
                    <Box display="flex" alignItems="center" justifyContent="center" mt={6} mb={6}>
                        <TypographyPlaceholder>{translate('Credentials.Collection.List.Placeholder')}</TypographyPlaceholder>
                    </Box>
                )}
            </If>
        </InternalPage>
    );
};

export default CredentialCollectionsGridView;
