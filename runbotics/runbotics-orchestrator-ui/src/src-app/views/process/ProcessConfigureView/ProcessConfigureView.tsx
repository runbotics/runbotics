import React, { useEffect, useMemo, useState, VFC } from 'react';

import { Box, Dialog, Tooltip } from '@mui/material';
import { useRouter } from 'next/router';
import { IBotSystem, IBotCollection, NotificationProcess } from 'runbotics-common';

import NotificationSwitchComponent from '#src-app/components/tables/NotificationTable/NotificationSwitchComponent';
import NotificationTableComponent from '#src-app/components/tables/NotificationTable/NotificationTableComponent';
import { ProcessNotificationRow } from '#src-app/components/tables/NotificationTable/NotificationTableComponent.types';
import useProcessNotificationColumns from '#src-app/components/tables/NotificationTable/useProcessNotificationColumns';
import If from '#src-app/components/utils/If';
import useAuth from '#src-app/hooks/useAuth';
import { translate } from '#src-app/hooks/useTranslations';
import { useDispatch, useSelector } from '#src-app/store';

import { botCollectionActions } from '#src-app/store/slices/BotCollections';

import { botSystemsActions } from '#src-app/store/slices/BotSystem';

import { processActions, processSelector } from '#src-app/store/slices/Process';

import BotCollectionComponent from './BotCollection.component';
import BotSystemComponent from './BotSystem.component';
import ProcessAttendedComponent from './ProcessAttended.component';
import {
    Container,
    AttendancePaper,
    StyledPaper,
    ContainerWrapper,
} from './ProcessConfigureView.styles';
import ProcessTriggerableComponent from './ProcessTriggerableComponent';


// eslint-disable-next-line max-lines-per-function
const ProcessConfigureView: VFC = () => {
    const dispatch = useDispatch();
    const { draft: { process, processSubscriptions, currentProcessSubscription }, all: { loading } } = useSelector(processSelector);
    const isScheduled = process?.schedules?.length > 0;
    const { id } = useRouter().query;
    const processId = Number(id);

    const [selectedBotSystem, setSelectedBotSystem] = useState<IBotSystem>(
        process?.system
    );
    const [selectedBotCollection, setSelectedBotCollection] =
		useState<IBotCollection>(process?.botCollection);
    const [attended, setAttended] = useState(process?.isAttended);
    const [triggerable, setTriggerable] = useState(process?.isTriggerable);

    const { user } = useAuth();
    const userId = user.id;
    const [open, setOpen] = useState(false);
    const [subscribed, setSubscribed] = useState(false);

    const notificationTableColumns = useProcessNotificationColumns({ onDelete: handleDeleteSubscription });

    const notificationTableRows = useMemo(() => processSubscriptions
        .map<ProcessNotificationRow>((sub: NotificationProcess) => ({
            id: sub.id,
            user: sub.user.login,
            subscribedAt: sub.createdAt,
        })), [processSubscriptions]);

    const handleGetProcessSubscribers = async () => {
        await dispatch(processActions.getProcessSubscriptionInfo(processId));
        await dispatch(processActions.getProcessSubscriptionInfoByProcessIdAndUserId({ processId, userId }));
    };

    useEffect(() => {
        dispatch(botCollectionActions.getAll());
        dispatch(botSystemsActions.getAll());
        handleGetProcessSubscribers();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [processId]);

    useEffect(() => {
        if (process?.system) setSelectedBotSystem(process.system);

        if (process?.botCollection) setSelectedBotCollection(process.botCollection);

        if (process?.isAttended) setAttended(process.isAttended);

        if (process?.isTriggerable) setTriggerable(process.isTriggerable);
    }, [process]);

    useEffect(() => {
        setSubscribed(Boolean(currentProcessSubscription));
    }, [currentProcessSubscription]);

    const fetchProcess = async () => {
        await dispatch(processActions.fetchProcessById(process.id));
    };

    const handleSelectBotSystem = async (system: IBotSystem) => {
        await dispatch(processActions.updateBotSystem({ id: process.id, system }));
        setSelectedBotSystem(system);
        await fetchProcess();
    };

    const handleSelectBotCollection = async (botCollection: IBotCollection) => {
        await dispatch(
            processActions.updateBotCollection({ id: process.id, botCollection })
        );
        setSelectedBotCollection(botCollection);
        await fetchProcess();
    };

    const handleAttendanceChange = async (isAttended: boolean) => {
        await dispatch(
            processActions.updateAttendance({ id: process.id, isAttended })
        );
        setAttended(isAttended);
        await fetchProcess();
    };

    const handleTriggerableChange = async (isTriggerable: boolean) => {
        await dispatch(
            processActions.updateTriggerable({ id: process.id, isTriggerable })
        );
        setTriggerable(isTriggerable);
        await fetchProcess();
    };

    const handleSubscriptionChange = async (subscriptionState: boolean) => {
        subscriptionState
            ? await dispatch(processActions.subscribeProcessNotifications({ processId, userId }))
            : await dispatch(processActions.unsubscribeProcessNotifications(currentProcessSubscription.id));

        await handleGetProcessSubscribers();
    };

    async function handleDeleteSubscription(subscriptionInfo: ProcessNotificationRow) {
        await dispatch(processActions.unsubscribeProcessNotifications(subscriptionInfo.id));
        await handleGetProcessSubscribers();
    }

    const attendedBox = (
        <Box>
            <AttendancePaper>
                <ProcessAttendedComponent
                    isProcessAttended={attended}
                    onAttendedChange={handleAttendanceChange}
                />
            </AttendancePaper>
        </Box>
    );

    return (
        <ContainerWrapper>
            <Container>
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
                <If condition={isScheduled} else={attendedBox}>
                    <Tooltip title={translate('Process.Configure.Attended.Schedule.Message')} placement="top">
                        {attendedBox}
                    </Tooltip>
                </If>
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
                            isSubscribed={subscribed}
                            onSubscriptionChange={handleSubscriptionChange}
                            label={translate('Process.Edit.Form.Fields.IsSubscribed.Label')}
                            tooltip={translate('Process.Edit.Form.Fields.IsSubscribed.Tooltip')}
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
            </Dialog>
        </ContainerWrapper>
    );
};

export default ProcessConfigureView;
