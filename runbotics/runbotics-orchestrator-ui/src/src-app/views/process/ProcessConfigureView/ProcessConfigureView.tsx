import React, { useEffect, useMemo, useState, VFC } from 'react';

import { Box, Dialog } from '@mui/material';
import { useRouter } from 'next/router';
import {
    IBotSystem,
    IBotCollection,
    NotificationProcess,
    NotificationProcessType,
    Role,
    WebhookProcessTrigger,
} from 'runbotics-common';

import { ProcessOutput } from 'runbotics-common/dist/model/api/process-output.model';

import NotificationSwitchComponent from '#src-app/components/tables/NotificationTable/NotificationSwitchComponent';
import NotificationTableComponent from '#src-app/components/tables/NotificationTable/NotificationTableComponent';
import { NotificationRow, NotificationTableFields } from '#src-app/components/tables/NotificationTable/NotificationTableComponent.types';
import useProcessNotificationColumns from '#src-app/components/tables/NotificationTable/useProcessNotificationColumns';
import If from '#src-app/components/utils/If';
import useAuth from '#src-app/hooks/useAuth';
import useRole from '#src-app/hooks/useRole';
import { translate } from '#src-app/hooks/useTranslations';
import { useDispatch, useSelector } from '#src-app/store';

import { botCollectionActions } from '#src-app/store/slices/BotCollections';

import { botSystemsActions } from '#src-app/store/slices/BotSystem';

import { processActions, processSelector } from '#src-app/store/slices/Process';

import { processOutputActions } from '#src-app/store/slices/ProcessOutput';

import { ProcessSubscriptionStatisticsActions, subscribersSelector } from '#src-app/store/slices/ProcessSubscriptionStatisctics';

import { webhookActions } from '#src-app/store/slices/Webhook';

import AddEmailSubscriptionComponent from './AddEmailSubscriptionComponent';
import BotCollectionComponent from './BotCollection.component';
import BotSystemComponent from './BotSystem.component';
import ProcessAttendedComponent from './ProcessAttended.component';
import {
    AttendancePaper,
    StyledPaper,
    ContainerWrapper,
    PageContainer,
    SettingsContainer,
    CredentialsContainer,
} from './ProcessConfigureView.styles';
import ProcessCredentials from './ProcessCredentials';
import ProcessOutputComponent from './ProcessOutput.component';
import ProcessTriggerableComponent from './ProcessTriggerableComponent';
import ProcessWebhooksComponent from './ProcessWebhooks.component';


