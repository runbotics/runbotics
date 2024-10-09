import React, { FC, useCallback, useEffect, useRef, useState } from 'react';

import { Box, DialogContent } from '@mui/material';

import BpmnIoModeler from 'bpmn-js/lib/Modeler';

import { saveAs } from 'file-saver';

import moment from 'moment';

import { useRouter } from 'next/router';
import { useSnackbar } from 'notistack';

import { FeatureKey } from 'runbotics-common';

import extractNestedSchemaKeys from '#src-app/components/utils/extractNestedSchemaKeys';
import LoadingScreen from '#src-app/components/utils/LoadingScreen';
import useFeatureKey from '#src-app/hooks/useFeatureKey';
import useProcessExport from '#src-app/hooks/useProcessExport';
import useTranslations from '#src-app/hooks/useTranslations';
import { useDispatch, useSelector } from '#src-app/store';
import { activityActions } from '#src-app/store/slices/Action';
import { globalVariableActions } from '#src-app/store/slices/GlobalVariable';

import { processActions } from '#src-app/store/slices/Process';

import { recordProcessSaveFail, recordProcessSaveSuccess } from '#src-app/utils/Mixpanel/utils';

import BpmnModeler, {
    AdditionalInfo,
    ModelerImperativeHandle,
    retrieveGlobalVariableIds,
} from './Modeler/BpmnModeler';

import { StyledCard } from './ProcessBuildView.styled';

const BORDER_SIZE = 2;
const SNACKBAR_DURATION = 1500;

const ProcessBuildView: FC = () => {
    const dispatch = useDispatch();
    const { createRbexFile } = useProcessExport();
    const { enqueueSnackbar } = useSnackbar();
    const { translate } = useTranslations();
    const { id } = useRouter().query;
    const BpmnModelerRef = useRef<ModelerImperativeHandle>(null);
    const [offSet, setOffSet] = useState<number>(null);
    const actionsLoading = useSelector((state) => state.action.actions.loading);
    const { process } = useSelector((state) => state.process.draft);
    const hasAdvancedActionsAccess = useFeatureKey([FeatureKey.PROCESS_ACTIONS_LIST_ADVANCED]);
    const hasActionsAccess = useFeatureKey([FeatureKey.EXTERNAL_ACTION_READ]);

    useEffect(() => {
        if (!hasAdvancedActionsAccess) return;
        hasActionsAccess && dispatch(activityActions.getAllActions());

        dispatch(globalVariableActions.getGlobalVariables());
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [id, hasAdvancedActionsAccess]);

    useEffect(() => {
        if (!process) return;

        if (process.executionInfo && process.isAttended) {
            const attendedVariables = extractNestedSchemaKeys(JSON.parse(process.executionInfo)?.schema);
            dispatch(processActions
                .setPassedInVariables(attendedVariables ?? []));
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [process?.id]);

    useEffect(
        () => () => {
            dispatch(processActions.clearModelerState());
        },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [],
    );

    const onRefChange = useCallback((node: HTMLDivElement) => {
        if (node) setOffSet(node.offsetTop + BORDER_SIZE);
    }, []);

    const onSave = async (modeler: BpmnIoModeler) => {
        try {
            const definition = await BpmnModelerRef.current.export();
            const globalVariableIds = retrieveGlobalVariableIds(modeler);

            await dispatch(
                processActions.updateDiagram(
                    {
                        payload: {
                            definition,
                            globalVariableIds,
                            executionInfo: process.executionInfo,
                        },
                        resourceId: process.id,
                    },
                ),
            );

            dispatch(processActions.clearErrors());
            enqueueSnackbar(translate('Process.MainView.Toast.Save.Success'), {
                variant: 'success',
                autoHideDuration: SNACKBAR_DURATION,
            });
            recordProcessSaveSuccess({ processName: process.name, processId: String(process.id) });

        } catch (error) {
            enqueueSnackbar(translate('Process.MainView.Toast.Save.Failed'), {
                variant: 'error',
                autoHideDuration: SNACKBAR_DURATION,
            });
            recordProcessSaveFail({
                processName: process.name,
                processId: String(process.id),
                reason: translate('Process.MainView.Toast.Save.Failed'),
            });
        }
    };

    const handleImport = (
        definition: string,
        additionalInfo: AdditionalInfo,
    ) => {
        dispatch(processActions.clearErrors());
        dispatch(
            processActions.setDraft({
                process: {
                    ...process,
                    definition,
                    ...additionalInfo,
                },
            }),
        );
    };

    const handleExport = async () => {
        const definition = await BpmnModelerRef.current.export();

        const blob = new Blob([createRbexFile(definition, process)], {
            type: 'text/plain',
        });

        saveAs(
            blob,
            `${process.name}_${moment().format('YYYY_MM_DD_HH_mm')}.rbex`,
        );
    };

    if (!process || process.id?.toString() !== id || actionsLoading) {
        return <LoadingScreen/>;
    }

    return (
        <StyledCard offsetTop={offSet}>
            <DialogContent ref={onRefChange} sx={{ padding: 0 }}>
                <Box position="relative">
                    <BpmnModeler
                        ref={BpmnModelerRef}
                        definition={process.definition}
                        offsetTop={offSet}
                        onSave={onSave}
                        onExport={handleExport}
                        onImport={handleImport}
                        process={process}
                    />
                </Box>
            </DialogContent>
        </StyledCard>
    );
};

export default ProcessBuildView;
