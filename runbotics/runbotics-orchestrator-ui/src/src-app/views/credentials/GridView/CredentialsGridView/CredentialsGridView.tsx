import { useEffect, useState } from 'react';

import { Box } from '@mui/material';
import { useSearchParams } from 'next/navigation';
import { useRouter } from 'next/router';

import InternalPage from '#src-app/components/pages/InternalPage';
import CredentialTile from '#src-app/components/Tile/CredentialTile/CredentialTile';
import If from '#src-app/components/utils/If';
import LoadingScreen from '#src-app/components/utils/LoadingScreen';
import useTranslations from '#src-app/hooks/useTranslations';
import { useDispatch, useSelector } from '#src-app/store';
import { credentialCollectionsActions, credentialCollectionsSelector } from '#src-app/store/slices/CredentialCollections';
import { credentialsActions, credentialsSelector } from '#src-app/store/slices/Credentials';

import { CredentialsModals } from './CredentialModals';
import { BasicCredentialDto } from '../../Credential/Credential.types';
import CredentialsHeader from '../../Credentials/CredentialsHeader/CredentialsHeader';
import CredentialsCollectionLocation from '../../CredentialsCollection/CredentialsCollectionLocation';
import { TileGrid, TypographyPlaceholder } from '../GridView.styles';
import Header, { CredentialsTabs } from '../Header';
import Paging from '../Paging';
import { getFilterItemsForPage } from '../Paging.utils';

const CredentialsGridView = () => {
    const dispatch = useDispatch();
    const { translate } = useTranslations();
    const searchParams = useSearchParams();

    const { all: credentials } = useSelector(credentialsSelector);
    const { credentialCollections } = useSelector(credentialCollectionsSelector);
    const [loading, setLoading] = useState(true);

    const pageFromUrl = searchParams.get('page');
    const [page, setPage] = useState(pageFromUrl ? parseInt(pageFromUrl, 10) : 0);
    const pageSizeFromUrl = searchParams.get('pageSize');
    const pageSize = pageSizeFromUrl ? parseInt(pageSizeFromUrl) : 12;

    const [filteredCredentials, setFilteredCredentials] = useState<BasicCredentialDto[]>([]);
    const currentPageCredentials = filteredCredentials ? getFilterItemsForPage(filteredCredentials, page, pageSize) : null;

    const [currentDialogCredential, setCurrentDialogCredential] = useState<BasicCredentialDto>(null);
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

    const router = useRouter();
    const collectionId = router.query.collectionId ? (router.query.collectionId as string) : null;
    const collectionSharedWithNumber =
        collectionId &&
        credentialCollections &&
        credentialCollections.find(collection => collectionId === collection.id)?.credentialCollectionUser.length - 1;

    useEffect(() => {
        setFilteredCredentials(credentials);
    }, [credentials]);

    const handleEditDialogOpen = (id: string) => {
        setCurrentDialogCredential(credentials.find(credential => credential.id === id));
        setIsEditDialogOpen(true);
    };

    const handleDeleteDialogOpen = (id: string) => {
        setIsDeleteDialogOpen(true);
        setCurrentDialogCredential(credentials.find(credential => credential.id === id));
    };

    useEffect(() => {
        const fetchAllCollections = dispatch(credentialCollectionsActions.fetchAllCredentialCollections());

        const fetchCredentials = collectionId
            ? dispatch(credentialsActions.fetchAllCredentialsInCollection({ resourceId: `${collectionId}/credentials` }))
            : dispatch(credentialsActions.fetchAllCredentialsAccessibleInTenant());

        Promise.allSettled([fetchAllCollections, fetchCredentials]).then(() => {
            setLoading(false);
        });
    }, []);

    const credentialsTiles = currentPageCredentials
        ? currentPageCredentials
            .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
            .map(credential => (
                <CredentialTile
                    key={credential.id}
                    credential={credential}
                    collection={credentialCollections.find(collection => credential.collectionId === collection.id)}
                    templateName={credential.template.name}
                    loading={loading}
                    collectionId={collectionId}
                    handleEditDialogOpen={handleEditDialogOpen}
                    handleDeleteDialogOpen={handleDeleteDialogOpen}
                />
            ))
        : [];

    return (
        <InternalPage title={translate('Credentials.Collections.Page.Title')}>
            <Header addCredentialDisabled={!credentialCollections || credentialCollections?.length === 0} />
            <If condition={!loading} else={<LoadingScreen />}>
                {collectionId && (
                    <CredentialsCollectionLocation
                        collectionName={credentialCollections?.find(collection => collectionId === collection.id)?.name}
                    />
                )}
                <Box display="flex" flexDirection="row" justifyContent="space-between" mt={2} mb={2} alignItems="center">
                    <CredentialsHeader
                        credentialCount={filteredCredentials && filteredCredentials.length}
                        tabName={CredentialsTabs.CREDENTIALS}
                        items={credentials}
                        setItems={setFilteredCredentials}
                        sharedWithNumber={collectionId && collectionSharedWithNumber}
                    />
                </Box>
                {credentialsTiles.length > 0 ? (
                    <>
                        <TileGrid>{credentialsTiles}</TileGrid>
                        <Box mt={6} display="flex" justifyContent="center">
                            <Paging
                                totalItems={filteredCredentials && filteredCredentials.length}
                                itemsPerPage={pageSize}
                                currentPage={page}
                                setPage={setPage}
                            />
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
                    collectionId={collectionId}
                    isEditDialogOpen={isEditDialogOpen}
                    isDeleteDialogOpen={isDeleteDialogOpen}
                    currentDialogCredential={currentDialogCredential}
                    setIsEditDialogOpen={setIsEditDialogOpen}
                    setIsDeleteDialogOpen={setIsDeleteDialogOpen}
                    setCurrentDialogCredential={setCurrentDialogCredential}
                />
            )}
        </InternalPage>
    );
};

export default CredentialsGridView;
