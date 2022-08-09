import React from 'react';
import styled from 'styled-components';
import type { FC } from 'react';
import { Box, LinearProgress } from '@mui/material';

const Root = styled.div({
    display: 'flex',
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
    left: 0,
    top: 0,
    height: '100%',
    width: '100%',
});

const LoadingScreen: FC = () => (
    <Root>
        <Box width={400}>
            <LinearProgress />
        </Box>
    </Root>
);

export default LoadingScreen;
