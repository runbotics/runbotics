import React, { VFC } from 'react';


import useTranslations from '#src-app/hooks/useTranslations';

import { StyledIFrame, StyledPage } from './AIAssistantView.styles';

const AIAssistantView: VFC = () => {
    const { translate } = useTranslations();

    const pageTitle = translate('AIAssistant.Title');

    return (
        <StyledPage title={pageTitle}>
            <StyledIFrame src='/ai-assistant' width="100%" height="100%"/>
        </StyledPage>
    );
};

export default AIAssistantView;
