import React, { FC } from 'react';

import { Divider, Grid, Tab, Tabs } from '@mui/material';

import { useRouter } from 'next/router';
import { FeatureKey } from 'runbotics-common';


import { hasFeatureKeyAccess } from '#src-app/components/utils/Secured';
import useAuth from '#src-app/hooks/useAuth';
import useTranslations from '#src-app/hooks/useTranslations';
import { useSelector } from '#src-app/store';
import { ProcessTab } from '#src-app/utils/process-tab';

import ProcessMainViewManager from './ProcessMainView.manager';
import { ProcessInternalPage, ProcessTitle } from './ProcessMainView.styled';

const ProcessMainView: FC = () => {
    const router = useRouter();
    const { process } = useSelector((state) => state.process.draft);
    const { id, tab } = router.query;
    const { translate } = useTranslations();
    const { user } = useAuth();

    const processTabs = [
        {
            value: ProcessTab.BUILD,
            label: translate('Process.MainView.Tabs.Build.Title'),
            featureKeys: [FeatureKey.PROCESS_BUILD_VIEW],
        },
        {
            value: ProcessTab.RUN,
            label: translate('Process.MainView.Tabs.Run.Title'),
            featureKeys: [FeatureKey.PROCESS_RUN_VIEW],
        },
        {
            value: ProcessTab.CONFIGURE,
            label: translate('Process.MainView.Tabs.Configure.Title'),
            featureKeys: [FeatureKey.PROCESS_CONFIGURE_VIEW],
        },
    ].filter((processTab) => hasFeatureKeyAccess(user, processTab.featureKeys));

    const handleMainTabsChange = (processTab: ProcessTab) => {
        router.push({ pathname: `/app/processes/${id}/${processTab}` });
    };

    return (
        <ProcessInternalPage title={translate('Process.MainView.Meta.Title')} fullWidth>
            <Grid container>
                <Grid item xs={3} mb={1} mt={1} ml={1}>
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
                </Grid>
                <Grid item xs={6} mb={1} mt={1}>
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
