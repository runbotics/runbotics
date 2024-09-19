import { FC } from 'react';

import { Box } from '@mui/material';

import useTranslations from '#src-app/hooks/useTranslations';

import { StyledTypography } from './CredentialsHeader.styles';
import { CredentialsTabs } from '../../GridView/Header';

interface CredentialsHeaderProps {
    credentialCount: number;
    tabName: CredentialsTabs
}

const CredentialsHeader: FC<CredentialsHeaderProps> = ({ credentialCount, tabName }) => {
    const { translate } = useTranslations();
    const elementsCountMessage =
        tabName === CredentialsTabs.CREDENTIALS
            ? translate('Credentials.List.Header.Elements', { count: credentialCount })
            : translate('Credentials.Collection.List.Header.Elements', { count: credentialCount });

    return (
        <Box display="flex" alignItems="center" justifyContent="flex-start" mb={6}>
            <StyledTypography variant="h5" color="textPrimary">
                {elementsCountMessage}
            </StyledTypography>
            <Box display="flex" alignItems="center" flexGrow="1" justifyContent="flex-end" gap="1rem"></Box>
        </Box>
    );
};

export default CredentialsHeader;
