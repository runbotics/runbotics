import { Dialog, DialogTitle, Tabs } from '@mui/material';
import styled from 'styled-components';

export const StyledDialog = styled(Dialog)({
    '& .MuiDialog-paper': {
        minHeight: '350px',
    },
});

export const StyledDialogTitle = styled(DialogTitle)({
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
});

export const StyledTabs = styled(Tabs)({
    '& .MuiTabs-flexContainer': {
        gap: '2rem',
    },
});
