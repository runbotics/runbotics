import React, { ChangeEvent, useMemo, VFC } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import { Box, Tab, Tabs } from '@mui/material';
import { FeatureKey } from 'runbotics-common';
import useQuery from 'src/hooks/useQuery';
import { BotCollectionParams } from 'src/utils/types/BotParams';
import useTranslations from 'src/hooks/useTranslations';
import useFeatureKey from 'src/hooks/useFeatureKey';
import If from 'src/components/utils/If';
import { StyledContainer, StyledPage } from './BotBrowseView.styles';
import { BotCollectionTab } from '../../../utils/bot-tab';
import BotListView from '../BotListView';
import BotCollectionView from '../BotCollectionView';
import { DefaultPageSize } from './BotBrowseView.utils';

const BotBrowseView: VFC = () => {
    const history = useHistory();
    const { tab } = useParams<BotCollectionParams>();
    const { translate } = useTranslations();
    const query = useQuery();
    const collectionId = query.get('collection');
    const hasBotsCollectionTabAccess = useFeatureKey([FeatureKey.BOT_COLLECTION_READ]);
    const hasBotsTabAccess = useFeatureKey([FeatureKey.BOT_READ]);

    const botTabs = useMemo(() => {
        const tabs = [];

        if (hasBotsTabAccess) {
            tabs.push({ value: BotCollectionTab.BOTS, label: translate('Bot.Browse.Tabs.Bots.Label') });
        }

        if (hasBotsCollectionTabAccess) {
            tabs.push({ value: BotCollectionTab.COLLECTIONS, label: translate('Bot.Browse.Tabs.Collections.Label') });
        }

        return tabs;
    }, [hasBotsTabAccess, hasBotsCollectionTabAccess]);

    const handleTabChange = (event: ChangeEvent<HTMLInputElement>, value: BotCollectionTab) => {
        if (value === BotCollectionTab.COLLECTIONS) {
            history.push(`/app/bots/collections?page=0&pageSize=${DefaultPageSize.GRID}`);
        } else {
            history.push('/app/bots');
        }
    };

    const getTabValue = () => (tab === BotCollectionTab.COLLECTIONS
        ? BotCollectionTab.COLLECTIONS
        : BotCollectionTab.BOTS);

    const getPageTitle = () => (getTabValue() === BotCollectionTab.COLLECTIONS
        ? translate('Bot.Browse.Tabs.Collections.Meta.Title')
        : translate('Bot.Browse.Tabs.Bots.Meta.Title')
    );

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
                    else={
                        <BotListView collectionId={collectionId} />
                    }
                >
                    <BotCollectionView />
                </If>
            </StyledContainer>
        </StyledPage>
    );
};

export default BotBrowseView;
