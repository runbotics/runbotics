import React, { FC, useEffect, useState } from 'react';
import styled from 'styled-components';
import { FeatureKey, IProcess, ProcessInstanceStatus } from 'runbotics-common';
import { SvgIcon, Tooltip } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { Play as PlayIcon } from 'react-feather';
import { processActions, StartProcessResponse } from 'src/store/slices/Process';
import { useDispatch, useSelector } from 'src/store';
import { processInstanceActions, processInstanceSelector } from 'src/store/slices/ProcessInstance';
import useProcessInstanceSocket from 'src/hooks/useProcessInstanceSocket';
import { unwrapResult } from '@reduxjs/toolkit';
import { useSnackbar } from 'notistack';
import useTranslations from 'src/hooks/useTranslations';
import useFeatureKey from 'src/hooks/useFeatureKey';
import If from './utils/If';
import { AttendedProcessModal } from './AttendedProcessModal';

const BOT_SEARCH_TOAST_KEY = 'bot-search-toast';

const StyledRunButton = styled(LoadingButton)(
    ({ theme }) => `
    margin-top: ${theme.spacing(1)};
    & + & {
        margin-left: ${theme.spacing(1)};
    }
    `,
);

interface BotProcessRunnerProps {
    className?: string;
    process?: IProcess;
    onRunClick?: () => void;
    color?: 'inherit' | 'error' | 'secondary' | 'success' | 'warning' | 'info' | 'primary';
    variant?: 'text' | 'outlined' | 'contained';
}

const BotProcessRunner: FC<BotProcessRunnerProps> = ({
    className,
    process,
    onRunClick,
    color = 'secondary',
    variant = 'text',
}) => {
    const dispatch = useDispatch();
    const { enqueueSnackbar, closeSnackbar } = useSnackbar();
    const [started, setStarted] = useState(false);
    const [isSubmitting, setSubmitting] = useState(false);
    const [loading, setLoading] = useState(false);
    const [modalOpen, setModalOpen] = useState(false);
    const { translate } = useTranslations();
    const hasRunProcessAccess = useFeatureKey([FeatureKey.PROCESS_START]);

    const processInstances = useSelector(processInstanceSelector);
    const { orchestratorProcessInstanceId, processInstance } = processInstances.active;

    useEffect(() => {
        const isProcessInstanceFinished =
            processInstance?.status === ProcessInstanceStatus.COMPLETED ||
            processInstance?.status === ProcessInstanceStatus.ERRORED ||
            processInstance?.status === ProcessInstanceStatus.TERMINATED;

        if (isProcessInstanceFinished) {
            setStarted(false);
        }
    }, [processInstance]);

    useProcessInstanceSocket({ orchestratorProcessInstanceId });

    const openModal = () => setModalOpen(true);
    const closeModal = () => setModalOpen(false);

    const handleRun = (executionInfo?: Record<string, any>) => {
        dispatch(processInstanceActions.resetActiveProcessInstaceAndEvents());

        enqueueSnackbar(translate('Component.BotProcessRunner.Warning'), {
            variant: 'warning',
            key: BOT_SEARCH_TOAST_KEY,
        });

        setLoading(true);
        setSubmitting(true);
        closeModal();

        dispatch(
            processActions.startProcess({
                processId: process.id,
                executionInfo: process.executionInfo ? executionInfo : {},
            }),
        )
            .then(unwrapResult)
            .then(async (response: StartProcessResponse) => {
                onRunClick?.();
                await dispatch(
                    processInstanceActions.updateOrchestratorProcessInstanceId(response.orchestratorProcessInstanceId),
                );
                setStarted(true);
            })
            .catch(() => {
                setStarted(false);
                enqueueSnackbar(translate('Component.BotProcessRunner.Error'), { variant: 'error' });
            })
            .finally(() => {
                setSubmitting(false);
                setLoading(false);
                closeSnackbar(BOT_SEARCH_TOAST_KEY);
            });
    };

    const isRunButtonDisabled = started || isSubmitting || !process.system || !process.botCollection;
    const isProcessAttended = process?.isAttended && process?.executionInfo;
    const tooltipTitle =
        processInstance?.status === ProcessInstanceStatus.IN_PROGRESS
            ? translate('Component.BotProcessRunner.Tooltip.Title.ProcessRunning')
            : translate('Component.BotProcessRunner.Tooltip.Title.LookingForBot');

    const runButton = (
        <>
            <If condition={modalOpen}>
                <AttendedProcessModal setOpen={setModalOpen} open={modalOpen} process={process} onSubmit={handleRun} />
            </If>
            <If condition={hasRunProcessAccess}>
                <StyledRunButton
                    className={className}
                    disabled={isRunButtonDisabled}
                    onClick={isProcessAttended ? openModal : handleRun}
                    color={color}
                    loading={loading}
                    loadingPosition="start"
                    startIcon={
                        <SvgIcon fontSize="small">
                            <PlayIcon />
                        </SvgIcon>
                    }
                    variant={variant}
                >
                    {translate('Component.BotProcessRunner.Run')}
                </StyledRunButton>
            </If>
        </>
    );

    return (
        <If condition={isRunButtonDisabled} else={runButton}>
            <Tooltip title={tooltipTitle} placement="top">
                <span>{runButton}</span>
            </Tooltip>
        </If>
    );
};

export default BotProcessRunner;
