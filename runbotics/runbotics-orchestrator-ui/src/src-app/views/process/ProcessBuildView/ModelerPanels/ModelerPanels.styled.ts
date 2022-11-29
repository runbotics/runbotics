import { Button } from '@mui/material';
import styled from 'styled-components';

import BotProcessRunner from '#src-app/components/BotProcessRunner';

export const FirstActionButton = styled(Button)(({ theme }) => `
    [class*="MuiTouchRipple"] {
        margin: ${theme.spacing(0, 1, 0, 0)};
    }
`);

export const StyledLabel = styled.label`
    cursor: pointer;
`;

export const ImportInput = styled.input`
    display: none;
`;

export const StyledBotProcessRunner = styled(BotProcessRunner)(({ theme }) => `
    &[class*="MuiButton"] {
        margin: ${theme.spacing(0, 1, 0, 0)};
    }
`);
