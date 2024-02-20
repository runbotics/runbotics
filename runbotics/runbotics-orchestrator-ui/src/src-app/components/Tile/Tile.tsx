import React, { FunctionComponent } from 'react';

import { Card } from '@mui/material';
import styled from 'styled-components';

const Wrapper = styled(Card)<TileProps>(({ theme }) => `
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    box-sizing: border-box;
    height: 100%;
    min-height: 13.125rem;

    && {
        box-shadow: ${theme.shadows[5]};
    }

    &:hover {
        ${({ hoverstyles }) =>
        hoverstyles &&
            `box-shadow: ${theme.shadows[10]}`};
    }
`);

interface TileProps {
    hoverstyles?: boolean;
}

const Tile: FunctionComponent<TileProps> = ({ children, hoverstyles }) => (
    <Wrapper hoverstyles={hoverstyles}>{children}</Wrapper>
);

export default Tile;
