import React, { FC } from 'react';

import { Box, LinearProgress } from '@mui/material';
import styled from 'styled-components';

const Root = styled.div({
    display: 'flex',
    flexGrow: '1',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
});

const LoadingBox: FC = () => (
    <Root>
        <Box width={400}>
            <LinearProgress />
        </Box>
    </Root>
);

export default LoadingBox;
