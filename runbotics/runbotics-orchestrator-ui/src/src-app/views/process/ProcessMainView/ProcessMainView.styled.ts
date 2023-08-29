import { Typography } from '@mui/material';

import Link from 'next/link';
import styled from 'styled-components';

import InternalPage from '#src-app/components/pages/InternalPage';

export const ProcessTitle = styled(Typography)`
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100%;
    text-align: center;
`;

export const ProcessInternalPage = styled(InternalPage)`
    padding-top: 0;
    padding-bottom: 0;

    > [class*="MuiContainer"] {
        padding-left: 0;
        padding-right: 0;
    }
`;

export const TutorialBlogPost = styled(Typography)`
    display: flex;
    align-items: center;
    height: 100%;
`;

export const TutorialLink = styled(Link)`
    text-decoration: none;
    color: inherit;

    &:hover {
        text-decoration: underline;
    }
`;
