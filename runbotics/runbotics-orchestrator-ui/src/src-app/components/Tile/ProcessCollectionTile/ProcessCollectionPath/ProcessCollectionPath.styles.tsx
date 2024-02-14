import { Box } from '@mui/material';
import Link from 'next/link';
import styled from 'styled-components';

export const StyledLink = styled(Link)`
    text-decoration: none;
`;

export const HomeBox = styled(Box)`
    display: flex;
    min-height: 24px;
    align-items: center;

    gap: 6px;
`;
