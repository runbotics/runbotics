import { ChangeEvent } from 'react';

import { Grid, Stack, Tab, Tabs } from '@mui/material';
import { useRouter } from 'next/router';

import If from '#src-app/components/utils/If';
import useTranslations from '#src-app/hooks/useTranslations';

import { getLastParamOfUrl } from '../../utils/routerUtils';
import AddCredentialButton from '../Credential/AddCredentialButton';
import AddCredentialsCollectionButton from '../CredentialsCollection/AddCredentialsCollectionButton';

export enum CredentialsTabs {
    CREDENTIALS = 'credentials',
    COLLECTIONS = 'collections'
}

const Header = () => {
    const { translate } = useTranslations();

    const router = useRouter();

    const currentTab = getLastParamOfUrl(router);

    const onTabChange = (event: ChangeEvent<HTMLInputElement>, tabValue: CredentialsTabs) => {
        if (tabValue === CredentialsTabs.CREDENTIALS) {
            router.replace({
                pathname: '/app/credentials',
            });
        } else {
            router.replace({
                pathname: '/app/credentials/collections',
            });
        }
    };

    const credenitalsTabs = (
        <Tabs
            onChange={onTabChange}
            value={currentTab}
            textColor="secondary"
        >
            <Tab
                key={CredentialsTabs.COLLECTIONS}
                value={CredentialsTabs.COLLECTIONS}
                label={translate('Credentials.Tab.Collections')}
            />
            <Tab
                key={CredentialsTabs.CREDENTIALS}
                value={CredentialsTabs.CREDENTIALS}
                label={translate('Credentials.Tab.Credentials')}
            />
        </Tabs>
    );

    return (
        <Grid
            alignItems="center"
            container
            justifyContent="space-between"
            spacing={3}
        >
            <Grid item>
                {credenitalsTabs}
            </Grid>
            <Grid item>
                <Stack direction="row" spacing={2}>
                    <If condition={currentTab === CredentialsTabs.CREDENTIALS}>
                        <AddCredentialButton/>
                    </If>
                    <If condition={currentTab === CredentialsTabs.COLLECTIONS}>
                        <AddCredentialsCollectionButton/>
                    </If>
                </Stack>
            </Grid>
        </Grid>
    );
};

export default Header;
