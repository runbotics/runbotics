import { Components } from '@mui/material';

export const components: Components = {
    MuiTextField: {
        defaultProps: {
            variant: 'outlined',
        },
    },
    MuiLinearProgress: {
        styleOverrides: {
            root: {
                borderRadius: 3,
                overflow: 'hidden',
            },
        },
    },
    MuiListItemIcon: {
        styleOverrides: {
            root: {
                minWidth: 32,
            },
        },
    },
    MuiChip: {
        styleOverrides: {
            root: {
                backgroundColor: 'rgba(0,0,0,0.075)',
            },
        },
    },
    MuiTooltip: {
        styleOverrides: {
            tooltip: {
                '& strong': {
                    fontWeight: 900,
                },
            },

        }
    }
};
