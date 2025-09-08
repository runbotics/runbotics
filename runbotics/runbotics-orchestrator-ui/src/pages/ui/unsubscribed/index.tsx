import React from 'react';

import { Box, Button, Typography, useMediaQuery } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { Container } from '@mui/system';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';

import Logo from '#src-app/components/utils/Logo';
import BackgroundLogo from '#src-app/views/errors/BackgroundLogo';

import { StyledPage, classes } from '../../../src-app/styles/unsubscribed/UnsubscribedView.styles';

const UnsubscribedPage: React.FC = () => {
    const theme = useTheme();
    const mobileDevice = useMediaQuery(theme.breakpoints.down('sm'));
    const logoHeight = mobileDevice ? 100 : 200;
    const router = useRouter();
    const { status } = router.query;

    const getMessage = () => {
        switch (status) {
            case 'success':
                return {
                    title: 'Zrezygnowałeś z powiadomień e-mail o statystykach procesów',
                    description: 'Od tej chwili nie będziesz już otrzymywać wiadomości ze statystykami procesów. Jeśli zmienisz zdanie, zawsze możesz ponownie włączyć powiadomienia w ustawieniach swojego konta.'
                };
            case 'invalid_token':
                return {
                    title: 'Ten link jest już nieważny lub został użyty.',
                    description: ''
                };
            case 'missing_token':
                return {
                    title: 'Brak tokenu wypisania.',
                    description: ''
                };
            case 'error':
                return {
                    title: 'Wystąpił błąd podczas wypisywania.',
                    description: 'Spróbuj ponownie później lub skontaktuj się z administratorem.'
                };
            default:
                return {
                    title: 'Trwa weryfikacja...',
                    description: ''
                };
        }
    };

    const { title, description } = getMessage();

    return (
        <StyledPage className={classes.root} title={title}>
            <BackgroundLogo position="top" />
            <Container maxWidth="lg">
                <Box mt={0} display="flex" justifyContent="center">
                    <Logo height={logoHeight} white />
                </Box>
                {status === 'success' && <Box display="flex" justifyContent="center" mt={2} mb={2}>
                    <Image
                        src="/ui-assets/unsubscribe_mail.svg"
                        alt="Unsubscribe"
                        width={128}
                        height={128}
                    />
                </Box>}
                <Typography
                    align="center"
                    variant="h3"
                    color="textPrimary"
                    sx={{
                        fontWeight: 600,
                        fontSize: mobileDevice ? '24px' : '40px',
                        lineHeight: '47px',
                        paddingBottom: '15px',
                        marginTop: theme.spacing(4),
                    }}
                    gutterBottom
                >
                    {title}
                </Typography>
                {description && (
                    <Typography
                        align="center"
                        variant="body1"
                        color="textSecondary"
                        sx={{ maxWidth: '670px', margin: '0 auto' }}
                        gutterBottom
                    >
                        {description}
                    </Typography>
                )}
                <Box mt={6} display="flex" justifyContent="center">
                    <Link href="/login" passHref>
                        <Button variant="contained" color="primary">
                            Zaloguj się
                        </Button>
                    </Link>
                </Box>
            </Container>
            <BackgroundLogo position="bottom" />
        </StyledPage>
    );
};

export default UnsubscribedPage;
