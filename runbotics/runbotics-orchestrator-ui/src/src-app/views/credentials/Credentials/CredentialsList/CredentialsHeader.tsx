import { FC } from 'react';

import { Box, Typography } from '@mui/material';
import styled from 'styled-components';

import useTranslations from '#src-app/hooks/useTranslations';


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

interface CredentialsHeaderProps {
    credentialCount: number
}

const CredentialsHeader: FC<CredentialsHeaderProps> = ({credentialCount}) => {
    const { translate } = useTranslations();

    return (
        <Box display="flex" alignItems="center" justifyContent="space-between">
            <StyledTypography variant="h5" color="textPrimary">
                {translate('Credentials.List.Header.Elements', { count: credentialCount })}
            </StyledTypography>
            <Box display="flex" alignItems="center" flexGrow="1" justifyContent="flex-end" gap="1rem">
            </Box>
        </Box>
    );
};

export default CredentialsHeader;
