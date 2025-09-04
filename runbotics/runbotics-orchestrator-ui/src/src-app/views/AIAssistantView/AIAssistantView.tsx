import React, { VFC } from 'react';



import useAuth from '#src-app/hooks/useAuth';
import useTranslations from '#src-app/hooks/useTranslations';

import { redirectToWebsiteRoot } from '#src-app/utils/navigation';

import { StyledIFrame, StyledPage } from './AIAssistantView.styles';


const AIAssistantView: VFC = () => {
    const { translate } = useTranslations();
    const { user } = useAuth();


    const pageTitle = translate('AIAssistant.Title');

    const isTenantDefault = user.tenant.id === 'b7f9092f-5973-c781-08db-4d6e48f78e98'; // temporary additional check

    if (!isTenantDefault) {
        redirectToWebsiteRoot(user.langKey);
    }

    return (
        <StyledPage title={pageTitle}>
            <StyledIFrame src='/ai-assistant'/>
        </StyledPage>
    );
};

export default AIAssistantView;
