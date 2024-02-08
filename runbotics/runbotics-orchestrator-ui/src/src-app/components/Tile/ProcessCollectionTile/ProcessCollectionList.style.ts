import { Box } from '@mui/material';
import { alpha } from '@mui/material/styles';
import styled from 'styled-components';

import { Color } from '../ProcessTile/ProcessTileFooter/ProcessTileFooter.types';

export const ExpandButtonWrapper = styled.div`
    display: flex;
    flex-direction: row;
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
        background-color: ${alpha(color === 'grey' ? theme.palette[color][700] : theme.palette[color].main, 0.1)};
    }
`);
