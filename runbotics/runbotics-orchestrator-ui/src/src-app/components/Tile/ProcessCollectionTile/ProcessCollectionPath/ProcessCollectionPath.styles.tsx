import { Box } from '@mui/material';
import Link from 'next/link';
import styled from 'styled-components';

export const StyledLink = styled(Link)`
    text-decoration: none;
`;

export const HomeBox = styled(Box)`
    display: flex;
    align-items: center;
    min-height: 24px;

    gap: 6px;
`;
