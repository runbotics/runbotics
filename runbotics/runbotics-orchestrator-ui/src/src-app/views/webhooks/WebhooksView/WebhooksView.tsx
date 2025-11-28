import React, { FC } from 'react';

import InternalPage from '#src-app/components/pages/InternalPage';
import useTranslations from '#src-app/hooks/useTranslations';

const WebhooksView: FC = () => {
    const { translate } = useTranslations();

    return (
        <>
            <InternalPage
                title={translate('Webhooks.Title')}
            >
                Work in progress...
            </InternalPage>
        </>
    );
};

export default WebhooksView;
