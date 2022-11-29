import React, { FunctionComponent } from 'react';

import { Card, alpha } from '@mui/material';
import styled from 'styled-components';

const Wrapper = styled(Card)<TileProps>`
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    box-sizing: border-box;
    height: 100%;
    min-height: 13.125rem;

    && {
        box-shadow: 0 .25rem .5rem 0 ${alpha('#8d8c8c', 0.4)};
    }

    &:hover {
        ${({ hoverstyles }) => hoverstyles && `box-shadow: 0 .25rem 1rem 0 ${alpha('#8d8c8c', 0.4)}`};
    }
`;

interface TileProps {
    hoverstyles?: boolean;
}

const Tile: FunctionComponent<TileProps> = ({ children, hoverstyles }) => (
    <Wrapper hoverstyles={hoverstyles}>
        {children}
    </Wrapper>
);

export default Tile;
