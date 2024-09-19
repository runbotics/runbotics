import styled from 'styled-components';

import { collectionColors } from './CollectionColor.utils';

interface ColorDotProps {
    collectionColor?: string;
}

export const ColorDot = styled.span<ColorDotProps>(
    ({ collectionColor, theme }) => `
    height: ${theme.spacing(3)};
    width: ${theme.spacing(3)};
    background-color: ${collectionColors[collectionColor].hex};
    border-radius: 50%;
    display: inline-block;
    margin-right: ${theme.spacing(1)};
`
);
