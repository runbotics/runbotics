import { Drawer, Stack } from '@mui/material';
import styled from 'styled-components';

export const PluginDrawerTitle = styled('h4')(({theme}) => ({
    padding: '16px 24px',
    fontFamily: 'Roboto',
    fontSize: theme.typography.pxToRem(20),
    fontWeight: 500,
}));

export const PluginExpDate = styled('p')(() => ({
    fontFamily: 'Roboto',
    fontSize: '14px',
    fontWeight: 400,
}));

export const PluginDate = styled('span')<{
    expired?: boolean;
    expiringSoon?: boolean;
}>`
    fontFamily: 'Roboto';
    fontSize: '14px';
    fontWeight: 400;
    color: ${({ expired, expiringSoon }) =>
        // eslint-disable-next-line no-nested-ternary
        expired ? '#aaa' : expiringSoon ? '#863034' : 'inherit'};
`;

export const PluginBadge = styled('span')<{
    expired?: boolean;
    expiringSoon?: boolean;
}>`
    font-family: Roboto;
    font-size: 0.75rem;
    font-weight: 500;
    align-self: flex-start;
    padding: 2px 10px;
    border-radius: 12px;
    margin-bottom: 4px;
    background-color: ${({ expired, expiringSoon }) =>
        // eslint-disable-next-line no-nested-ternary
        expired ? '#F5F5F5' : expiringSoon ? '#FDEDED' : '#FBB04014'};
    color: ${({ expired, expiringSoon }) =>
        // eslint-disable-next-line no-nested-ternary
        expired ? 'rgba(0,0,0,0.3)' : expiringSoon ? '#863034' : '#E4A03A'};
`;

export const PluginsDrawer = styled(Drawer)(() => ({
    '& .MuiDrawer-paperAnchorRight': {
        width: '30%',
    },
}));

export const PluginActivateButton = styled(Stack)(() => ({
    fontFamily: 'Roboto',
    fontSize: '14px',
    fontWeight: 400,
    cursor: 'pointer',
    
    '&:hover': {
        backgroundColor: 'rgba(0,0,0,0.04)',
    },
}));
