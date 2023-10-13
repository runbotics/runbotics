import {
    CardActionArea,
    Typography
} from '@mui/material';
import styled from 'styled-components';

export const StyledCardActionArea = styled(CardActionArea)`
    && {
        display: flex;
        flex-direction: column;
        justify-content: flex-start;
        height: 100%;
        width: 100%;
    }
`;

export const RunBox = styled.button`
    width: 50px;
    height: 50px;
    background-color: orange;
    color: white;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 30px;
    border: 0;
    cursor: pointer;
`;

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
