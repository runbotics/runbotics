import React, { VFC } from 'react';

import { Typography } from '@mui/material';

import { useRouter } from 'next/router';

import useAuth from '#src-app/hooks/useAuth';
import useTranslations from '#src-app/hooks/useTranslations';

import { StyledPage } from './AIAssistantView.styles';


const AIAssistantView: VFC = () => {
    const { translate } = useTranslations();
    const { user } = useAuth();
    const router = useRouter();


    const pageTitle = translate('AIAssistant.Title');

    const isTenantDefault = user.tenant.id === 'b7f9092f-5973-c781-08db-4d6e48f78e98'; // temporary additional check

    if (!isTenantDefault) {
        router.replace('/');
    }

    return (
        <StyledPage title={pageTitle}>
            <Typography>{translate('AIAssistant.InProgress')}</Typography>
        </StyledPage>
    );
};

export default AIAssistantView;
