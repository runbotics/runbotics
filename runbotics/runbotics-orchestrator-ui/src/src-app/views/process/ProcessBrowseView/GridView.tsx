import React, { VFC, useContext } from 'react';

import { Box, Pagination } from '@mui/material';
import styled from 'styled-components';

import ProcessTile from '#src-app/components/Tile/ProcessTile';
import { ProcessPageContext } from '#src-app/providers/ProcessPage.provider';
import { useSelector } from '#src-app/store';

const PREFIX = 'GridView';

const classes = {
    root: `${PREFIX}-root`,
    cardsWrapper: `${PREFIX}-cardsWrapper`,
};

const TileGrid = styled.div`
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(400px, 1fr));
    grid-auto-rows: 1fr;
    min-height: 16.25rem;
    gap: 1rem;
`;

const GridView: VFC = () => {
    const processesPage = useSelector((state) => state.process.all.page);

    const {
        page,
        handleGridPageChange,
    } = useContext(ProcessPageContext);

    return (
        <>
            <TileGrid className={classes.cardsWrapper}>
                {(processesPage?.content ?? []).map((process) => (
                    <ProcessTile key={process.id} process={process} />
                ))}
            </TileGrid>
            <Box mt={6} display="flex" justifyContent="center">
                <Pagination count={processesPage?.totalPages ?? 1} onChange={handleGridPageChange} page={page + 1} />
            </Box>
        </>
    );
};

export default GridView;
