import React, { FC, useEffect, useMemo, useState } from 'react';

import { Dialog } from '@mui/material';
import { Box } from '@mui/system';
import { useRouter } from 'next/router';

import { NotificationBot, NotificationBotType, Role } from 'runbotics-common';

import NotificationSwitchComponent from '#src-app/components/tables/NotificationTable/NotificationSwitchComponent';

import NotificationTableComponent from '#src-app/components/tables/NotificationTable/NotificationTableComponent';
import { NotificationRow, NotificationTableFields } from '#src-app/components/tables/NotificationTable/NotificationTableComponent.types';
import useBotNotificationColumns from '#src-app/components/tables/NotificationTable/useBotNotificationColumns';
import If from '#src-app/components/utils/If';
import useAuth from '#src-app/hooks/useAuth';
import useRole from '#src-app/hooks/useRole';
import { translate } from '#src-app/hooks/useTranslations';

import { useDispatch, useSelector } from '#src-app/store';
import { botActions, botSelector } from '#src-app/store/slices/Bot';

import AddEmailSubscriptionComponent from '#src-app/views/process/ProcessConfigureView/ProcessAddEmailSubscriptionComponent';

import { Container, ContainerWrapper, StyledPaper } from './BotDetailsView.styles';

const BotConfigure: FC = () => {
    const dispatch = useDispatch();
    const { bots: { botSubscriptions, loading } } = useSelector(botSelector);
    const router = useRouter();
    const { user } = useAuth();
    const { id } = router.query;
    const botId = Number(id);
    const [open, setOpen] = useState(false);

    const notificationTableColumns = useBotNotificationColumns({ onDelete: handleDeleteSubscription });

    const notificationTableRows = useMemo(() => botSubscriptions
        .map<NotificationRow>((sub: NotificationBot) => ({
            id: sub.id,
            [NotificationTableFields.EMAIL]: sub.customEmail || sub.user.email,
            [NotificationTableFields.SUBSCRIBED_AT]: sub.createdAt,
        })), [botSubscriptions]);

    const handleGetBotSubscribers = async () => {
        await dispatch(botActions.getBotSubscriptionInfo({ resourceId: botId }));
    };

    useEffect(() => {
        handleGetBotSubscribers();
    }, [botId]);

    const hasAddMailPermission = useRole([Role.ROLE_TENANT_ADMIN]);


    const handleSubscribeToCustomEmail = async (customEmail: string) => {
        await dispatch(
            botActions.subscribeBotNotifications({
                payload: {
                    botId,
                    type: NotificationBotType.BOT_DISCONNECTED,
                    email: customEmail,
                },
            })
        );

        await handleGetBotSubscribers();
    };

    const handleSubscriptionChange = async (subscriptionState: boolean) => {
        subscriptionState
            ? await dispatch(botActions.subscribeBotNotifications({
                payload: { botId, type: NotificationBotType.BOT_DISCONNECTED }
            }))
            : await dispatch(botActions.unsubscribeBotNotifications({
                resourceId: botSubscriptions.find(sub => sub.user.id === user.id && sub.customEmail === '').id
            }));

        await handleGetBotSubscribers();
    };

    async function handleDeleteSubscription(botInfo: NotificationRow) {
        await dispatch(botActions.unsubscribeBotNotifications({ resourceId: botInfo.id }));
        await handleGetBotSubscribers();
    }

    return (
        <ContainerWrapper>
            <Container>
                <Box>
                    <StyledPaper>
                        <NotificationSwitchComponent
                            onClick={() => setOpen(true)}
                            isSubscribed={botSubscriptions.some(sub => sub.user.id === user.id && sub.customEmail === '')}
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
                    onClose={() => setOpen(false)}
                    loading={loading}
                />
                <If condition={hasAddMailPermission}>
                    <AddEmailSubscriptionComponent onEmailAdd={handleSubscribeToCustomEmail} />
                </If>
            </Dialog>
        </ContainerWrapper>
    );
};

export default BotConfigure;
