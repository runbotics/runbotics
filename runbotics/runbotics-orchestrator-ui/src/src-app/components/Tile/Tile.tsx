import React, { FunctionComponent } from 'react';

import { Card } from '@mui/material';
import styled from 'styled-components';

const Wrapper = styled(Card)<TileProps>(({ theme, minHeight, leftBorderColor }) => `
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    box-sizing: border-box;
    height: 100%;
    min-height: ${minHeight ?? '13.125rem'};
    border-left: ${leftBorderColor ?? 0};

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
    minHeight?: string;
    leftBorderColor?: string
}

const Tile: FunctionComponent<TileProps> = ({ children, hoverstyles, minHeight, leftBorderColor }) => (
    <Wrapper hoverstyles={hoverstyles} minHeight={minHeight} leftBorderColor={leftBorderColor}>{children}</Wrapper>
);

export default Tile;
