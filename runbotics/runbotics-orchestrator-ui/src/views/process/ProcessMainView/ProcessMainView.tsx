import React, { FC, useMemo } from 'react';

import { Divider, Grid, Tab, Tabs } from '@mui/material';

import i18n from 'i18next';
import { useRouter } from 'next/router';
import { FeatureKey } from 'runbotics-common';

import { hasFeatureKeyAccess } from 'src/components/utils/Secured';
import useAuth from 'src/hooks/useAuth';
import useTranslations from 'src/hooks/useTranslations';
import { useSelector } from 'src/store';
import { ProcessTab } from 'src/utils/process-tab';




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
            featureKeys: [FeatureKey.PROCESS_START],
        },
        {
            value: ProcessTab.CONFIGURE,
            label: translate('Process.MainView.Tabs.Configure.Title'),
            featureKeys: [FeatureKey.PROCESS_CONFIGURE_VIEW],
        },
    ];

    const accessedTabs = useMemo(
        () =>
            // eslint-disable-next-line @typescript-eslint/no-shadow
            processTabs.filter((tab) => {
                if (tab.featureKeys) return hasFeatureKeyAccess(user, tab.featureKeys);

                return true;
                // eslint-disable-next-line react-hooks/exhaustive-deps
            }),
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [user, i18n.language],
    );

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
                        {accessedTabs.length > 1 &&
                            accessedTabs.map((processTab) => (
                                <Tab key={processTab.value} label={processTab.label} value={processTab.value} />
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
