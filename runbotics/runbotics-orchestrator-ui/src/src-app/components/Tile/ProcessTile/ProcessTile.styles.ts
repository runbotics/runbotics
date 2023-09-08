import {
    CardHeader,
    CardActionArea,
    Typography,
} from '@mui/material';
import styled from 'styled-components';

export const StyledCardHeader = styled(CardHeader)(({ theme }) => `
    &:hover {
        cursor: pointer;
        background-image: linear-gradient(180deg, ${theme.palette.grey[200]} 10%, ${theme.palette.background.paper} 90%);
    }
`);

export const StyledCardActionArea = styled(CardActionArea)(({ theme }) => `
    && {
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        height: 100%;
        width: 100%;
        background-color: ${theme.palette.background.paper};
        margin-top: 10px;
    }
`);

export const Description = styled(Typography)`
    && {
        display: -webkit-box;
        max-width: 90%;
        -webkit-line-clamp: 4;
        -webkit-box-orient: vertical;
        overflow: hidden;
        word-break: break-word;
    }
`;
