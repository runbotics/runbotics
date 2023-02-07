
import { Button } from '@mui/material';
import styled from 'styled-components';

export const ClearButton = styled(Button)(({ theme }) => `
    && {
        margin-left: ${theme.spacing(1)};
        background-color: ${theme.palette.grey.A700};
        color: ${theme.palette.error.contrastText};
        &:hover {
            background-color: ${theme.palette.common.black};
        }
    }
`,
);

export const PeriodText = styled.span`
    padding-left: 5px;
    font-weight: bold;
`;
