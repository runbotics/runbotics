import { FC } from 'react';

import { Box } from '@mui/material';

import useTranslations from '#src-app/hooks/useTranslations';

import { StyledTypography } from './CredentialsHeader.styles';



interface CredentialsHeaderProps {
    credentialCount: number;
}

const CredentialsHeader: FC<CredentialsHeaderProps> = ({ credentialCount }) => {
    const { translate } = useTranslations();

    return (
        <Box display="flex" alignItems="center" justifyContent="flex-start" mb={6}>
            <StyledTypography variant="h5" color="textPrimary">
                {translate('Credentials.List.Header.Elements', { count: credentialCount })}
            </StyledTypography>
            <Box display="flex" alignItems="center" flexGrow="1" justifyContent="flex-end" gap="1rem"></Box>
        </Box>
    );
};

export default CredentialsHeader;
