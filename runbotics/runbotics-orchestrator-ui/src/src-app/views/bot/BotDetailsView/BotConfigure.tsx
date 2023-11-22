import React, { FC, useEffect, useMemo, useState } from 'react';

import { Dialog } from '@mui/material';
import { Box } from '@mui/system';
import { useRouter } from 'next/router';

import { NotificationBot } from 'runbotics-common';

import NotificationSwitchComponent from '#src-app/components/tables/NotificationTable/NotificationSwitchComponent';

import NotificationTableComponent from '#src-app/components/tables/NotificationTable/NotificationTableComponent';
import { BotNotificationRow } from '#src-app/components/tables/NotificationTable/NotificationTableComponent.types';
import useBotNotificationColumns from '#src-app/components/tables/NotificationTable/useBotNotificationColumns';
import useAuth from '#src-app/hooks/useAuth';
import { translate } from '#src-app/hooks/useTranslations';

import { useDispatch, useSelector } from '#src-app/store';
import { botActions, botSelector } from '#src-app/store/slices/Bot';

import { Container, ContainerWrapper, StyledPaper } from './BotDetailsView.styles';

const BotConfigure: FC = () => {
    const dispatch = useDispatch();
    const { bots: { botSubscriptions, loading, byId } } = useSelector(botSelector);
    const router = useRouter();
    const { user } = useAuth();
    const { id } = router.query;
    const botId = Number(id);
    const bot = byId[botId];
    const [subscribed, setSubscribed] = useState(false);
    const [currentBotSubscription, setCurrentBotSubscription] = useState<NotificationBot | undefined>();
    const [open, setOpen] = useState(false);

    const notificationTableColumns = useBotNotificationColumns({ onDelete: handleDeleteSubscription });

    const notificationTableRows = useMemo(() => botSubscriptions
        .map<BotNotificationRow>((sub: NotificationBot) => ({
            id: sub.id,
            user: sub.user.login,
            subscribedAt: sub.createdAt,
        })), [botSubscriptions]);

    const handleGetBotSubscribers = async () => {
        dispatch(botActions.getBotSubscriptionInfo(botId));
    };

    useEffect(() => {
        handleGetBotSubscribers();
    }, [botId]);

    useEffect(() => {
        const subscription = botSubscriptions.find(sub => sub.user.id === user.id);
        setCurrentBotSubscription(subscription);
        setSubscribed(Boolean(subscription));
    }, [botSubscriptions]);

    const handleSubscriptionChange = async (subscriptionState: boolean) => {
        subscriptionState
            ? await dispatch(botActions.subscribeBotNotifications({ user, bot }))
            : await dispatch(botActions.unsubscribeBotNotifications(currentBotSubscription.id));

        await handleGetBotSubscribers();
    };

    async function handleDeleteSubscription(botInfo: BotNotificationRow) {
        await dispatch(botActions.unsubscribeBotNotifications(botInfo.id));
        await handleGetBotSubscribers();
    }

    return (
        <ContainerWrapper>
            <Container>
                <Box>
                    <StyledPaper>
                        <NotificationSwitchComponent
                            onClick={() => setOpen(true)}
                            isSubscribed={subscribed}
                            onSubscriptionChange={handleSubscriptionChange}
                            label={translate('Bot.Edit.Form.Fields.IsSubscribed.Label')}
                            tooltip={translate('Bot.Edit.Form.Fields.IsSubscribed.Tooltip')}
                        />
                    </StyledPaper>
                </Box>
            </Container>
            <Dialog
                open={open}
                onClose={() => setOpen(false)}
                maxWidth={false}
            >
                <NotificationTableComponent
                    notificationTableColumns={notificationTableColumns}
                    subscribersList={notificationTableRows ?? []}
                    loading={loading}
                />
            </Dialog>
        </ContainerWrapper>
    );
};

export default BotConfigure;
