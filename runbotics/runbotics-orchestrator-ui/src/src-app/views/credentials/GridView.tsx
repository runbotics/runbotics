import React, { VFC } from 'react';

import { Pagination, Box } from '@mui/material';

import styled from 'styled-components';

import CredentialTile from '#src-app/components/Tile/CredentialTile/CredentialTile';

import { CollectionsRoot } from '../bot/BotCollectionView/BotCollectionView.styles';

const TileGrid = styled.div`
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(400px, 1fr));
    grid-auto-rows: 1fr;
    min-height: 8rem;
    gap: 1rem;
`;

const GridView: VFC = () => (
    <>
        <CollectionsRoot>
            <TileGrid>
                <CredentialTile
                    credential={{
                        id: 'jakies_id',
                        name: 'Jakas Nazwa',
                        collection: 'Jakas kolekcja',
                        description: 'Jakies description',
                        collectionColor: 'rgba(251, 176, 64, 1)'
                    }}
                />
                <CredentialTile
                    credential={{
                        id: 'tymczasowe_id',
                        name: 'Tymczasowa Nazwa',
                        collection: 'Tymczasowa kolekcja',
                        description: 'Tymczasowe description',
                        collectionColor: 'rgba(255, 105, 0, 1)'
                    }}
                />
                <CredentialTile
                    credential={{ id: 'nowe_id', name: 'Nowa Nazwa', collection: 'Nowa kolekcja', description: 'Jakies description', collectionColor: 'rgba(53, 214, 141, 1)' }}
                />
                <CredentialTile
                    credential={{
                        id: 'unikalne_id',
                        name: 'Unikalna Nazwa',
                        collection: 'Unikalna kolekcja',
                        description: 'Unikalne description',
                        collectionColor: 'rgba(46, 76, 230, 1)'
                    }}
                />
            </TileGrid>
        </CollectionsRoot>
        <Box mt={6} display="flex" justifyContent="center">
            <Pagination count={1} />
        </Box>
    </>
);
export default GridView;