// eslint-disable-next-line max-lines-per-function
const ProcessConfigureView: VFC = () => {
    const dispatch = useDispatch();
    const {
        draft: { process, processSubscriptions },
        all: { loading },
    } = useSelector(processSelector);
    const { id } = useRouter().query;
    const processId = Number(id);

    const processNotificationSubscribers = useSelector(subscribersSelector);

    const [processOutputType, setProcessOutputType] = useState<ProcessOutput>(
        process?.output
    );
    const [selectedBotSystem, setSelectedBotSystem] = useState<IBotSystem>(
        process?.system
    );
    const [selectedBotCollection, setSelectedBotCollection] =
        useState<IBotCollection>(process?.botCollection);
    const [attended, setAttended] = useState(process?.isAttended);
    const [triggerable, setTriggerable] = useState(process?.isTriggerable);

    const { user } = useAuth();
    const [open, setOpen] = useState(false);
    const [openSubscription, setOpenSubscription] = useState(false);
    const [selectedWebhooks, setSelectedWebhooks] = useState<WebhookProcessTrigger[]>(process?.webhookTriggers);

    const notificationTableColumns = useProcessNotificationColumns({
        onDelete: handleDeleteSubscription,
    });

    const processSubscriptionsColumns = useProcessNotificationColumns({
        onDelete: handleUnsubscribe,
    });

    const hasAddMailPermission = useRole([Role.ROLE_TENANT_ADMIN]);

    const notificationTableRows = useMemo(
        () =>
            processSubscriptions.map<NotificationRow>(
                (sub: NotificationProcess) => ({
                    id: sub.id,
                    [NotificationTableFields.EMAIL]: sub.customEmail || sub.user.email,
                    [NotificationTableFields.SUBSCRIBED_AT]: sub.createdAt,
                })
            ),
        [processSubscriptions]
    );

    const processSubscriptionsTableRows = useMemo(
        () =>
            processNotificationSubscribers.map<NotificationRow>(
                (sub) => ({
                    id: sub.id,
                    [NotificationTableFields.EMAIL]: sub.customEmail || sub.userEmail,
                    [NotificationTableFields.SUBSCRIBED_AT]: sub.createdAt,
                })
            ),
        [processNotificationSubscribers]
    );

    const handleGetProcessSubscribers = async () => {
        await dispatch(
            processActions.getProcessSubscriptionInfo({ resourceId: processId })
        );
    };

    useEffect(() => {
        dispatch(botCollectionActions.getAll());
        dispatch(botSystemsActions.getAll());
        dispatch(processOutputActions.getAll());
        handleGetProcessSubscribers();
        dispatch(ProcessSubscriptionStatisticsActions.fetchSubscribersByProcessId(processId));
        dispatch(webhookActions.getWebhooks());
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [processId]);

    useEffect(() => {
        if (process?.system) setSelectedBotSystem(process.system);

        if (process?.botCollection) setSelectedBotCollection(process.botCollection);

        if (process?.isAttended) setAttended(process.isAttended);

        if (process?.isTriggerable) setTriggerable(process.isTriggerable);

        if (process?.output) setProcessOutputType(process.output);

        if (process?.webhookTriggers) setSelectedWebhooks(process.webhookTriggers);
    }, [process]);

    const fetchProcess = async () => {
        await dispatch(processActions.fetchProcessById(process.id));
    };

    const handleSelectProcessOutputType = async (output: ProcessOutput) => {
        await dispatch(
            processActions.updateProcessOutputType({
                resourceId: process.id,
                payload: { output },
            })
        );
        setProcessOutputType(output);
        await fetchProcess();
    };

    const handleSelectBotSystem = async (system: IBotSystem) => {
        await dispatch(
            processActions.updateBotSystem({
                resourceId: process.id,
                payload: { system },
            })
        );
        setSelectedBotSystem(system);
        await fetchProcess();
    };

    const handleSelectBotCollection = async (botCollection: IBotCollection) => {
        await dispatch(
            processActions.updateBotCollection({
                resourceId: process.id,
                payload: { botCollection },
            })
        );
        setSelectedBotCollection(botCollection);
        await fetchProcess();
    };

    const handleAttendanceChange = async (isAttended: boolean) => {
        await dispatch(
            processActions.updateAttendance({
                resourceId: process.id,
                payload: { isAttended },
            })
        );
        setAttended(isAttended);
        await fetchProcess();
    };

    const handleTriggerableChange = async (isTriggerable: boolean) => {
        await dispatch(
            processActions.updateTriggerable({
                resourceId: process.id,
                payload: { isTriggerable },
            })
        );
        setTriggerable(isTriggerable);
        await fetchProcess();
    };

    const handleOwnSubscriptionChange = async (subscriptionState: boolean) => {
        subscriptionState
            ? await dispatch(
                processActions.subscribeProcessNotifications({
                    payload: {
                        processId,
                        type: NotificationProcessType.PROCESS_ERROR,
                    },
                })
            )
            : await dispatch(
                processActions.unsubscribeProcessNotifications({
                    resourceId: processSubscriptions.find(
                        (sub) => sub.user.id === user.id && !sub.customEmail
                    ).id,
                })
            );

        await handleGetProcessSubscribers();
    };

    const handleCustomEmailSubscription = async (customEmail: string) => {
        await dispatch(
            processActions.subscribeProcessNotifications({
                payload: {
                    processId,
                    type: NotificationProcessType.PROCESS_ERROR,
                    customEmail,
                },
            })
        );

        await handleGetProcessSubscribers();
    };

    const handleProcessSubscriptionChange = async (subscriptionState: boolean) => {
        subscriptionState ? await dispatch(
            ProcessSubscriptionStatisticsActions.createSubscriber({processId: processId, userId: user.id})
        ) :
            await dispatch(ProcessSubscriptionStatisticsActions.deleteSubscriber(
                processNotificationSubscribers.find(
                    (sub) => Number(sub.userId) === user.id && !sub.customEmail
                ).id
            ));
        await dispatch(ProcessSubscriptionStatisticsActions.fetchSubscribersByProcessId(processId));
    };

    const handleCustomEmailSubscriptionStatistics = async (customEmail: string) => {
        await dispatch(
            ProcessSubscriptionStatisticsActions.createSubscriber({
                processId: processId,
                customEmail: customEmail,
                userId: user.id,
            })
        );
        await dispatch(ProcessSubscriptionStatisticsActions.fetchSubscribersByProcessId(processId));
    };

    async function handleDeleteSubscription(
        subscriptionInfo: NotificationRow
    ) {
        await dispatch(
            processActions.unsubscribeProcessNotifications({
                resourceId: subscriptionInfo.id,
            })
        );
        await handleGetProcessSubscribers();
    }

    async function handleUnsubscribe(subscription: NotificationRow) {
        await dispatch(
            ProcessSubscriptionStatisticsActions.deleteSubscriber(subscription.id)
        );
        await dispatch(ProcessSubscriptionStatisticsActions.fetchSubscribersByProcessId(processId));
    }

    return (
        <ContainerWrapper>
            <PageContainer>
                <SettingsContainer>
                    <Box>
                        <StyledPaper elevation={1}>
                            <BotSystemComponent
                                selectedBotSystem={selectedBotSystem}
                                onSelectBotSystem={handleSelectBotSystem}
                            />
                        </StyledPaper>
                    </Box>
                    <Box>
                        <StyledPaper elevation={1}>
                            <BotCollectionComponent
                                selectedBotCollection={selectedBotCollection}
                                onSelectBotCollection={handleSelectBotCollection}
                            />
                        </StyledPaper>
                    </Box>
                    <Box>
                        <StyledPaper elevation={1}>
                            <ProcessOutputComponent
                                selectedProcessOutput={processOutputType}
                                onSelectProcessOutput={handleSelectProcessOutputType}
                            />
                        </StyledPaper>
                    </Box>
                    <Box>
                        <AttendancePaper>
                            <ProcessAttendedComponent
                                isProcessAttended={attended}
                                onAttendedChange={handleAttendanceChange}
                            />
                        </AttendancePaper>
                    </Box>
                    <Box>
                        <StyledPaper>
                            <ProcessTriggerableComponent
                                isProcessTriggerable={triggerable}
                                onTriggerableChange={handleTriggerableChange}
                            />
                        </StyledPaper>
                    </Box>
                    <Box>
                        <StyledPaper>
                            <NotificationSwitchComponent
                                onClick={() => setOpen(true)}
                                isSubscribed={processSubscriptions.some((sub) => sub.user.id === user.id && !sub.customEmail)}
                                onSubscriptionChange={handleOwnSubscriptionChange}
                                label={translate('Process.Edit.Form.Fields.IsSubscribed.Label')}
                                tooltip={translate('Process.Edit.Form.Fields.IsSubscribed.Tooltip')}
                            />
                        </StyledPaper>
                    </Box>
                    <Box>
                        <StyledPaper>
                            <NotificationSwitchComponent
                                onClick={() => setOpenSubscription(true)}
                                isSubscribed={processNotificationSubscribers.some((sub) => Number(sub.userId) === user.id && !sub.customEmail)}
                                onSubscriptionChange={handleProcessSubscriptionChange}
                                label={translate('Process.Edit.Form.Fields.ProcessStatisticsIsSubscribed.Label')}
                                tooltip={translate('Process.Edit.Form.Fields.ProcessStatisticsIsSubscribed.Tooltip')}
                            />
                        </StyledPaper>
                    </Box>
                    <Box>
                        <StyledPaper>
                            <ProcessWebhooksComponent
                                selectedWebhooks={selectedWebhooks}
                                processId={processId}
                            />
                        </StyledPaper>
                    </Box>
                </SettingsContainer>
                <CredentialsContainer>
                    <StyledPaper>
                        <ProcessCredentials />
                    </StyledPaper>
                </CredentialsContainer>
            </PageContainer>
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
                    <AddEmailSubscriptionComponent onEmailAdd={handleCustomEmailSubscription} />
                </If>
            </Dialog>
            <Dialog
                open={openSubscription}
                onClose={() => setOpenSubscription(false)}
                maxWidth={false}
            >
                <NotificationTableComponent
                    notificationTableColumns={processSubscriptionsColumns}
                    subscribersList={processSubscriptionsTableRows ?? []}
                    onClose={() => setOpenSubscription(false)}
                    loading={loading}
                />
                <If condition={hasAddMailPermission}>
                    <AddEmailSubscriptionComponent onEmailAdd={handleCustomEmailSubscriptionStatistics} />
                </If>
            </Dialog>
        </ContainerWrapper>
    );
};

export default ProcessConfigureView;
