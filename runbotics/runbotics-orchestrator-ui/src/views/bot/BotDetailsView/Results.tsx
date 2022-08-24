import {
    Box, Tab, Tabs,
} from '@mui/material';
import React, { ChangeEvent, FC, useMemo } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import { FeatureKey } from 'runbotics-common';
import useFeatureKey from 'src/hooks/useFeatureKey';
import useTranslations from 'src/hooks/useTranslations';
import { BotTab } from 'src/utils/bot-tab';
import { BotParams } from 'src/utils/types/BotParams';
import BotDetailsViewManager from './BotDetailsView.manager';

const Results: FC = () => {
    const { id, tab } = useParams<BotParams>();
    const history = useHistory();
    const { translate } = useTranslations();
    const hasConsoleTabAccess = useFeatureKey([FeatureKey.BOT_LOG_READ]);
    const hasLogsTabAccess = useFeatureKey([FeatureKey.BOT_HISTORY_READ]);

    const currentTab = useMemo(() => {
        if (hasLogsTabAccess) {
            return tab || BotTab.LOGS;
        }

        return tab || BotTab.MANAGEMENT;
    }, [hasLogsTabAccess]);

    const tabs = useMemo(() => {
        const tabsToReturn = [];
        if (hasLogsTabAccess) {
            tabsToReturn.push({ value: BotTab.LOGS, label: translate('Bot.Details.Tabs.Logs.TabName') });
        }
        if (hasConsoleTabAccess) {
            tabsToReturn.push({ value: BotTab.CONSOLE, label: translate('Bot.Details.Tabs.Console.TabName') });
        }
        tabsToReturn.push({ value: BotTab.MANAGEMENT, label: translate('Bot.Details.Tabs.Management.TabName') });

        return tabsToReturn;
    }, [hasConsoleTabAccess, hasLogsTabAccess]);

    const handleTabsChange = (event: ChangeEvent<HTMLInputElement>, value: string): void => {
        history.push(`/app/bots/${id}/details/${value}`);
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
