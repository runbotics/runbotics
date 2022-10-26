import React, { FC } from 'react';
import styled from 'styled-components';
import RouterLink from 'next/link';
import { Box, Button, Container, Typography, useMediaQuery } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import Page from 'src/components/pages/Page';
import Logo from 'src/components/utils/Logo';
import useTranslations from 'src/hooks/useTranslations';

const PREFIX = 'NotFoundView';

const classes = {
    root: `${PREFIX}-root`,
    image: `${PREFIX}-image`,
};

const StyledPage = styled(Page)(({ theme }) => ({
    [`&.${classes.root}`]: {
        backgroundColor: theme.palette.background.default,
        minHeight: '100%',
        display: 'flex',
        alignItems: 'center',
        padding: theme.spacing(3),
        paddingTop: 80,
        paddingBottom: 80,
    },

    [`& .${classes.image}`]: {
        maxWidth: '100%',
        width: 560,
        maxHeight: 300,
        height: 'auto',
    },
}));

const NotFoundPage: FC = () => {
    const theme = useTheme();
    const mobileDevice = useMediaQuery(theme.breakpoints.down('sm'));
    const { translate } = useTranslations();

    return (
        <StyledPage className={classes.root} title={translate('Error404.Meta.Title')}>
            <Container maxWidth="lg">
                <Box mt={0} display="flex" justifyContent="center">
                    <Logo className={classes.image} simple />
                </Box>
                <Typography align="center" variant={mobileDevice ? 'h4' : 'h1'} color="textPrimary">
                    {translate('Error404.View.Title')}
                </Typography>
                <Typography align="center" variant="subtitle2" color="textSecondary">
                    {translate('Error404.View.Message')}
                </Typography>

                <Box mt={6} display="flex" justifyContent="center">
                    <RouterLink href="/" passHref>
                        <Button color="secondary" variant="outlined">
                            {translate('Error404.View.BackToHome')}
                        </Button>
                    </RouterLink>
                </Box>
            </Container>
        </StyledPage>
    );
};

export default NotFoundPage;
