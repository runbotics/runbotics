import { useEffect, useState } from 'react';

import FolderOpenIcon from '@mui/icons-material/FolderOpen';
import { Box, SvgIcon, Typography } from '@mui/material';
import { useSearchParams } from 'next/navigation';
import { useRouter } from 'next/router';

import { useSnackbar } from 'notistack';

import CustomDialog from '#src-app/components/CustomDialog';
import InternalPage from '#src-app/components/pages/InternalPage';
import CredentialTile from '#src-app/components/Tile/CredentialTile/CredentialTile';
import If from '#src-app/components/utils/If';
import LoadingScreen from '#src-app/components/utils/LoadingScreen';
import useTranslations from '#src-app/hooks/useTranslations';
import { useDispatch, useSelector } from '#src-app/store';
import { credentialCollectionsActions, credentialCollectionsSelector } from '#src-app/store/slices/CredentialCollections';
import { credentialsActions, credentialsSelector } from '#src-app/store/slices/Credentials';
import { credentialTemplatesActions, credentialTemplatesSelector } from '#src-app/store/slices/CredentialTemplates';

import { TileGrid } from './GridView.styles';
import Header, { CredentialsTabs } from './Header';
import Paging from './Paging';
import CredentialsHeader from '../Credentials/CredentialsHeader/CredentialsHeader';

const CredentialsGridView = () => {
    const dispatch = useDispatch();
    const { translate } = useTranslations();
    const { enqueueSnackbar } = useSnackbar();
    const searchParams = useSearchParams();

    const { all: credentials } = useSelector(credentialsSelector);
    const { credentialCollections } = useSelector(credentialCollectionsSelector);
    const { credentialTemplates } = useSelector(credentialTemplatesSelector);
    const [loading, setLoading] = useState(true);

    const pageFromUrl = searchParams.get('page');
    const [page, setPage] = useState(pageFromUrl ? parseInt(pageFromUrl, 10) : 0);
    const pageSizeFromUrl = searchParams.get('pageSize');
    const pageSize = pageSizeFromUrl ? parseInt(pageSizeFromUrl) : 12;
    const startingPageItemIndex = page * pageSize;
    const endingPageItemIndex = startingPageItemIndex + pageSize;
    const currentPageCredentials = credentials ? credentials.slice(startingPageItemIndex, endingPageItemIndex) : [];

    const [currentDialogCredential, setCurrentDialogCredential] = useState(null);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

    const router = useRouter();
    const collectionId = router.query.collectionId ? (router.query.collectionId as string) : null;

    useEffect(() => {

    }, [page]);

    const handleDeleteDialogOpen = (id: string) => {
        setIsDeleteDialogOpen(true);
        setCurrentDialogCredential(credentials.find(credential => credential.id === id));
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

                if (collectionId) {
                    dispatch(credentialsActions.fetchAllCredentialsInCollection({ resourceId: `${collectionId}/credentials/` }));
                } else {
                    dispatch(credentialsActions.fetchAllCredentialsAccessibleInTenant());
                }
            })
            .catch(error => {
                enqueueSnackbar(error ? error.message : translate('Credential.Tile.Delete.Fail', { name: currentDialogCredential.name }), {
                    variant: 'error'
                });
            });
    };

    useEffect(() => {
        const fetchData = () => {
            const fetchAllCollections = dispatch(credentialCollectionsActions.fetchAllCredentialCollections());
            const fetchAllTemplates = dispatch(credentialTemplatesActions.fetchAllTemplates());

            const fetchCredentials = collectionId ? dispatch(credentialsActions.fetchAllCredentialsInCollection({ resourceId: `${collectionId}/credentials/` }))
                : dispatch(credentialsActions.fetchAllCredentialsAccessibleInTenant());

            Promise.allSettled([fetchAllCollections, fetchAllTemplates, fetchCredentials]).then(() => {
                setLoading(false);
            });
        };

        fetchData();
    }, []);

    const credentialsTiles = currentPageCredentials
        ? currentPageCredentials.map(credential => (
            <CredentialTile
                key={credential.id}
                credential={credential}
                collection={credentialCollections.find(collection => credential.collectionId === collection.id)}
                templateName={credentialTemplates.find(template => template.id === credential.templateId).name}
                collectionName={credentialCollections.find(collection => collection.id === credential.collectionId)?.name}
                loading={loading}
                collectionId={collectionId}
                handleDeleteDialogOpen={handleDeleteDialogOpen}
            />
        ))
        : [];

    return (
        <InternalPage title={translate('Credentials.Collections.Page.Title')}>
            <Header addCredentialDisabled={!credentialCollections || credentialCollections?.length === 0}/>
            <If condition={!loading} else={<LoadingScreen />}>
                {collectionId && (
                    <Box display="flex" justifyItems="center" alignItems="center" mb={3}>
                        <SvgIcon fontSize="large" color="secondary">
                            <FolderOpenIcon />
                        </SvgIcon>
                        <Typography variant="h3" ml={1}>
                            {credentialCollections && credentialCollections.find(collection => collectionId === collection.id)?.name}
                        </Typography>
                    </Box>
                )}
                <Box display="flex" flexDirection="column" gap="1.5rem" marginTop="1.5rem">
                    <CredentialsHeader credentialCount={credentials && credentials.length} tabName={CredentialsTabs.CREDENTIALS}/>
                </Box>
                <TileGrid>{credentialsTiles}</TileGrid>
            </If>
            {currentDialogCredential && (
                <CustomDialog
                    isOpen={isDeleteDialogOpen}
                    title={translate('Credential.Tile.Delete.Warning', { name: currentDialogCredential.name })}
                    onClose={handleDeleteDialogClose}
                    confirmButtonOptions={{ onClick: handleDelete }}
                    cancelButtonOptions={{ onClick: () => handleDeleteDialogClose() }}
                />
            )}
            <Box mt={6} display="flex" justifyContent="center">
                <Paging
                    totalItems={credentials && credentials.length}
                    itemsPerPage={pageSize}
                    currentPage={page}
                    setPage={setPage}
                />
            </Box>
        </InternalPage>
    );
};

export default CredentialsGridView;
