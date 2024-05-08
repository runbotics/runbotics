import OpenInNewIcon from '@mui/icons-material/OpenInNew';
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

export const TablLink = styled(Link)<{ isActive?: boolean }>`
    && {
        text-decoration: none;
        cursor: pointer;    
        color: ${props => props.isActive ? '#FBB040' : '#000000'};
        border-bottom: ${props => props.isActive ? '0.15rem solid #EA8E05' : 'none'};
    }

    && .MuiButtonBase-root.MuiTab-root {
        opacity: 1;
    }
`;


export const TutorialBlogPost = styled(Typography)`
    display: flex;
    align-items: center;
    height: 100%;
`;

export const TutorialLink = styled(Link)`
    display: flex;
    color: inherit;
`;

export const OpenInNewIconStyled = styled(OpenInNewIcon)`
    margin-left: 8px;
    font-size: 2rem;
`;
