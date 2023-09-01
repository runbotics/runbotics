import {
    CardContent,
    SvgIcon,
    CardHeader,
    CardActionArea,
    Typography,
} from '@mui/material';
import styled from 'styled-components';

export const StyledSvg = styled(SvgIcon)(({ theme }) => `
    margin-left: ${theme.spacing(2)};
    margin-right: ${theme.spacing(1)};
`);

export const StyledContent = styled(CardContent)`
    display: grid;
    grid-template-columns: 1fr 1.5fr;
    grid-template-rows: repeat(2, auto);
    justify-items: start;
    justify-content: space-evenly;
    width: 100%;

    padding: 0 1.5rem 1rem 1.5rem;
    gap: 1rem;
`;

export const Footer = styled.div`
    display: flex;
    justify-content: flex-end;
    align-items: center;

    padding: 0.625rem 0.875rem;
    gap: 2rem;

    & > button {
        padding: 0.3125rem;
    }
`;

export const IconsWrapper = styled.div`
    display: flex;
    align-items: center;
`;

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
