import React, { FC, useEffect } from 'react';

import { Pagination, Box } from '@mui/material';

import { useRouter } from 'next/router';
import { useDispatch } from 'react-redux';
import styled from 'styled-components';

import CredentialsCollectionTile from '#src-app/components/Tile/CredentialsCollectionTile/CredentialsCollectionTile';
import CredentialTile from '#src-app/components/Tile/CredentialTile/CredentialTile';

import If from '#src-app/components/utils/If';

import { useSelector } from '#src-app/store';
import { fetchAllCredentialCollections } from '#src-app/store/slices/CredentialCollections/CredentialCollections.thunks';
import { fetchAllCredentialsAccessibleInTenant } from '#src-app/store/slices/Credentials/Credentials.thunks';
import { usersActions } from '#src-app/store/slices/Users';
import { getLastParamOfUrl } from '#src-app/views/utils/routerUtils';

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
    // const credentials = useSelector(state => state.credentials.all);
    const collections = useSelector(state => state.credentialCollections.credentialCollections);
    const credentials = useSelector(state => state.credentials.all);
    // const allCollections = getCredentialsCollections();
    const router = useRouter();
    const isCollectionsTab = getLastParamOfUrl(router) === CredentialsTabs.COLLECTIONS;

    const credentialTemplates = useSelector(state => state.credentialTemplates.data);

    console.log(credentials);
    
    useEffect(() => {
        // dispatch(fetchAllTemplates());
        dispatch(fetchAllCredentialsAccessibleInTenant());
        dispatch(fetchAllCredentialCollections());
        if (isCollectionsTab) {
            dispatch(usersActions.getAllLimited());
            dispatch(usersActions.getActiveNonAdmins());
        }
    }, [dispatch]);

    const credentialsTiles = credentials.map(credential => <CredentialTile key={credential.id} credential={credential} collections={collections}/>);

    const collectionTiles = collections.map(collection => <CredentialsCollectionTile key={collection.id} collection={collection} />);

    return (
        <>
            <TileGrid>
                <If condition={!isCollectionsTab}>{credentialsTiles}</If>
                <If condition={isCollectionsTab}>{collectionTiles}</If>
            </TileGrid>
            <Box mt={6} display="flex" justifyContent="center">
                <Pagination count={1} />
            </Box>
        </>
    );
};

export default GridView;
