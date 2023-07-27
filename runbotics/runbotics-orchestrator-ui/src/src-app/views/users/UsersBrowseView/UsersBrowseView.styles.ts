import { Grid } from '@mui/material';
import styled from 'styled-components';

import Header from './Header';

export const StyledHeader = styled(Header)`
    margin-bottom: 20px;
`;

const PREFIX_HEADER = 'Header';

export const classesHeader = {
    root: `${PREFIX_HEADER}-root`,
    action: `${PREFIX_HEADER}-action`,
};

export const StyledHeaderGrid = styled(Grid)(({ theme }) => ({
    [`& .${classesHeader.action}`]: {
        marginBottom: theme.spacing(1),
        '& + &': {
            marginLeft: theme.spacing(1),
        },
    },
}));
