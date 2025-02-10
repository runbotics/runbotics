import React, { FC, useEffect } from 'react';

import { Divider, Grid, Tab, Tabs } from '@mui/material';

import { useRouter } from 'next/router';
import { FeatureKey, Role } from 'runbotics-common';

import { hasFeatureKeyAccess } from '#src-app/components/utils/Secured';
import useAuth from '#src-app/hooks/useAuth';
import useRole from '#src-app/hooks/useRole';
import useTranslations from '#src-app/hooks/useTranslations';
import { useDispatch, useSelector } from '#src-app/store';
import { processActions } from '#src-app/store/slices/Process';
import { processInstanceActions } from '#src-app/store/slices/ProcessInstance';
import { ProcessTab } from '#src-app/utils/process-tab';

import ProcessMainViewManager from './ProcessMainView.manager';
import {
    OpenInNewIconStyled,
    ProcessInternalPage,
    ProcessTitle,
    TutorialBlogPost,
    TutorialLink,
    TabLink
} from './ProcessMainView.styled';

const ProcessMainView: FC = () => {
    const router = useRouter();
    const dispatch = useDispatch();
    const { process } = useSelector((state) => state.process.draft);
    const { id, tab } = router.query;
    const { translate } = useTranslations();
    const { user } = useAuth();
    const isGuest = useRole([Role.ROLE_GUEST]);

    useEffect(() => () => {
        dispatch(processActions.resetDraft());
        dispatch(processInstanceActions.resetActive());
    }, []);

    const processTabs = [
        {
            value: ProcessTab.BUILD,
            label: translate('Process.MainView.Tabs.Build.Title'),
            featureKeys: [FeatureKey.PROCESS_BUILD_VIEW],
            show: true,
            href: `/app/processes/${id}/${ProcessTab.BUILD}`
        },
        {
            value: ProcessTab.RUN,
            label: translate('Process.MainView.Tabs.Run.Title'),
            featureKeys: [FeatureKey.PROCESS_RUN_VIEW],
            show: true,
            href: `/app/processes/${id}/${ProcessTab.RUN}`
        },
        {
            value: ProcessTab.CONFIGURE,
            label: translate('Process.MainView.Tabs.Configure.Title'),
            featureKeys: [FeatureKey.PROCESS_CONFIGURE_VIEW],
            show: true,
            href: `/app/processes/${id}/${ProcessTab.CONFIGURE}`
        },
    ].filter((processTab) => hasFeatureKeyAccess(user, processTab.featureKeys) && processTab.show);


    return (
        <ProcessInternalPage title={translate('Process.MainView.Meta.Title')} fullWidth>
            <Grid container>
                <Grid item my={1} ml={1} display={'flex'} gap={2}>
                    <Tabs
                        scrollButtons="auto"
                        textColor="secondary"
                        value={tab}
                        variant="scrollable"
                    >
                        {processTabs.length > 1 && processTabs.map((processTab) => (
                            <TabLink key={processTab.value} href={processTab.href} passHref isActive={processTab.value === tab}>
                                <Tab
                                    label={processTab.label}
                                    value={processTab.value}
                                />
                            </TabLink>
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
                        {process?.name}
                    </ProcessTitle>
                </Grid>
            </Grid>
            <Divider />
            <ProcessMainViewManager />
        </ProcessInternalPage>
    );
};

export default ProcessMainView;
