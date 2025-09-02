import React, { useEffect, useState } from 'react';

import { Box, Button, Typography, useMediaQuery, styled } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { Container } from '@mui/system';
import axios from 'axios';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';

import Loader from '#src-app/components/Loader';

import Page from '#src-app/components/pages/Page';
import Logo from '#src-app/components/utils/Logo';
import BackgroundLogo from '#src-app/views/errors/BackgroundLogo';

const PREFIX = 'UnsubscribedView';

const classes = {
    root: `${PREFIX}-root`,
};

const StyledPage = styled(Page)(({ theme }) => ({
    [`&.${classes.root}`]: {
        backgroundColor: theme.palette.background.white,
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: theme.spacing(3),
        paddingTop: 80,
        paddingBottom: 80,
        position: 'relative',
        overflow: 'hidden',
        zIndex: 1,
        isolation: 'isolate',
    },
}));

const UnsubscribedPage: React.FC = () => {
    const theme = useTheme();
    const mobileDevice = useMediaQuery(theme.breakpoints.down('sm'));
    const logoHeight = mobileDevice ? 100 : 200;
    const router = useRouter();
    const { token } = router.query;

    const [status, setStatus] = useState<'pending' | 'valid' | 'invalid'>('pending');

    useEffect(() => {
        if (!token) return;
        axios.get(`/api/scheduler/unsubscribe/validate?token=${token}`)
            .then(() => setStatus('valid'))
            .catch(() => setStatus('invalid'));
    }, [token]);

    if (status === 'pending') {
        return (<Loader />);
    }

    if (status === 'invalid') {
        return (
            <StyledPage className={classes.root} title="Token nieważny">
                <BackgroundLogo position="top" />
                <Container maxWidth="lg">
                    <Box mt={0} display="flex" justifyContent="center">
                        <Logo height={logoHeight} white />
                    </Box>
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
                        Ten link jest już nieważny lub został użyty.
                    </Typography>
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
    }

    return (
        <StyledPage className={classes.root} title="Zrezygnowałeś z powiadomień e-mail o statystykach procesów">
            <BackgroundLogo position="top" />
            <Container maxWidth="lg">
                <Box mt={0} display="flex" justifyContent="center">
                    <Logo height={logoHeight} white />
                </Box>
                <Box display="flex" justifyContent="center" mt={2} mb={2}>
                    <Image
                        src="/ui-assets/unsubscribe_mail.svg"
                        alt="Unsubscribe"
                        width={64}
                        height={64}
                    />
                </Box>
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
                    Zrezygnowałeś z powiadomień e-mail o statystykach procesów
                </Typography>
                <Typography
                    align="center"
                    variant="body1"
                    color="textSecondary"
                    sx={{ maxWidth: '670px', margin: '0 auto' }}
                    gutterBottom
                >
                    Od tej chwili nie będziesz już otrzymywać wiadomości ze statystykami procesów. Jeśli zmienisz zdanie, zawsze możesz ponownie włączyć powiadomienia w ustawieniach swojego konta.
                </Typography>
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
