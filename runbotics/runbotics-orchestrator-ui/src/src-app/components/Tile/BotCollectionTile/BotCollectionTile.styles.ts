import { CardContent, SvgIcon } from '@mui/material';
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
