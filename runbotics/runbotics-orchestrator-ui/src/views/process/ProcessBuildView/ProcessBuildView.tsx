import React, { FC, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Box, DialogContent } from '@mui/material';
import { useDispatch, useSelector } from 'src/store';
import { getActions } from 'src/store/slices/Action/Action.thunks';
import { globalVariableActions } from 'src/store/slices/GlobalVariable';
import LoadingScreen from 'src/components/utils/LoadingScreen';
import { saveAs } from 'file-saver';
import moment from 'moment';
import { ProcessBuildTab } from 'src/types/sidebar';
import { processActions } from 'src/store/slices/Process';
import { useParams } from 'react-router-dom';
import { ProcessParams } from 'src/utils/types/ProcessParams';
import BpmnModeler, { ModelerImperativeHandle } from './Modeler/BpmnModeler';
import { StyledCard } from './ProcessBuildView.styled';
import _ from 'lodash';
import { useSnackbar } from 'notistack';
import useTranslations from 'src/hooks/useTranslations';

const BORDER_SIZE = 2;
const SNACKBAR_DURATION = 1500;

const ProcessBuildView: FC = () => {
    const dispatch = useDispatch();
    const { enqueueSnackbar } = useSnackbar();
    const { translate } = useTranslations();
    const { id } = useParams<ProcessParams>();
    const BpmnModelerRef = useRef<ModelerImperativeHandle>(null);
    const [offSet, setOffSet] = useState<number>(null);
    const actionsLoading = useSelector((state) => state.action.actions.loading);
    const { process } = useSelector((state) => state.process.draft);

    const onRefChange = useCallback((node: HTMLDivElement) => {
        if (node) {
            setOffSet(node.offsetTop + BORDER_SIZE);
        }
    }, []);

    const onSave = async () => {
        try {
            const definition = await BpmnModelerRef.current.export();

            await dispatch(
                processActions.saveProcess({
                    ...process,
                    definition,
                }),
            );
            dispatch(processActions.clearModelerState());
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

    const handleImport = (definition: string) => {
        dispatch(
            processActions.setDraft({
                process: {
                    ...process,
                    definition,
                },
            }),
        );
    };

    const handleExport = async () => {
        const definition = await BpmnModelerRef.current.export();

        const blob = new Blob([definition], {
            type: 'text/plain',
        });

        saveAs(blob, `${process.name}_${moment().format('YYYY_MM_DD_HH_mm')}.bpmn`);
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
