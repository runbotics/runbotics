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
import { fetchAllCredentials } from '#src-app/store/slices/Credentials/Credentials.thunks';
import { getLastParamOfUrl } from '#src-app/views/utils/routerUtils';

import { getCredentials } from './Credentials/Credentials.utils';
import { GridViewProps } from './GridView.types';
import { CredentialsTabs } from './Header';
import { CollectionsRoot } from '../bot/BotCollectionView/BotCollectionView.styles';

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
    const collections = useSelector(state => state.credentialCollections.data);
    const credentials = getCredentials();
    // const allCollections = getCredentialsCollections();
    const router = useRouter();
    const isCollectionsTab = getLastParamOfUrl(router) === CredentialsTabs.COLLECTIONS;
    console.log('credentials', credentials);
    console.log('collections', collections);

    useEffect(() => {
        dispatch(fetchAllCredentials());
        // dispatch(fetchCollectionCredentials('kolekcja_basi'));
    }, [dispatch]);

    useEffect(() => {
        dispatch(fetchAllCredentialCollections());
    }, [dispatch]);
    
    const credentialsTiles = credentials.map(credential => <CredentialTile key={credential.id} credential={credential}/>);

    const collectionsTiles = collections.map(collection => <CredentialsCollectionTile key={collection.id} collection={collection}/>);

    return (
        <>
            <CollectionsRoot>
                <TileGrid>
                    <If condition={!isCollectionsTab}>
                        {credentialsTiles}
                    </If>
                    <If condition={isCollectionsTab}>
                        {collectionsTiles}
                    </If>
                </TileGrid>
            </CollectionsRoot>
            <Box mt={6} display="flex" justifyContent="center">
                <Pagination count={1} />
            </Box>
        </>
    );
};

export default GridView;

