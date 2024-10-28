import React, { FunctionComponent } from 'react';

import { Card } from '@mui/material';
import styled from 'styled-components';

const Wrapper = styled(Card)<TileProps>(({ theme, minheight, leftborderbolor }) => `
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    box-sizing: border-box;
    height: 100%;
    min-height: ${minheight ?? '13.125rem'};
    border-left: ${leftborderbolor ?? 0};

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
    minheight?: string;
    leftborderbolor?: string
}

const Tile: FunctionComponent<TileProps> = ({ children, hoverstyles, minheight, leftborderbolor }) => (
    <Wrapper hoverstyles={hoverstyles} minheight={minheight} leftborderbolor={leftborderbolor}>{children}</Wrapper>
);

export default Tile;
