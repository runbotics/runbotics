import { FC } from 'react';

import { HomeOutlined, ArrowBack } from '@mui/icons-material';
import { Box, Breadcrumbs, Divider, Grid, Typography } from '@mui/material';
import Link from 'next/link';
import styled, { useTheme } from 'styled-components';

import { translate } from '#src-app/hooks/useTranslations';

const StyledLink = styled(Link)`
    text-decoration: none;
    color: black;
`;

interface CredentialLocationProps {
    credentialName: string;
    collectionId: string;
}

const CredentialLocation: FC<CredentialLocationProps> = ({ credentialName, collectionId }) => {
    const theme = useTheme();
    const allCredentialsPath = '/app/credentials';

    return (
        <Grid container gap={1} justifyContent="center" alignSelf="center">
            <Grid item sx={{ display: 'flex', alignItems: 'center' }}>
                <StyledLink
                    href={{
                        pathname: allCredentialsPath,
                        query: {
                            collectionId
                        }
                    }}
                >
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <ArrowBack fontSize="medium" />
                        <Typography variant="body1" ml={1}>
                            {translate('Credentials.GoBack')}
                        </Typography>
                    </Box>
                </StyledLink>
            </Grid>
            <Divider orientation="vertical" variant="fullWidth" flexItem />
            <Grid item>
                <Breadcrumbs>
                    <Link href={allCredentialsPath}>
                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <HomeOutlined fontSize="medium" sx={{ color: theme.palette.secondary.main }} />
                        </Box>
                    </Link>
                    <Typography variant="body1">{credentialName}</Typography>
                </Breadcrumbs>
            </Grid>
        </Grid>
    );
};
export default CredentialLocation;
