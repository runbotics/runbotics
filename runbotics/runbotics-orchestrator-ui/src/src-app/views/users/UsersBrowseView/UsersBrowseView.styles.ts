import { Grid } from '@mui/material';
import styled from 'styled-components';

import UsersViewHeader from './UsersViewHeader';

export const StyledHeaderGrid = styled(Grid)(
    ({ theme }) => `
    margin-bottom: ${theme.spacing(2)};
    & + & {
        margin-left: ${theme.spacing(1)};
    }
`);

export const StyledUsersViewHeader = styled(UsersViewHeader)`
    margin-bottom: 20px;
`;
