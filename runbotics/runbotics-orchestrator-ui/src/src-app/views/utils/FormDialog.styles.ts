import { DialogContent, DialogTitle } from '@mui/material';
import styled from 'styled-components';

export const Form = styled.div<{ $gap?: number; }>(({ theme, $gap }) => `
    display: flex;
    flex-direction: column;
    gap: ${$gap !== undefined ? $gap + 'px' : theme.typography.pxToRem(20)};
    padding: ${theme.typography.pxToRem(20)} ${theme.typography.pxToRem(40)};
    width: 43.75rem;
    height: 100%;
    margin: auto;
`);

export const Content = styled(DialogContent)({
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: '100%',
});

export const Title = styled(DialogTitle)(({ theme }) => ({
    '& h2': {
        fontSize: theme.typography.pxToRem(20),
    },
}));
