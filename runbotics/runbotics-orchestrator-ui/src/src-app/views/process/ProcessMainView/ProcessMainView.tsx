import React, { FC, useEffect } from 'react';

import { Divider, Grid, Tab, Tabs } from '@mui/material';

import { useRouter } from 'next/router';
import { FeatureKey, Role } from 'runbotics-common';


import { hasFeatureKeyAccess } from '#src-app/components/utils/Secured';
import useAuth from '#src-app/hooks/useAuth';
import { useOwner } from '#src-app/hooks/useOwner';
import useRole from '#src-app/hooks/useRole';
import useTranslations from '#src-app/hooks/useTranslations';
import { useDispatch, useSelector } from '#src-app/store';
import { processActions } from '#src-app/store/slices/Process';
import { ProcessTab } from '#src-app/utils/process-tab';

import ProcessMainViewManager from './ProcessMainView.manager';
import {
    OpenInNewIconStyled,
    ProcessInternalPage,
    ProcessTitle,
    TutorialBlogPost,
    TutorialLink
} from './ProcessMainView.styled';

const ProcessMainView: FC = () => {
    const router = useRouter();
    const dispatch = useDispatch();
    const { process } = useSelector((state) => state.process.draft);
    const { id, tab } = router.query;
    const { translate } = useTranslations();
    const { user } = useAuth();
    const isGuest = useRole([Role.ROLE_GUEST]);
    const isProcessOwner = useOwner();
    const isAdmin = useRole([Role.ROLE_ADMIN]);

    useEffect(() => () => {
        dispatch(processActions.resetDraft());
    }, []);

    const processTabs = [
        {
            value: ProcessTab.BUILD,
            label: translate('Process.MainView.Tabs.Build.Title'),
            featureKeys: [FeatureKey.PROCESS_BUILD_VIEW],
            show: true,
        },
        {
            value: ProcessTab.RUN,
            label: translate('Process.MainView.Tabs.Run.Title'),
            featureKeys: [FeatureKey.PROCESS_RUN_VIEW],
            show: true,
        },
        {
            value: ProcessTab.CONFIGURE,
            label: translate('Process.MainView.Tabs.Configure.Title'),
            featureKeys: [FeatureKey.PROCESS_CONFIGURE_VIEW],
            show: process?.isPublic ? (isAdmin || isProcessOwner(process.createdBy?.id)) : true,
        },
    ].filter((processTab) => hasFeatureKeyAccess(user, processTab.featureKeys) && processTab.show);

    const handleMainTabsChange = (processTab: ProcessTab) => {
        router.push({ pathname: `/app/processes/${id}/${processTab}` });
    };

    return (
        <ProcessInternalPage title={translate('Process.MainView.Meta.Title')} fullWidth>
            <Grid container>
                <Grid item my={1} ml={1} display={'flex'} gap={2}>
                    <Tabs
                        onChange={(_, processTab) => handleMainTabsChange(processTab)}
                        scrollButtons="auto"
                        textColor="secondary"
                        value={tab}
                        variant="scrollable"
                    >
                        {processTabs.length > 1 && processTabs.map((processTab) => (
                            <Tab
                                key={processTab.value}
                                label={processTab.label}
                                value={processTab.value}
                            />
                        ))}
                    </Tabs>
                    {isGuest &&
                        <TutorialBlogPost variant="h5" color="textPrimary">
                            <TutorialLink href="/blog/post/runbotics-tutorial" target="blank">
                                {translate('Process.MainView.Link.RunBoticsTutorial')}
                                <OpenInNewIconStyled fontSize='small' />
                            </TutorialLink>
                        </TutorialBlogPost>}
                </Grid>
                <Grid item xs={true} mb={1} mt={1}>
                    <ProcessTitle variant="h3" color="textPrimary">
                        {process.name}
                    </ProcessTitle>
                </Grid>
            </Grid>
            <Divider />
            <ProcessMainViewManager />
        </ProcessInternalPage>
    );
};

export default ProcessMainView;
