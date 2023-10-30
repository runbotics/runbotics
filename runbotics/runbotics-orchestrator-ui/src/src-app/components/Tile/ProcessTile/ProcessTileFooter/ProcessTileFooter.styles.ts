import { Box } from '@mui/material';
import { alpha } from '@mui/material/styles';
import styled from 'styled-components';

import { Color } from './ProcessTileFooter.types';

export const Footer = styled.div(({ theme }) => `
    height: 60px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    background-color: ${theme.palette.grey[200]};

    padding: 0 1rem 0 1.5rem;
    gap: 2rem;
`);

export const IconsWrapper = styled.div`
    display: flex;
`;

export const StyledIconsBox = styled(Box)
    <{ color: Color }>(({ theme, color }) => `
    && {
        display: flex;
        justify-content: center;
        align-items: center;
        width: 28px;
        height: 28px;
        border-radius: 5px;
        margin-right: 10px;
        background-color: ${alpha(color === 'grey' ? theme.palette[color][700] : theme.palette[color].main, 0.1)};
    }
`);

export const StyledBox = styled(Box)`
    display: flex;
`;
