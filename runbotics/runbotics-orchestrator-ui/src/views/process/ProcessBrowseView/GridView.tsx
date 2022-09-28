import React, { VFC, useContext } from 'react';
import { Box, Pagination } from '@mui/material';
import styled from 'styled-components';
import ProcessTile from 'src/components/Tile/ProcessTile';
import { useSelector } from 'src/store';
import { ProcessPageContext } from 'src/providers/ProcessPage.provider';

const PREFIX = 'GridView';

const classes = {
    root: `${PREFIX}-root`,
    cardsWrapper: `${PREFIX}-cardsWrapper`,
};

const Root = styled.div(() => ({
    [`& .${classes.root}`]: {},

    [`& .${classes.cardsWrapper}`]: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(400px, 1fr))',
        gridAutoRows: '1fr',
        minHeight: '23rem',
        gap: '1rem',
    },
}));

const GridView: VFC = () => {
    const processesPage = useSelector((state) => state.process.all.page);

    const {
        page,
        handleGridPageChange,
    } = useContext(ProcessPageContext);

    return (
        <Root>
            <Box className={classes.cardsWrapper}>
                {(processesPage?.content ?? []).map((process) => (
                    <ProcessTile key={process.id} process={process} />
                ))}
            </Box>
            <Box mt={6} display="flex" justifyContent="center">
                <Pagination count={processesPage?.totalPages ?? 1} onChange={handleGridPageChange} page={page + 1} />
            </Box>
        </Root>
    );
};

export default GridView;
