import { Box, Typography } from '@mui/material';
import styled from 'styled-components';

import useTranslations from '#src-app/hooks/useTranslations';

import { getCredentials } from '../Credentials.utils';

const StyledTypography = styled(Typography)(({ theme }) => ({
    position: 'relative',
    '&:after': {
        position: 'absolute',
        bottom: -8,
        left: 0,
        content: '" "',
        height: 3,
        width: 48,
        backgroundColor: theme.palette.primary.main,
    },
}));

const CredentialsHeader = () => {
    const { translate } = useTranslations();
    const credentialsCount = getCredentials().length;

    return (
        <Box display="flex" alignItems="center" justifyContent="space-between">
            <StyledTypography variant="h5" color="textPrimary">
                {translate('Credentials.List.Header.Elements', { count: credentialsCount })}
            </StyledTypography>
            <Box display="flex" alignItems="center" flexGrow="1" justifyContent="flex-end" gap="1rem">
            </Box>
        </Box>
    );
};

export default CredentialsHeader;
