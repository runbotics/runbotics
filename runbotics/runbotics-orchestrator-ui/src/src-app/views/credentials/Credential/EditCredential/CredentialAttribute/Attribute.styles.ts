import { Grid, Card, Typography, IconButton } from '@mui/material';
import { grey } from '@mui/material/colors';
import styled from 'styled-components';

export const StyledGridContainer = styled(Grid)(
    ({ theme }) => `
    padding: ${theme.spacing(1)};
    `
);

export const StyledCustomAttributeCard = styled(Card)(
    ({ theme }) => `
    background-color: ${grey[100]};
    border: 1px solid ${grey[400]};
    min-height: 260px;
    padding: ${theme.spacing(1)};
`
);

export const StyledAttributeCard = styled(Card)(
    ({ theme }) => `
    background-color: ${grey[100]};
    border: 1px solid ${grey[400]};
    min-height: 210px;
    padding: ${theme.spacing(1)};
`
);

export const AttributeInfoNotEdiable = styled(Typography)(
    () => `
    &.MuiTypography-root {
        margin-left: 0.5rem;
    }
    color: ${grey[600]};
    display: inline-block;
`
);

export const StyledAddCard = styled(Card)`
    cursor: pointer;
    min-height: 260px;
    display: flex;
    justify-content: center;
    align-items: center;
    border: 1px solid ${grey[200]};
    transition: background-color 0.3s ease;

    &:hover {
        background-color: ${grey[100]};
        border: 1px solid ${grey[400]};
    }
`;

export const AttributeIcon = styled(IconButton)(
    ({ theme }) => `
    margin-right: ${theme.spacing(1)}
`
);
