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
    collectionId: string;
}

export const Header: React.FC<HeaderProps> = ({ credentialName, collectionId }) => (
    <StyledGrid container alignItems="center" justifyContent="space-between">
        <Grid item>
            <CredentialLocation credentialName={credentialName} collectionId={collectionId}/>
        </Grid>
    </StyledGrid>
);

export default Header;
