import React, { FC, useCallback, useEffect, useRef, useState } from 'react';

import { Box, DialogContent } from '@mui/material';

import { saveAs } from 'file-saver';

import moment from 'moment';

import { useRouter } from 'next/router';
import { useSnackbar } from 'notistack';

import LoadingScreen from '#src-app/components/utils/LoadingScreen';
import useProcessExport from '#src-app/hooks/useProcessExport';
import useTranslations from '#src-app/hooks/useTranslations';
import { useDispatch, useSelector } from '#src-app/store';
import { getActions } from '#src-app/store/slices/Action/Action.thunks';
import { globalVariableActions } from '#src-app/store/slices/GlobalVariable';

import { processActions } from '#src-app/store/slices/Process';

import BpmnModeler, {
    AdditionalInfo,
    ModelerImperativeHandle,
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

    useEffect(() => {
        dispatch(getActions());
        dispatch(globalVariableActions.getGlobalVariables());
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [id]);

    const onRefChange = useCallback((node: HTMLDivElement) => {
        if (node) setOffSet(node.offsetTop + BORDER_SIZE);
    }, []);

    const onSave = async () => {
        try {
            const definition = await BpmnModelerRef.current.export();
            await dispatch(
                processActions.saveProcess({
                    ...process,
                    definition,
                })
            );

            dispatch(processActions.clearErrors());
            enqueueSnackbar(translate('Process.MainView.Toast.Save.Success'), {
                variant: 'success',
                autoHideDuration: SNACKBAR_DURATION,
            });
        } catch (error) {
            enqueueSnackbar(translate('Process.MainView.Toast.Save.Failed'), {
                variant: 'error',
                autoHideDuration: SNACKBAR_DURATION,
            });
        }
    };

    const handleImport = (
        definition: string,
        additionalInfo: AdditionalInfo
    ) => {
        dispatch(processActions.clearErrors());
        dispatch(
            processActions.setDraft({
                process: {
                    ...process,
                    definition,
                    ...additionalInfo,
                },
            })
        );
    };

    const handleExport = async () => {
        const definition = await BpmnModelerRef.current.export();

        const blob = new Blob([createRbexFile(definition, process)], {
            type: 'text/plain',
        });

        saveAs(
            blob,
            `${process.name}_${moment().format('YYYY_MM_DD_HH_mm')}.rbex`
        );
    };

    if (!process || process.id?.toString() !== id || actionsLoading) {
        return <LoadingScreen />;
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
