import { SvgIcon } from '@mui/material';
import styled from 'styled-components';

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

export const StyledSvg = styled(SvgIcon)(({ theme }) => `
    margin-left: ${theme.spacing(2)};
    margin-right: ${theme.spacing(1)};
`);
