import { Grid } from '@mui/material';

import styled from 'styled-components';

import CredentialLocation from './CredentialLocation';

const StyledGrid = styled(Grid)(
    ({ theme }) => `
    margin-bottom: ${theme.spacing(3)};
    spacing: ${theme.spacing(2)};
`
);

interface HeaderProps {
    credentialName: string;
}

export const Header: React.FC<HeaderProps> = ({ credentialName }) => (
    <StyledGrid container alignItems="center" justifyContent="space-between">
        <Grid item>
            <CredentialLocation credentialName={credentialName} />
        </Grid>
    </StyledGrid>
);

export default Header;
