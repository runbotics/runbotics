import { useEffect, useState } from 'react';

import { Box } from '@mui/material';

import { useSearchParams } from 'next/navigation';
import { useSnackbar } from 'notistack';

import InternalPage from '#src-app/components/pages/InternalPage';
import CredentialsCollectionTile from '#src-app/components/Tile/CredentialsCollectionTile/CredentialsCollectionTile';
import If from '#src-app/components/utils/If';
import LoadingScreen from '#src-app/components/utils/LoadingScreen';
import useDebounce from '#src-app/hooks/useDebounce';
import { useReplaceQueryParams } from '#src-app/hooks/useReplaceQueryParams';
import useTranslations from '#src-app/hooks/useTranslations';
import { useDispatch, useSelector } from '#src-app/store';

import { credentialCollectionsActions, credentialCollectionsSelector } from '#src-app/store/slices/CredentialCollections';

import { DEBOUNCE_TIME } from '#src-app/views/process/EditProcessDialog/EditProcessDialog.utils';

import { CredentialsCollectionModals } from './CredentialsCollectionModals';
import CredentialsHeader from '../../Credentials/CredentialsHeader/CredentialsHeader';
import { TileGrid, TypographyPlaceholder } from '../GridView.styles';
import Header, { CredentialsTabs } from '../Header';
import Paging from '../Paging';
import PagingProvider from '../Paging.provider';

const DEFAULT_COLLECTION_PAGE_SIZE = 12;

const CredentialCollectionsGridView = () => {
    const dispatch = useDispatch();
    const searchParams = useSearchParams();
    const { translate } = useTranslations();
    const { enqueueSnackbar } = useSnackbar();
    const replaceQueryParams = useReplaceQueryParams();

    const { allCredentialCollectionsByPage } = useSelector(credentialCollectionsSelector);
    const [isLoading, setIsLoading] = useState(true);

    const credentialCollections = allCredentialCollectionsByPage?.content;
    const pageFromUrl = searchParams.get('page');
    const [page, setPage] = useState(pageFromUrl ? parseInt(pageFromUrl) : 0);
    const pageSizeFromUrl = searchParams.get('pageSize');
    const searchFromUrl = searchParams.get('search');
    const [searchValue, setSearchValue] = useState(searchFromUrl || '');
    pageSizeFromUrl;
    const debouncedValue = useDebounce<string>(searchValue.trim(), DEBOUNCE_TIME);
    const pageSize = pageSizeFromUrl ? parseInt(pageSizeFromUrl) : DEFAULT_COLLECTION_PAGE_SIZE;

    const [currentCollection, setCurrentCollection] = useState(null);
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

    useEffect(() => {
        const pageNotAvailable = allCredentialCollectionsByPage && page >= allCredentialCollectionsByPage.totalPages;

        if (pageNotAvailable) {
            setPage(0);
            replaceQueryParams({ page: 0, pageSize, searchValue });
        } else {
            replaceQueryParams({ page, pageSize, searchValue });
        }
    }, [allCredentialCollectionsByPage]);

    useEffect(() => {
        dispatch(credentialCollectionsActions.fetchAllCredentialCollectionsByPage({ pageParams: {
            page,
            size: pageSize,
            filter: {
                contains: {
                    name: debouncedValue,
                },
            }
        }})).catch(error => {
            enqueueSnackbar(error.message, { variant: 'error' });
        }).finally(() => {
            setIsLoading(false);
        });
    }, [page, pageSize, debouncedValue]);

    const handleOpenEditDialog = (id: string) => {
        setCurrentCollection(credentialCollections.find(collection => collection.id === id));
        setIsEditDialogOpen(true);
    };

    const handleOpenDeleteDialog = (id: string) => {
        setCurrentCollection(credentialCollections.find(collection => collection.id === id));
        setIsDeleteDialogOpen(true);
    };

    const collectionTiles = credentialCollections
        ? [...credentialCollections]
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
            <PagingProvider
                page={page}
                pageSize={pageSize}
                search={searchValue}
                setPage={setPage}
                collectionId={null}
                totalItems={allCredentialCollectionsByPage?.totalElements}
            >
                <Header/>
                <If condition={!isLoading} else={<LoadingScreen />}>
                    <CredentialsHeader
                        tabName={CredentialsTabs.COLLECTIONS}
                        setSearchValue={setSearchValue}
                        sharedWithNumber={null}
                    />
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
                                        pageSize={pageSize}
                                    />
                                </If>
                            </TileGrid>
                            <Box mt={6} display="flex" justifyContent="center">
                                <Paging/>
                            </Box>
                        </>
                    ) : (
                        <Box display="flex" alignItems="center" justifyContent="center" mt={6} mb={6}>
                            <TypographyPlaceholder>{translate('Credentials.Collection.List.Placeholder')}</TypographyPlaceholder>
                        </Box>
                    )}
                </If>
            </PagingProvider>
        </InternalPage>
    );
};

export default CredentialCollectionsGridView;
