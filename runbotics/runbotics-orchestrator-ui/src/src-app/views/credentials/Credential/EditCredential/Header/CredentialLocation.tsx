import { FC } from 'react';

import { HomeOutlined, ArrowBack } from '@mui/icons-material';
import { Box, Breadcrumbs, Divider, Grid, Typography } from '@mui/material';
import Link from 'next/link';
import { useRouter } from 'next/router';
import styled, { useTheme } from 'styled-components';

import { translate } from '#src-app/hooks/useTranslations';

const StyledLink = styled(Link)`
    text-decoration: none;
`;

interface CredentialLocationProps {
    credentialName: string;
}

const CredentialLocation: FC<CredentialLocationProps> = ({ credentialName }) => {
    const router = useRouter();
    const theme = useTheme();

    const isRootFolder = true;
    
    return (
        <Grid container gap={1} justifyContent="center" alignSelf="center">
            <Grid item sx={{ display: 'flex', alignItems: 'center' }}>
                <StyledLink href="/app/credentials">
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
                    <Link
                        href={{
                            pathname: router.pathname,
                            query: {
                                ...router.query
                            }
                        }}
                    >
                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <HomeOutlined
                                fontSize="medium"
                                sx={{
                                    color: isRootFolder ? theme.palette.secondary.main : theme.palette.common.black
                                }}
                            />
                        </Box>
                    </Link>
                    <Typography variant="body1">{credentialName}</Typography>
                </Breadcrumbs>
            </Grid>
        </Grid>
    );
};
export default CredentialLocation;
