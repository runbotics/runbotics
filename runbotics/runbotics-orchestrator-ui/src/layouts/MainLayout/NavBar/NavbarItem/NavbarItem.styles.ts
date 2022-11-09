import {
    ListItem, ListItemIcon, ListItemText, SxProps, Theme,
} from '@mui/material';
import styled from 'styled-components';

type LinkButtonSxStylesCallback = (depth: number, open: boolean) => SxProps<Theme>;

export const getLinkButtonSx: LinkButtonSxStylesCallback = (depth: number) => ({
    display: 'flex',
    alignItems: 'center',
    gap: '17px',
    width: '100%',
    padding: '10px 20px',
    paddingLeft: `${depth ? 32 + 8 * depth : 20}px`,
    color: (theme) => theme.palette.text.secondary,
    textTransform: 'none',
    letterSpacing: 0,

    // ...(open && {
    //     color: `${open}`, // (theme) => theme.palette.secondary.main,
    //     '& .title': {
    //         fontWeight: (theme) => theme.typography.fontWeightMedium,
    //     },
    //     '& .icon': {
    //         color: (theme) => theme.palette.secondary.main,
    //     },
    // }),
    '&.Mui-selected': {
        color: (theme) => theme.palette.secondary.main,
        backgroundColor: (theme) => theme.palette.grey[100],
        fontWeight: (theme) => theme.typography.fontWeightMedium,
    },
    '&.Mui-selected:hover': {
        backgroundColor: (theme) => theme.palette.action.hover,
    },

    '.navbar-item-leaf': {
        width: '100%',
        minWidth: '2.5rem',
        minHeight: '3.125rem',
        padding: '10px 8px',
        color: (theme) => theme.palette.text.secondary,
        fontWeight: (theme) => theme.typography.fontWeightRegular,
        textTransform: 'none',
        letterSpacing: 0,

        '&.depth-0': {
            '& $title': {
                fontWeight: (theme) => theme.typography.fontWeightMedium,
            },
        },
    },
});

export const StyledListItem = styled(ListItem)`
    display: flex;
    padding-top: 0;
    padding-bottom: 0;
`;

export const StyledListItemIcon = styled(ListItemIcon)`
    && {
        display: flex;
        align-items: center;
        justify-content: center;
        min-width: 24px;
        min-height: 24px;
        color: inherit;
    }
`;

export const StyledListItemText = styled(ListItemText)(({ theme }) => `
    white-space: nowrap;

    & > span {
        font-size: 0.875rem;
        font-weight: ${theme.typography.fontWeightMedium};
    }
`);
