import React, { VFC } from 'react';

import { Pagination, Box } from '@mui/material';

import styled from 'styled-components';

import CredentialTile from '#src-app/components/Tile/CredentialTile/CredentialTile';

import { CollectionColors } from './CredentialsCollection/EditCredentialsCollection/CollectionColor/CollectionColor.types';
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
                        collectionColor: CollectionColors.LIGHT_ORANGE.hex
                    }}
                />
                <CredentialTile
                    credential={{
                        id: 'tymczasowe_id',
                        name: 'Tymczasowa Nazwa',
                        collection: 'Tymczasowa kolekcja',
                        description: 'Tymczasowe description',
                        collectionColor: CollectionColors.DARK_ORANGE.hex
                    }}
                />
                <CredentialTile
                    credential={{
                        id: 'zmyslone_id',
                        name: 'Zmyslona Nazwa',
                        collection: 'Zmyslona kolekcja',
                        description: 'Zmyslone description',
                        collectionColor: CollectionColors.LIGHT_GREEN.hex
                    }}
                />
                <CredentialTile
                    credential={{
                        id: 'nowe_id',
                        name: 'Nowa Nazwa',
                        collection: 'Nowa kolekcja',
                        description: 'Jakies description',
                        collectionColor: CollectionColors.DARK_GREEN.hex
                    }}
                />
                <CredentialTile
                    credential={{
                        id: 'unikalne_id',
                        name: 'Unikalna Nazwa',
                        collection: 'Unikalna kolekcja',
                        description: 'Unikalne description',
                        collectionColor: CollectionColors.LIGHT_BLUE.hex
                    }}
                />
                <CredentialTile
                    credential={{
                        id: 'ciemne_niebieskie_id',
                        name: 'Ciemna Niebieska Nazwa',
                        collection: 'Ciemna niebieska kolekcja',
                        description: 'Ciemne niebieska description',
                        collectionColor: CollectionColors.DARK_BLUE.hex
                    }}
                />
                <CredentialTile
                    credential={{
                        id: 'szare_id',
                        name: 'Szara Nazwa',
                        collection: 'Szara kolekcja',
                        description: 'Szare description',
                        collectionColor: CollectionColors.LIGHT_GREY.hex
                    }}
                />
                <CredentialTile
                    credential={{
                        id: 'ciemne_szare_id',
                        name: 'Ciemna Szara Nazwa',
                        collection: 'Ciemna szara kolekcja',
                        description: 'Ciemne szare description',
                        collectionColor: CollectionColors.DARK_GREY.hex
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
