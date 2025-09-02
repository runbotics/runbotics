import React from 'react';

import { Box, Button, Typography, Container } from '@mui/material';
import Link from 'next/link';

const UnsubscribedPage: React.FC = () => (
    <Container maxWidth="sm" sx={{ minHeight: '80vh', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        <Box textAlign="center" mt={8}>
            <Typography variant="h3" gutterBottom>
                Zostałeś wypisany z powiadomień e-mail
            </Typography>
            <Typography variant="body1" color="textSecondary" gutterBottom>
                Nie będziesz już otrzymywać powiadomień o statystykach procesów na ten adres e-mail.
            </Typography>
            <Box mt={4}>
                <Link href="/" passHref>
                    <Button variant="contained" color="primary">
                        Powrót na stronę główną
                    </Button>
                </Link>
            </Box>
        </Box>
    </Container>
);

export default UnsubscribedPage;
