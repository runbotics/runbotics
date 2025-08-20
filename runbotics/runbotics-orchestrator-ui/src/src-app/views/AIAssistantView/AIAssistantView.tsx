import React, { VFC } from 'react';

import { Typography } from '@mui/material';

import useTranslations from '#src-app/hooks/useTranslations';

import { StyledPage } from './AIAssistantView.styles';

const AIAssistantView: VFC = () => {
    const { translate } = useTranslations();

    const pageTitle = translate('AIAssistant.Title');

    return (
        <StyledPage title={pageTitle}>
            <Typography>{translate('AIAssistant.InProgress')}</Typography>
        </StyledPage>
    );
};

export default AIAssistantView;
