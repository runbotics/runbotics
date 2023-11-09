import React, { useEffect, useMemo, useState, VFC } from 'react';

import { Box, Tooltip } from '@mui/material';
import { useRouter } from 'next/router';
import { IBotSystem, IBotCollection, UserProcess, Role } from 'runbotics-common';

import NotificationSwitchComponent from '#src-app/components/tables/NotificationTable/NotificationSwitchComponent';
import NotificationTableComponent from '#src-app/components/tables/NotificationTable/NotificationTableComponent';
import { ProcessNotificationRow } from '#src-app/components/tables/NotificationTable/NotificationTableComponent.types';
import useProcessNotificationColumns from '#src-app/components/tables/NotificationTable/useProcessNotificationColumns';
import If from '#src-app/components/utils/If';
import useAuth from '#src-app/hooks/useAuth';
import useRole from '#src-app/hooks/useRole';
import { translate } from '#src-app/hooks/useTranslations';
import { useDispatch, useSelector } from '#src-app/store';

import { botCollectionActions } from '#src-app/store/slices/BotCollections';

import { botSystemsActions } from '#src-app/store/slices/BotSystem';

import { processActions } from '#src-app/store/slices/Process';

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
    const { draft: { process, processSubscriptions }, all: { loading } } = useSelector((state) => state.process);
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

    const isAdmin = useRole([Role.ROLE_ADMIN]);
    const { user } = useAuth();
    const [subscribed, setSubscribed] = useState(false);

    const notificationTableColumns = useProcessNotificationColumns({ onDelete: handleDeleteSubscription });

    const notificationTableRows = useMemo(() => {
        if(processSubscriptions.length) {
            return processSubscriptions.map<ProcessNotificationRow>((sub: UserProcess) => ({
                id: sub.userId,
                userId: sub.userId,
                processId: sub.processId,
                user: sub.user.login,
                subscribedAt: sub.subscribedAt,
            }));
        }
        return [];
    }, [processSubscriptions]);

    useEffect(() => {
        dispatch(botCollectionActions.getAll());
        dispatch(botSystemsActions.getAll());
        dispatch(processActions.getProcessSubscriptionInfo(processId));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [processId]);

    useEffect(() => {
        if (process?.system) setSelectedBotSystem(process.system);

        if (process?.botCollection) setSelectedBotCollection(process.botCollection);

        if (process?.isAttended) setAttended(process.isAttended);

        if (process?.isTriggerable) setTriggerable(process.isTriggerable);
    }, [process]);

    useEffect(() => {
        setSubscribed(Boolean(processSubscriptions.find(sub => sub.userId === user.id)));
    }, [processSubscriptions]);

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
            ? await dispatch(processActions.subscribeProcessNotifications({ userId: user.id, processId }))
            : await dispatch(processActions.unsubscribeProcessNotifications({ userId: user.id, processId }));

        await dispatch(processActions.getProcessSubscriptionInfo(processId));
    };

    async function handleDeleteSubscription(subscriberInfo: ProcessNotificationRow) {
        await dispatch(processActions.unsubscribeProcessNotifications({
            userId: subscriberInfo.userId,
            processId,
        }));
        await dispatch(processActions.getProcessSubscriptionInfo(processId));
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
                            isSubscribed={subscribed}
                            onSubscriptionChange={handleSubscriptionChange}
                            label={translate('Process.Edit.Form.Fields.IsSubscribed.Label')}
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

export default ProcessConfigureView;
