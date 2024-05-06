import React, { VFC } from 'react';

import { Box } from '@mui/material';
import styled from 'styled-components';


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

const CredentialsGridView: VFC = () => 
// useProcessQueueSocket();
// const credentialsPage = useSelector((state) => state.credentials.all.page);

// const {
//     page,
//     handleGridPageChange,
// } = useContext(ProcessPageContext);

    (
        <>
            <TileGrid className={classes.cardsWrapper}>
                CredentialsTile Arr
            </TileGrid>
            <Box mt={6} display="flex" justifyContent="center">
                Box
            </Box>
        </>
    )
;

export default CredentialsGridView;
