import React, { FC, useEffect, useMemo, useState } from 'react';

import { Box } from '@mui/system';
import { useRouter } from 'next/router';

import { Role, NotificationBot } from 'runbotics-common';

import NotificationSwitchComponent from '#src-app/components/tables/NotificationTable/NotificationSwitchComponent';

import NotificationTableComponent from '#src-app/components/tables/NotificationTable/NotificationTableComponent';
import { BotNotificationRow } from '#src-app/components/tables/NotificationTable/NotificationTableComponent.types';
import useBotNotificationColumns from '#src-app/components/tables/NotificationTable/useBotNotificationColumns';
import If from '#src-app/components/utils/If';
import useAuth from '#src-app/hooks/useAuth';
import useRole from '#src-app/hooks/useRole';
import { translate } from '#src-app/hooks/useTranslations';

import { useDispatch, useSelector } from '#src-app/store';
import { botActions, botSelector } from '#src-app/store/slices/Bot';

import { Container, ContainerWrapper, StyledPaper } from './BotDetailsView.styles';

const BotConfigure: FC = () => {
    const dispatch = useDispatch();
    const { bots: { botSubscriptions, loading } } = useSelector(botSelector);
    const router = useRouter();
    const isAdmin = useRole([Role.ROLE_ADMIN]);
    const { user } = useAuth();
    const { id } = router.query;
    const botId = Number(id);
    const [subscribed, setSubscribed] = useState(false);

    const notificationTableColumns = useBotNotificationColumns({ onDelete: handleDeleteSubscription });

    const notificationTableRows = useMemo(() => botSubscriptions
        .map<BotNotificationRow>((sub: NotificationBot) => ({
            id: sub.userId,
            userId: sub.userId,
            botId: sub.botId,
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
        setSubscribed(Boolean(botSubscriptions.find(sub => sub.userId === user.id)));
    }, [botSubscriptions]);

    const handleSubscriptionChange = async (subscriptionState: boolean) => {
        subscriptionState
            ? await dispatch(botActions.subscribeBotNotifications({ userId: user.id, botId }))
            : await dispatch(botActions.unsubscribeBotNotifications({ userId: user.id, botId }));

        await handleGetBotSubscribers();
    };

    async function handleDeleteSubscription(botInfo: BotNotificationRow) {
        await dispatch(botActions.unsubscribeBotNotifications({
            userId: botInfo.userId,
            botId,
        }));
        await handleGetBotSubscribers();
    }

    return (
        <ContainerWrapper>
            <Container>
                <Box>
                    <StyledPaper>
                        <NotificationSwitchComponent
                            isSubscribed={subscribed}
                            onSubscriptionChange={handleSubscriptionChange}
                            label={translate('Bot.Edit.Form.Fields.IsSubscribed.Label')}
                        />
                    </StyledPaper>
                </Box>
            </Container>
            <If condition={isAdmin}>
                <NotificationTableComponent
                    notificationTableColumns={notificationTableColumns}
                    subscribersList={notificationTableRows ?? []}
                    loading={loading}
                />
            </If>
        </ContainerWrapper>
    );
};

export default BotConfigure;
