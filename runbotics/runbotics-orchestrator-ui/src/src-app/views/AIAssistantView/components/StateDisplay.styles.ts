import { Box, Button, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';

export const StateContainer = styled(Box)(({ theme }) => ({
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: theme.spacing(8, 0),
    textAlign: 'center',
}));

export const StateIconBox = styled(Box)<{ variant?: 'info' | 'error' }>(({ theme, variant }) => ({
    width: 80,
    height: 80,
    borderRadius: '50%',
    backgroundColor: variant === 'error' ? theme.palette.error.light : theme.palette.grey[100],
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: theme.spacing(3),
}));

export const StateTitle = styled(Typography)(({ theme }) => ({
    marginBottom: theme.spacing(1),
    fontWeight: 600,
}));

export const StateDescription = styled(Typography)<{ stateVariant?: 'info' | 'error' }>(({ stateVariant }) => ({
    maxWidth: stateVariant === 'error' ? 500 : 400,
    lineHeight: 1.6,
}));

export const StateButton = styled(Button)(({ theme }) => ({
    paddingLeft: theme.spacing(4),
    paddingRight: theme.spacing(4),
    marginTop: theme.spacing(3),
}));
