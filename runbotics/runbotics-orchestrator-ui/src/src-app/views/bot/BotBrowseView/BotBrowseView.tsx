import React, { ChangeEvent, useMemo, VFC } from 'react';

import { Box, Tab, Tabs } from '@mui/material';
import { useRouter } from 'next/router';
import { FeatureKey } from 'runbotics-common';

import If from '#src-app/components/utils/If';

import useFeatureKey from '#src-app/hooks/useFeatureKey';

import useTranslations from '#src-app/hooks/useTranslations';

import { StyledContainer, StyledPage } from './BotBrowseView.styles';
import { BotCollectionTab } from '../../../utils/bot-tab';

import { getLastParamOfUrl } from '../../utils/routerUtils';
import BotCollectionView from '../BotCollectionView';

import BotListView from '../BotListView';

const BotBrowseView: VFC = () => {
    const router = useRouter();
    const tab = getLastParamOfUrl(router);
    const { translate } = useTranslations();
    const hasBotsCollectionTabAccess = useFeatureKey([FeatureKey.BOT_COLLECTION_READ]);
    const hasBotsTabAccess = useFeatureKey([FeatureKey.BOT_READ]);

    const botTabs = useMemo(() => {
        const tabs = [];

        if (hasBotsTabAccess)
        { tabs.push({ value: BotCollectionTab.BOTS, label: translate('Bot.Browse.Tabs.Bots.Label') }); }

        if (hasBotsCollectionTabAccess)
        { tabs.push({ value: BotCollectionTab.COLLECTIONS, label: translate('Bot.Browse.Tabs.Collections.Label') }); }

        return tabs;
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [hasBotsTabAccess, hasBotsCollectionTabAccess]);

    const handleTabChange = (event: ChangeEvent<HTMLInputElement>, value: BotCollectionTab) => {
        if (value === BotCollectionTab.COLLECTIONS) router.push('/app/bots/collections', null, {locale:router.locale});
        else router.push('/app/bots', null, {locale:router.locale});
    };

    const getTabValue = () =>
        tab === BotCollectionTab.COLLECTIONS ? BotCollectionTab.COLLECTIONS : BotCollectionTab.BOTS;

    const getPageTitle = () =>
        getTabValue() === BotCollectionTab.COLLECTIONS
            ? translate('Bot.Browse.Tabs.Collections.Meta.Title')
            : translate('Bot.Browse.Tabs.Bots.Meta.Title');

    return (
        <StyledPage title={getPageTitle()}>
            <StyledContainer maxWidth={false}>
                <Box>
                    <If condition={hasBotsCollectionTabAccess || hasBotsTabAccess}>
                        <Tabs
                            onChange={handleTabChange}
                            scrollButtons="auto"
                            textColor="secondary"
                            value={getTabValue()}
                            variant="scrollable"
                        >
                            {botTabs.map((botTab) => (
                                <Tab key={botTab.value} label={botTab.label} value={botTab.value} />
                            ))}
                        </Tabs>
                    </If>
                </Box>
                <If
                    condition={tab === BotCollectionTab.COLLECTIONS && hasBotsCollectionTabAccess}
                    else={<BotListView />}
                >
                    <BotCollectionView />
                </If>
            </StyledContainer>
        </StyledPage>
    );
};

export default BotBrowseView;
