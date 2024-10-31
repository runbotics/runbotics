import { Grid, Card, Typography, IconButton } from '@mui/material';
import { grey } from '@mui/material/colors';
import styled from 'styled-components';

export const StyledGridContainer = styled(Grid)(
    ({ theme }) => `
    padding: ${theme.spacing(1)};
    align-items: flex-end;
    `
);

export const StyledAttributeCard = styled(Card)<{ iseditmode: string }>(
    ({ theme, iseditmode }) => `
    border: 1px solid ${grey[400]};
    padding: ${theme.spacing(1)};
    display: flex;

    &.MuiCard-root {
        background-color: ${iseditmode ? grey[50] : grey[200]};
    }
    `
);

export const AttributeInfoNotEdiable = styled(Typography)(({ theme }) => `
    &.MuiTypography-root {
        margin-left: ${theme.spacing(1)};
    }
    color: ${grey[600]};
    display: inline-block;
`
);

export const AttributeIcon = styled(IconButton)(
    ({ theme }) => `
    margin-right: ${theme.spacing(1)};
`
);

export const CustomButtonIcon = styled(IconButton)(
    ({ theme }) => `
    &.MuiIconButton-root {
        margin-left: ${theme.spacing(1)};
        border-radius: 50%;
        align-self: center;

        &:hover {
            background-color: ${grey[300]};
        }
    }
`
);
