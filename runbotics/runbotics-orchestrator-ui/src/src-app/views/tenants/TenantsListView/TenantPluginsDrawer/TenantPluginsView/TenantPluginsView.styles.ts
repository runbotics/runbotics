import { Drawer, Stack } from '@mui/material';
import { grey, red, amber } from '@mui/material/colors';
import styled from 'styled-components';

export const PluginDrawerTitle = styled('h4')(({theme}) => ({
    padding: '16px 24px',
    fontFamily: theme.typography.fontFamily,
    fontSize: theme.typography.pxToRem(20),
    fontWeight: 500,
}));

export const PluginExpDate = styled('p')<{expired?: boolean}>(({expired, theme}) => ({
    fontFamily: theme.typography.fontFamily,
    fontSize: theme.typography.pxToRem(14),
    fontWeight: 400,
    color: expired ? grey.A400 : 'inherit',
}));

export const PluginDate = styled('span')<{
    expired?: boolean;
    expiringSoon?: boolean;
}>(({ theme, expired, expiringSoon }) => ({
    fontFamily: theme.typography.fontFamily,
    fontSize: theme.typography.pxToRem(14),
    fontWeight: 400,
    // eslint-disable-next-line no-nested-ternary
    color: expired
        ? grey.A400
        : expiringSoon
            ? theme.palette.error.main
            : 'inherit',
}));

export const PluginBadge = styled('span')<{
    expired?: boolean;
    expiringSoon?: boolean;
}>(({ expired, expiringSoon, theme }) => ({
    fontFamily: theme.typography.fontFamily,
    fontSize: theme.typography.pxToRem(14),
    fontWeight: 400,
    alignSelf: 'flex-start',
    padding: '2px 10px',
    borderRadius: '12px',
    marginBottom: '4px',
    // eslint-disable-next-line no-nested-ternary
    backgroundColor: expired
        ? grey[100]
        : expiringSoon
            ? red[100]
            : amber[100],
    // eslint-disable-next-line no-nested-ternary
    color: expired
        ? 'rgba(0,0,0,0.3)'
        : expiringSoon
            ? red[800]
            : amber[800],
}));

export const PluginsDrawer = styled(Drawer)(() => ({
    '& .MuiDrawer-paperAnchorRight': {
        width: '30%',
    },
}));

export const PluginActivateButton = styled(Stack)(({theme}) => ({
    fontFamily: theme.typography.fontFamily,
    fontSize: theme.typography.pxToRem(14),
    fontWeight: 400,
    cursor: 'pointer',
    
    '&:hover': {
        backgroundColor: 'rgba(0,0,0,0.04)',
    },
}));
