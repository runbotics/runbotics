import { Dispatch, SetStateAction, useContext } from 'react';

import { Box, Divider, Grid } from '@mui/material';

import { FrontCredentialCollectionDto, FrontCredentialDto } from 'runbotics-common';

import If from '#src-app/components/utils/If';
import useTranslations from '#src-app/hooks/useTranslations';

import { StyledTypography } from './CredentialsHeader.styles';
import SharedWithInfo from './SharedWithInfo';
import { CredentialsTabs } from '../../GridView/Header';
import { PagingContext } from '../../GridView/Paging.provider';
import Search from '../../GridView/Search/Search';

interface CredentialsHeaderProps<T extends FrontCredentialDto | FrontCredentialCollectionDto> {
    tabName: CredentialsTabs;
    setSearchValue: Dispatch<SetStateAction<string>>;
    sharedWithNumber: number;
}

const CredentialsHeader = <T extends FrontCredentialDto | FrontCredentialCollectionDto>({
    tabName,
    setSearchValue,
    sharedWithNumber,
}: CredentialsHeaderProps<T>) => {
    const { translate } = useTranslations();
    const { totalItems: credentialCount } = useContext(PagingContext);

    const elementsCountMessage =
        tabName === CredentialsTabs.CREDENTIALS
            ? translate('Credentials.List.Header.Elements', { count: credentialCount })
            : translate('Credentials.Collection.List.Header.Elements', { count: credentialCount });

    const handleSearch = (value: string) => {
        setSearchValue(value);
    };

    return (
        <><Box display="flex" flexDirection="row" justifyContent="space-between" mt={2} mb={2} alignItems="center">
            <Grid container display="flex" alignItems="center" justifyContent="flex-start">
                <Grid item mr={6}>
                    <StyledTypography variant="h5" color="textPrimary">
                        {elementsCountMessage}
                    </StyledTypography>
                </Grid>
                <If condition={sharedWithNumber !== null}>
                    <Divider orientation="vertical" flexItem />
                    <Grid item>
                        <SharedWithInfo sharedWithNumber={sharedWithNumber} />
                    </Grid>
                </If>
            </Grid>
            <Search handleSearch={handleSearch} />
        </Box></>
    );
};

export default CredentialsHeader;
