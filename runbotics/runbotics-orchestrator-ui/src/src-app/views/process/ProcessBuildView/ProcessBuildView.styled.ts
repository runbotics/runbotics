import { Card } from '@mui/material';
import styled from 'styled-components';

export const StyledCard = styled(Card)<{ offsetTop: number }>(({ theme, offsetTop }) => `
    &[class*="MuiPaper"] {
        box-shadow: none;
        max-height: calc(100vh - ${offsetTop}px);
    }

    .djs-palette {
        top: ${theme.spacing(1)};
        left: ${theme.spacing(1)};
    }
`);
