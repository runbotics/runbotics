import { Drawer, Stack } from '@mui/material';
import styled from 'styled-components';

export const PluginDrawerTitle = styled('h4')(({theme}) => ({
    padding: '16px 24px',
    fontFamily: 'Roboto',
    fontSize: theme.typography.pxToRem(20),
    fontWeight: 500,
}));

export const TenantName = styled('span')(({theme}) => ({
    color: `${theme.palette.primary.main}`,
}));

export const PluginExpDate = styled('p')(() => ({
    fontFamily: 'Roboto',
    fontSize: '14px',
    fontWeight: 400,
}));

export const ExpiredDate = styled('span')(() => ({
    color: 'red'
}));

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

