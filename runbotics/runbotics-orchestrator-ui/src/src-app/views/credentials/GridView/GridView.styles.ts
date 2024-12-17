import { Typography } from '@mui/material';
import styled from 'styled-components';

export const TileGrid = styled.div`
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(400px, 1fr));
    align-items: stretch;
    gap: 1rem;
`;

export const TypographyPlaceholder = styled(Typography)(({ theme }) => `
    color: ${theme.palette.grey[500]};
`);
