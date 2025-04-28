/* eslint-disable max-lines-per-function */
import { useEffect, useState } from 'react';

import { Box } from '@mui/material';
import { useSearchParams } from 'next/navigation';
import { useRouter } from 'next/router';

import { FrontCredentialDto, PrivilegeType, Role } from 'runbotics-common';

import InternalPage from '#src-app/components/pages/InternalPage';
import CredentialTile from '#src-app/components/Tile/CredentialTile/CredentialTile';
import If from '#src-app/components/utils/If';
import LoadingScreen from '#src-app/components/utils/LoadingScreen';
import useAuth from '#src-app/hooks/useAuth';
import useDebounce from '#src-app/hooks/useDebounce';
import { useReplaceQueryParams } from '#src-app/hooks/useReplaceQueryParams';
import useRole from '#src-app/hooks/useRole';
import useTranslations from '#src-app/hooks/useTranslations';
import { useDispatch, useSelector } from '#src-app/store';
import { credentialCollectionsActions, credentialCollectionsSelector } from '#src-app/store/slices/CredentialCollections';
import { credentialsActions, credentialsSelector } from '#src-app/store/slices/Credentials';

import { DEBOUNCE_TIME } from '#src-app/views/process/EditProcessDialog/EditProcessDialog.utils';

import { CredentialsModals } from './CredentialModals';
import CredentialsHeader from '../../Credentials/CredentialsHeader/CredentialsHeader';
import CredentialsCollectionLocation from '../../CredentialsCollection/CredentialsCollectionLocation';
import { TileGrid, TypographyPlaceholder } from '../GridView.styles';
import Header, { CredentialsTabs } from '../Header';
import Paging from '../Paging';
import PagingProvider from '../Paging.provider';

const DEFAULT_CREDENTIAL_PAGE_SIZE = 12;

const CredentialsGridView = () => {
    const dispatch = useDispatch();
    const { translate } = useTranslations();
    const searchParams = useSearchParams();
    const replaceQueryParams = useReplaceQueryParams();

    const { allByPage } = useSelector(credentialsSelector);
    const credentials = allByPage?.content;
    const { credentialCollections } = useSelector(credentialCollectionsSelector);
    const [isLoading, setIsLoading] = useState(true);
    const { user: currentUser } = useAuth();
    const isTenantAdmin = useRole([Role.ROLE_TENANT_ADMIN]);

    const pageFromUrl = searchParams.get('page');
    const [page, setPage] = useState(pageFromUrl ? parseInt(pageFromUrl, 10) : 0);
    const pageSizeFromUrl = searchParams.get('pageSize');
    const searchFromUrl = searchParams.get('search');
    const [searchValue, setSearchValue] = useState(searchFromUrl || '');
    pageSizeFromUrl;
    const debouncedValue = useDebounce<string>(searchValue.trim(), DEBOUNCE_TIME);
    const pageSize = pageSizeFromUrl ? parseInt(pageSizeFromUrl) : DEFAULT_CREDENTIAL_PAGE_SIZE;

    const [currentDialogCredential, setCurrentDialogCredential] = useState<FrontCredentialDto>(null);
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

    const router = useRouter();
    const collectionId = router.query.collectionId ? (router.query.collectionId as string) : null;
    const currentCredentialsCollection = collectionId && credentialCollections ? credentialCollections.find(collection => collectionId === collection.id) : null;
    const collectionSharedWithNumber =
        collectionId &&
        credentialCollections &&
        currentCredentialsCollection?.credentialCollectionUser.length - 1;

    const collectionName = currentCredentialsCollection?.name;
    const hasEditAccess = currentCredentialsCollection
        ? isTenantAdmin ||
          currentCredentialsCollection.credentialCollectionUser.some(
              user => user.user.email === currentUser.email && user.privilegeType === PrivilegeType.WRITE
          )
        : true;

    useEffect(() => {
        const pageNotAvailable = allByPage && page >= allByPage.totalPages;

        if (pageNotAvailable) {
            setPage(0);
            replaceQueryParams({ collectionId, page: 0, pageSize, searchValue });
        } else {
            replaceQueryParams({ collectionId, page, pageSize, searchValue });
        }
    }, [allByPage]);

    useEffect(() => {
        const fetchAllCollections = dispatch(credentialCollectionsActions.fetchAllCredentialCollections());

        const fetchCredentials = dispatch(credentialsActions.fetchAllCredentialsAccessibleInTenantByPage({ pageParams: {
            page,
            size: pageSize,
            filter: {
                contains: {
                    name: debouncedValue,
                },
                equals: {
                    collectionId: collectionId ? collectionId : ''}
            }
        }}));

        Promise.allSettled([fetchAllCollections, fetchCredentials]).then(() => {
            setIsLoading(false);
        });
    }, [page, pageSize, debouncedValue]);

    const handleEditDialogOpen = (id: string) => {
        setCurrentDialogCredential(credentials.find(credential => credential.id === id));
        setIsEditDialogOpen(true);
    };

    const handleDeleteDialogOpen = (id: string) => {
        setIsDeleteDialogOpen(true);
        setCurrentDialogCredential(credentials.find(credential => credential.id === id));
    };

    const credentialsTiles = credentials
        ? [...credentials]
            .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
            .map(credential => (
                <CredentialTile
                    key={credential.id}
                    credential={credential}
                    collection={credentialCollections.find(collection => credential.collectionId === collection.id)}
                    templateName={credential.template.name}
                    loading={isLoading}
                    collectionId={collectionId}
                    handleEditDialogOpen={handleEditDialogOpen}
                    handleDeleteDialogOpen={handleDeleteDialogOpen}
                />
            ))
        : [];

    return (
        <InternalPage
            title={
                collectionId
                    ? translate('CredentialsInCollection.Page.Title', { name: collectionName })
                    : translate('Credentials.Page.Title')
            }
        >
            <PagingProvider
                page={page}
                pageSize={pageSize}
                search={searchValue}
                setPage={setPage}
                collectionId={collectionId}
                totalItems={allByPage?.totalElements}
            >
                <Header
                    addCredentialDisabled={!credentialCollections || credentialCollections?.length === 0}
                    hasEditAccess={hasEditAccess}
                />
                <If condition={!isLoading} else={<LoadingScreen />}>
                    {collectionId && <CredentialsCollectionLocation collectionName={collectionName} />}
                    <CredentialsHeader
                        tabName={CredentialsTabs.CREDENTIALS}
                        setSearchValue={setSearchValue}
                        sharedWithNumber={collectionId && collectionSharedWithNumber}
                    />
                    {credentialsTiles.length > 0 ? (
                        <>
                            <TileGrid>{credentialsTiles}</TileGrid>
                            <Box mt={6} display="flex" justifyContent="center">
                                <Paging />
                            </Box>
                        </>
                    ) : (
                        <Box display="flex" alignItems="center" justifyContent="center" mt={6} mb={6}>
                            <TypographyPlaceholder>{translate('Credentials.List.Placeholder')}</TypographyPlaceholder>
                        </Box>
                    )}
                </If>
                {currentDialogCredential && (
                    <CredentialsModals
                        isEditDialogOpen={isEditDialogOpen}
                        isDeleteDialogOpen={isDeleteDialogOpen}
                        currentDialogCredential={currentDialogCredential}
                        setIsEditDialogOpen={setIsEditDialogOpen}
                        setIsDeleteDialogOpen={setIsDeleteDialogOpen}
                        setCurrentDialogCredential={setCurrentDialogCredential}
                    />
                )}
            </PagingProvider>
        </InternalPage>
    );
};

export default CredentialsGridView;
