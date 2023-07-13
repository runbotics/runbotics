import { FC } from 'react';

import KeyboardDoubleArrowRightRoundedIcon from '@mui/icons-material/KeyboardDoubleArrowRightRounded';

import { Box, Button, CardContent, CircularProgress, Typography } from '@mui/material';

import useTranslations from '#src-app/hooks/useTranslations';

import { classes } from '#src-app/views/auth/LoginPage/LoginPage.styles';

interface Props {
    isGuestSubmitting: boolean;
    handleGuestLogin: () => void;
}

const GuestLoginSection: FC<Props> = ({ isGuestSubmitting, handleGuestLogin }) => {
    const { translate } = useTranslations();

    return (
        <CardContent className={classes.content}>
            <Box
                display="flex"
                flexDirection="column"
                justifyContent="space-between"
                minHeight={300}
            >
                <Box alignItems="center" display="flex" justifyContent="center" mb={0}>
                    <Typography
                        color="textPrimary"
                        gutterBottom
                        variant="h3"
                        sx={{ fontWeight: 700 }}
                    >
                        {translate('Login.Guest.Try')}
                    </Typography>
                </Box>
                <Box mt={1}>
                    <Typography>{translate('Login.Guest.ThanksToIt')}</Typography>
                    <Box className={classes.option} display="flex">
                        <KeyboardDoubleArrowRightRoundedIcon />
                        <Typography>
                            <span>{translate('Login.Guest.Option.1.Pt1')}</span>&nbsp;
                            {translate('Login.Guest.Option.1.Pt2')}&nbsp;
                            <span>{translate('Login.Guest.Option.1.Pt3')}</span>
                        </Typography>
                    </Box>
                    <Box className={classes.option} display="flex">
                        <KeyboardDoubleArrowRightRoundedIcon />
                        <Typography>
                            {translate('Login.Guest.Option.2.Pt1')}&nbsp;
                            <span>{translate('Login.Guest.Option.2.Pt2')}</span>&nbsp;
                            {translate('Login.Guest.Option.2.Pt3')}&nbsp;
                            <span>{translate('Login.Guest.Option.2.Pt4')}</span>&nbsp;
                            {translate('Login.Guest.Option.2.Pt5')}&nbsp;
                            <span>{translate('Login.Guest.Option.2.Pt6')}</span>
                        </Typography>
                    </Box>
                    <Box className={classes.option} display="flex">
                        <KeyboardDoubleArrowRightRoundedIcon />
                        <Typography>{translate('Login.Guest.Option.3')}</Typography>
                    </Box>
                    <Box className={classes.option} display="flex">
                        <KeyboardDoubleArrowRightRoundedIcon />
                        <Typography>{translate('Login.Guest.Option.4')}</Typography>
                    </Box>
                    <Box mt={2}>
                        {isGuestSubmitting ? (
                            <Box display="flex" justifyContent="center">
                                <CircularProgress color="secondary" />
                            </Box>
                        ) : (
                            <Button
                                color="secondary"
                                disabled={isGuestSubmitting}
                                fullWidth
                                size="large"
                                type="button"
                                variant="contained"
                                onClick={handleGuestLogin}
                            >
                                {translate('Login.Guest.Action')}
                            </Button>
                        )}
                    </Box>
                </Box>
            </Box>
        </CardContent>
    );
};

export default GuestLoginSection;
