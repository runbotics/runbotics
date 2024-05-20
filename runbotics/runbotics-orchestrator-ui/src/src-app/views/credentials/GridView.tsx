import React, { VFC } from 'react';

import { Pagination, Box } from '@mui/material';

import { useRouter } from 'next/router';
import styled from 'styled-components';

import CredentialsCollectionTile from '#src-app/components/Tile/CredentialsCollectionTile/CredentialsCollectionTile';
import CredentialTile from '#src-app/components/Tile/CredentialTile/CredentialTile';

import If from '#src-app/components/utils/If';

import { getLastParamOfUrl } from '#src-app/views/utils/routerUtils';

import { getCredentials } from './Credentials/Credentials.utils';
import { getCredentialsCollections } from './CredentialsCollection/CredenitlaCollection.utils';
import { CredentialsTabs } from './Header';
import { CollectionsRoot } from '../bot/BotCollectionView/BotCollectionView.styles';

const TileGrid = styled.div`
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(400px, 1fr));
    grid-auto-rows: 1fr;
    min-height: 8rem;
    gap: 1rem;
`;

const GridView: VFC = () => {
    const allCredentials = getCredentials();
    const allCollections = getCredentialsCollections();
    const router = useRouter();
    const isCollectionsTab = getLastParamOfUrl(router) === CredentialsTabs.COLLECTIONS;
    
    const credentialsTiles = allCredentials.map(credential => <CredentialTile key={credential.id} credential={credential}/>);

    const collectionsTiles = allCollections.map(collection => <CredentialsCollectionTile key={collection.id} collection={collection}/>);

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

