import React, { FunctionComponent } from 'react';

import { Card } from '@mui/material';
import styled from 'styled-components';

const Wrapper = styled(Card)<TileProps>(({ theme, minheight, leftbordercolor }) => `
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    box-sizing: border-box;
    height: 100%;
    min-height: ${minheight ?? '13.125rem'};
    border-left: ${leftbordercolor ?? 0};

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
    children?: React.ReactNode;
    hoverstyles?: boolean;
    minheight?: string;
    leftbordercolor?: string
}

const Tile: FunctionComponent<TileProps> = ({ children, hoverstyles, minheight, leftbordercolor }) => (
    <Wrapper hoverstyles={hoverstyles} minheight={minheight} leftbordercolor={leftbordercolor}>{children}</Wrapper>
);

export default Tile;
