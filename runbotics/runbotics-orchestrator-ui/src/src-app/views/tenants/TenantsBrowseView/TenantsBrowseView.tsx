import React, { VFC } from 'react';

import InternalPage from '#src-app/components/pages/InternalPage';
import useTranslations from '#src-app/hooks/useTranslations';

import TenantsBrowseViewHeader from './TenantsBrowseViewHeader';
import TenantsListView from '../TenantsListView';

const TenantsBrowseView: VFC = () => {
    const { translate } = useTranslations();

    return (
        <>
            <InternalPage title={translate('Tenants.Browse.Header.Title')}>
                <TenantsBrowseViewHeader />
                <TenantsListView />
            </InternalPage>
        </>
    );
};

export default TenantsBrowseView;
