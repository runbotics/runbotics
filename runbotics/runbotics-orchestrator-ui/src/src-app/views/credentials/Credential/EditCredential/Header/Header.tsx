import { FC } from 'react';

import { ArrowBack } from '@mui/icons-material';
import { Grid, Typography } from '@mui/material';

import Link from 'next/link';
import styled from 'styled-components';

import useTranslations from '#src-app/hooks/useTranslations';

import { GoBackSpan } from '../EditCredential.styles';

const StyledLink = styled(Link)(({ theme }) => `
    text-decoration: none;
    color: ${theme.palette.common.black};
`
);

interface HeaderProps {
    collectionId: string;
    collectionName: string;
}

const Header: FC<HeaderProps> = ({ collectionId, collectionName }) => {
    const allCredentialsPath = {
        pathname: '/app/credentials',
        query: {
            collectionId
        }
    };
    const { translate } = useTranslations();

    return (
        <Grid container gap={1} alignSelf="center" mb={3}>
            <Grid item sx={{ display: 'flex', alignItems: 'center' }}>
                <StyledLink
                    href={allCredentialsPath}>
                    <GoBackSpan>
                        <ArrowBack/>
                        <Typography variant="body1" ml={1} fontWeight={500}>
                            {translate('Credential.Edit.GoBack', { collectionName: collectionName })}
                        </Typography>
                    </GoBackSpan>
                </StyledLink>
            </Grid>
        </Grid>
    );
};

export default Header;
