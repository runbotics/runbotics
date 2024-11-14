import { Typography } from '@mui/material';
import styled from 'styled-components';

export const TileGrid = styled.div`
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(400px, 1fr));
    grid-auto-rows: 1fr;
    min-height: 8rem;
    gap: 1rem;
`;

export const TypographyPlaceholder = styled(Typography)(({ theme }) => `
    color: ${theme.palette.grey[500]};
`);
