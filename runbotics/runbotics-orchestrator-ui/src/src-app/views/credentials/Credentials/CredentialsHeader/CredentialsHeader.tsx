import { useState } from 'react';

import { Box } from '@mui/material';

import useTranslations from '#src-app/hooks/useTranslations';


import { StyledTypography } from './CredentialsHeader.styles';
import { BasicCredentialDto } from '../../Credential/Credential.types';
import { BasicCredentialsCollectionDto } from '../../CredentialsCollection/CredentialsCollection.types';
import { CredentialsTabs } from '../../GridView/Header';

interface CredentialsHeaderProps<T extends BasicCredentialDto | BasicCredentialsCollectionDto> {
    credentialCount: number;
    tabName: CredentialsTabs;
    items: (T[]);
    setItems: (items: T[]) => void;
}

const CredentialsHeader = <T extends BasicCredentialDto | BasicCredentialsCollectionDto>({ credentialCount, tabName, items, setItems }: CredentialsHeaderProps<T>) => {
    const { translate } = useTranslations();
    const elementsCountMessage =
        tabName === CredentialsTabs.CREDENTIALS
            ? translate('Credentials.List.Header.Elements', { count: credentialCount })
            : translate('Credentials.Collection.List.Header.Elements', { count: credentialCount });

    const [searchValue, setSearchValue] = useState('');

    const handleSearch = (value: string) => {
        setSearchValue(value);
        const foundItems = items.filter((item => item.name.toLowerCase().includes(value.toLocaleLowerCase())));

        setItems(foundItems);
    };

    return (
        <Box display="flex" alignItems="center" justifyContent="flex-start">
            <StyledTypography variant="h5" color="textPrimary">
                {elementsCountMessage}
            </StyledTypography>
        </Box>
    );
};

export default CredentialsHeader;
