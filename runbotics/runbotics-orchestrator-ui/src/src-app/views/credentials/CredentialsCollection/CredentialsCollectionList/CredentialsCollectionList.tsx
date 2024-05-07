import React from 'react';

import styled from 'styled-components';

import { CollectionsRoot } from '#src-app/views/bot/BotCollectionView/BotCollectionView.styles';

const TileGrid = styled.div`
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(400px, 1fr));
    grid-auto-rows: 1fr;
    min-height: 8rem;
    gap: 1rem;
`;

const CredentialsCollectionList = () => (
    <CollectionsRoot>
        <TileGrid>
        
        </TileGrid>
    </CollectionsRoot>
);

export default CredentialsCollectionList;
