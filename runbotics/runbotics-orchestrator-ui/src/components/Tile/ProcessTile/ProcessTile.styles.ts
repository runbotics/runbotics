import { CardContent, SvgIcon, CardActionArea, Typography } from '@mui/material';
import styled from 'styled-components';

export const StyledSvg = styled(SvgIcon)(({ theme }) => `
    margin-left: ${theme.spacing(2)};
    margin-right: ${theme.spacing(1)};
`);

export const StyledContent = styled(CardContent)`
    display: grid;
    width: 100%;
    grid-template-columns: 1fr 1.5fr;
    grid-template-rows: repeat(2, auto);
    justify-items: start;
    justify-content: space-evenly;
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

export const DescriptionWrapper = styled.div`
    width: 90%;
    margin-top: auto;
    margin-right: auto;
    margin-bottom: 1.125rem;
    margin-left: auto;
`

export const StyledCardActionArea = styled(CardActionArea)`
    && {
        height: 100%;
        display: flex;
        align-items: flex-start;
        flex-direction: column;
        justify-content: space-between;
    }
`

export const Description = styled(Typography)`
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
`