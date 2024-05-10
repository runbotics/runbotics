import React from 'react';

import { HomeOutlined, ArrowBack} from '@mui/icons-material';
import { Box, Breadcrumbs, Divider, Grid, Typography } from '@mui/material';
import Link from 'next/link';
import { useRouter } from 'next/router';
import styled, { useTheme } from 'styled-components';

import { translate } from '#src-app/hooks/useTranslations';

const StyledLink = styled(Link)`
    text-decoration: none;
`;

const CredentialLocation = () => {
    const router = useRouter();
    const theme = useTheme();

    const isRootFolder = true;
    return (

        <Grid container gap={1} justifyContent='center' alignSelf="center">
            <Grid item sx={{display: 'flex', alignItems: 'center'}}>
                <StyledLink href='/app/credentials' >
                    <Box sx={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>    
                        <ArrowBack/>
                        <Typography variant='body2'>
                            {translate('Credentials.GoBack')}
                        </Typography>
                    </Box>
                </StyledLink>
            </Grid>
            <Divider orientation="vertical" variant="middle" flexItem/>
            <Grid item>
                <Breadcrumbs >
                    <Link href={{
                        pathname: router.pathname,
                        query: {
                            ...router.query,
                        }
                    }}>
                        <Box>
                            <HomeOutlined
                                sx={{
                                    color: isRootFolder
                                        ? theme.palette.secondary.main
                                        : theme.palette.common.black
                                }}
                            />
                        </Box>
                    </Link>
                    <Typography
                        variant='body2'
                    >
                        Nowy credential
                    </Typography>
                </Breadcrumbs>
            </Grid>
        </Grid>
    );
}
;
    

export default CredentialLocation;
