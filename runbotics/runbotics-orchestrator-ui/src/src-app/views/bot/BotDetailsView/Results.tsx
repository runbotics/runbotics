import { ChangeEvent, FC, useMemo } from 'react';

import { Box, Tab, Tabs } from '@mui/material';
import { useRouter } from 'next/router';
import { FeatureKey } from 'runbotics-common';


import useFeatureKey from '#src-app/hooks/useFeatureKey';
import useTranslations from '#src-app/hooks/useTranslations';
import { BotTab } from '#src-app/utils/bot-tab';

import BotDetailsViewManager from './BotDetailsView.manager';


const Results: FC = () => {
    const router = useRouter();
    const { id, tab } = router.query;
    const { translate } = useTranslations();
    const hasConsoleTabAccess = useFeatureKey([FeatureKey.BOT_LOG_READ]);
    const hasLogsTabAccess = useFeatureKey([FeatureKey.BOT_HISTORY_READ]);

    const currentTab = useMemo(() => {
        if (hasLogsTabAccess) return tab || BotTab.LOGS;

        return tab;
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [hasLogsTabAccess, tab, id]);

    const tabs = useMemo(() => {
        const tabsToReturn = [];
        if (hasLogsTabAccess) {
            tabsToReturn.push({ value: BotTab.LOGS, label: translate('Bot.Details.Tabs.History.TabName') });
            tabsToReturn.push({ value: BotTab.CONFIGURE, label: translate('Bot.Details.Tabs.Configure.TabName') });
        }

        // if (hasConsoleTabAccess)
        // { tabsToReturn.push({ value: BotTab.CONSOLE, label: translate('Bot.Details.Tabs.Logs.TabName') }); }

        return tabsToReturn;
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [hasConsoleTabAccess, hasLogsTabAccess]);

    const handleTabsChange = (event: ChangeEvent<HTMLInputElement>, value: string): void => {
        router.push(`/app/bots/${id}/details/${value}`);
    };

    return (
        <>
            <Box mb={2} mt={2}>
                <Tabs
                    onChange={handleTabsChange}
                    scrollButtons="auto"
                    textColor="secondary"
                    value={currentTab}
                    variant="scrollable"
                >
                    {tabs.map((currTab) => (
                        <Tab key={currTab.value} value={currTab.value} label={currTab.label} />
                    ))}
                </Tabs>
            </Box>
            <BotDetailsViewManager />
        </>
    );
};

export default Results;
