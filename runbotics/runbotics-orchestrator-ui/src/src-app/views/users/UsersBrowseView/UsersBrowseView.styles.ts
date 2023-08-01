import { Grid } from '@mui/material';
import styled from 'styled-components';

import UsersBrowseViewHeader from './UsersBrowseViewHeader';

export const StyledHeaderGrid = styled(Grid)(
    ({ theme }) => `
    margin-bottom: ${theme.spacing(2)};
    & + & {
        margin-left: ${theme.spacing(1)};
    }
`);

export const StyledUsersViewHeader = styled(UsersBrowseViewHeader)`
    margin-bottom: 20px;
`;
