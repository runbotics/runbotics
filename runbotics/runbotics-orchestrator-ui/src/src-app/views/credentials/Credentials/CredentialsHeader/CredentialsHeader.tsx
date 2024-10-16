import { useState } from 'react';


import { Divider, Grid } from '@mui/material';

import If from '#src-app/components/utils/If';
import useTranslations from '#src-app/hooks/useTranslations';


import { StyledTypography } from './CredentialsHeader.styles';
import SharedWithInfo from './SharedWithInfo';
import { FrontCredentialDto } from '../../Credential/Credential.types';
import { FrontCredentialCollectionDto } from '../../CredentialsCollection/CredentialsCollection.types';
import { CredentialsTabs } from '../../GridView/Header';
import Search from '../../GridView/Search/Search';

interface CredentialsHeaderProps<T extends FrontCredentialDto | FrontCredentialCollectionDto> {
    credentialCount: number;
    tabName: CredentialsTabs;
    items: (T[]);
    setItems: (items: T[]) => void;
    sharedWithNumber: number;
}

const CredentialsHeader = <T extends FrontCredentialDto | FrontCredentialCollectionDto>({ credentialCount, tabName, items, setItems, sharedWithNumber }: CredentialsHeaderProps<T>) => {
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
        <>
            <Grid container display="flex" alignItems="center" justifyContent="flex-start">
                <Grid item mr={6}>
                    <StyledTypography variant="h5" color="textPrimary">
                        {elementsCountMessage}
                    </StyledTypography>
                </Grid>
                <If condition={sharedWithNumber !== null}>
                    <Divider orientation="vertical" flexItem/>
                    <Grid item>
                        <SharedWithInfo sharedWithNumber={sharedWithNumber}/>
                    </Grid>
                </If>
            </Grid>
            <Search searchValue={searchValue} handleSearch={handleSearch}/>
        </>
    );
};

export default CredentialsHeader;
