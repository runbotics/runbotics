import React, { useEffect, useMemo, useState, VFC } from 'react';

import { Box, Dialog } from '@mui/material';
import { useRouter } from 'next/router';
import {
    IBotSystem,
    IBotCollection,
    NotificationProcess,
    NotificationProcessType,
    Role,
} from 'runbotics-common';

import { ProcessOutput } from 'runbotics-common/dist/model/api/process-output.model';

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

import { processActions, processSelector } from '#src-app/store/slices/Process';

import { processOutputActions } from '#src-app/store/slices/ProcessOutput';

import BotCollectionComponent from './BotCollection.component';
import BotSystemComponent from './BotSystem.component';
import ProcessAddEmailSubscriptionComponent from './ProcessAddEmailSubscriptionComponent';
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

// eslint-disable-next-line max-lines-per-function
const ProcessConfigureView: VFC = () => {
    const dispatch = useDispatch();
    const {
        draft: { process, processSubscriptions },
        all: { loading },
    } = useSelector(processSelector);
    const { id } = useRouter().query;
    const processId = Number(id);

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

    const notificationTableColumns = useProcessNotificationColumns({
        onDelete: handleDeleteSubscription,
    });

    const hasAddMailPermission = useRole([Role.ROLE_TENANT_ADMIN]) && process.tenantId === user.tenant.id;

    const notificationTableRows = useMemo(
        () =>
            processSubscriptions.map<ProcessNotificationRow>(
                (sub: NotificationProcess) => ({
                    id: sub.id,
                    userEmail: sub.user.email,
                    email: sub.email,
                    subscribedAt: sub.createdAt,
                })
            ),
        [processSubscriptions]
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
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [processId]);

    useEffect(() => {
        if (process?.system) setSelectedBotSystem(process.system);

        if (process?.botCollection) setSelectedBotCollection(process.botCollection);

        if (process?.isAttended) setAttended(process.isAttended);

        if (process?.isTriggerable) setTriggerable(process.isTriggerable);

        if (process?.output) setProcessOutputType(process.output);
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

    const handleSubscriptionChange = async (subscriptionState: boolean) => {
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
                        (sub) => sub.user.id === user.id && !sub.email
                    ).id,
                })
            );

        await handleGetProcessSubscribers();
    };

    const handleSubscribeToCustomEmail = async (customEmail: string) => {
        await dispatch(
            processActions.subscribeProcessNotifications({
                payload: {
                    processId,
                    type: NotificationProcessType.PROCESS_ERROR,
                    email: customEmail,
                },
            })
        );

        await handleGetProcessSubscribers();
    };

    async function handleDeleteSubscription(
        subscriptionInfo: ProcessNotificationRow
    ) {
        await dispatch(
            processActions.unsubscribeProcessNotifications({
                resourceId: subscriptionInfo.id,
            })
        );
        await handleGetProcessSubscribers();
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
                                isSubscribed={processSubscriptions.some((sub) => sub.user.id === user.id && !sub.email)}
                                onSubscriptionChange={handleSubscriptionChange}
                                label={translate('Process.Edit.Form.Fields.IsSubscribed.Label')}
                                tooltip={translate('Process.Edit.Form.Fields.IsSubscribed.Tooltip')}
                            />
                        </StyledPaper>
                    </Box>
                </SettingsContainer>
                <CredentialsContainer>
                    <StyledPaper>
                        <ProcessCredentials/>
                    </StyledPaper>
                </CredentialsContainer>
            </PageContainer>
            <Dialog open={open} onClose={() => setOpen(false)} maxWidth={false}>
                <NotificationTableComponent
                    notificationTableColumns={notificationTableColumns}
                    subscribersList={notificationTableRows ?? []}
                    onClose={() => setOpen(false)}
                    loading={loading}
                />
                <If condition={hasAddMailPermission}>
                    <ProcessAddEmailSubscriptionComponent onEmailAdd={handleSubscribeToCustomEmail} />
                </If>
            </Dialog>
        </ContainerWrapper>
    );
};

export default ProcessConfigureView;
