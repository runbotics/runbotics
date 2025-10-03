import React, { VFC } from 'react';

import useTranslations from '#src-app/hooks/useTranslations';

import { StyledIFrame, StyledPage } from './AIAssistantDetailsView.styles';

interface AIAssistantDetailsViewProps {
    assistantUrl: string;
}

const AIAssistantDetailsView: VFC<AIAssistantDetailsViewProps> = ({ assistantUrl }) => {
    const { translate } = useTranslations();

    const pageTitle = translate('AIAssistant.Title');

    return (
        <StyledPage title={pageTitle}>
            <StyledIFrame src={`/assistant/${assistantUrl}`} />
        </StyledPage>
    );
};

export default AIAssistantDetailsView;
