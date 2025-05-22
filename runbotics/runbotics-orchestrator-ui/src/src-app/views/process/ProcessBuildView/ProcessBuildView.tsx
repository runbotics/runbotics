import { useCallback, useRef, useState, useEffect, FC } from 'react';

import { Box, DialogContent } from '@mui/material';
import BpmnIoModeler from 'bpmn-js/lib/Modeler';
import { saveAs } from 'file-saver';
import moment from 'moment';
import { useRouter } from 'next/router';
import { useSnackbar } from 'notistack';
import { Credential, FeatureKey } from 'runbotics-common';

import extractNestedSchemaKeys from '#src-app/components/utils/extractNestedSchemaKeys';
import LoadingScreen from '#src-app/components/utils/LoadingScreen';
import useFeatureKey from '#src-app/hooks/useFeatureKey';
import useProcessExport from '#src-app/hooks/useProcessExport';
import useTranslations from '#src-app/hooks/useTranslations';
import { useDispatch, useSelector } from '#src-app/store';
import { activityActions } from '#src-app/store/slices/Action';
import { globalVariableActions } from '#src-app/store/slices/GlobalVariable';
import { pluginActions } from '#src-app/store/slices/Plugin';
import { processActions } from '#src-app/store/slices/Process';

import BpmnModeler, {
    AdditionalInfo,
    ModelerImperativeHandle,
} from './Modeler/BpmnModeler';
import { StyledCard } from './ProcessBuildView.styled';
import { BORDER_SIZE, saveProcess } from './ProcessBuildView.utils';
import ProcessImportDialog from './ProcessImportDialog';
import { resolveCredentials } from './ProcessImportDialog.utils';

const ProcessBuildView: FC = () => {
    const dispatch = useDispatch();
    const router = useRouter();
    const { createRbexFile } = useProcessExport();
    const { enqueueSnackbar } = useSnackbar();
    const { id } = useRouter().query;
    const BpmnModelerRef = useRef<ModelerImperativeHandle>(null);
    const [offSet, setOffSet] = useState<number>(null);
    const actionsLoading = useSelector((state) => state.action.actions.loading);
    const { process } = useSelector((state) => state.process.draft);
    const { loadedPlugins } = useSelector((state) => state.plugin);
    const { translate, currentLanguage } = useTranslations();
    const hasAdvancedActionsAccess = useFeatureKey([FeatureKey.PROCESS_ACTIONS_LIST_ADVANCED]);
    const hasActionsAccess = useFeatureKey([FeatureKey.EXTERNAL_ACTION_READ]);
    const [isImportDialogOpen, setIsImportDialogOpen] = useState(false);
    const [processDefinition, setProcessDefinition] = useState('');
    const [importedCustomCredentials, setImportedCustomCredentials] = useState<Credential[]>(null);
    const [additionalProps, setAdditionalProps] = useState<AdditionalInfo>(null);

    useEffect(() => {
        if (!hasAdvancedActionsAccess) return;
        if (hasActionsAccess) {
            dispatch(activityActions.getAllActions());
            dispatch(pluginActions.loadPlugins());
        }

        dispatch(globalVariableActions.getGlobalVariables());
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [id, hasAdvancedActionsAccess]);

    useEffect(() => {
        dispatch(pluginActions.setPluginBpmnActions({ translate }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [loadedPlugins, currentLanguage]);

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
        await saveProcess({
            modeler,
            BpmnModelerRef,
            process,
            enqueueSnackbar,
            dispatch,
        });
    };

    const importDraft = (definition: string, additionalInfo: AdditionalInfo) => {
        setImportedCustomCredentials(null);
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

    const handleImport = async (
        definition: string,
        additionalInfo: AdditionalInfo,
    ) => {
        const resolvedCredentials = await resolveCredentials(definition, dispatch);
        if (resolvedCredentials?.length > 0) { setImportedCustomCredentials(resolvedCredentials); }
        if (!resolvedCredentials?.length) { importDraft(definition, additionalInfo); return; }
        setIsImportDialogOpen(true);
        setProcessDefinition(definition);
        setAdditionalProps(additionalInfo);
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
                    <ProcessImportDialog
                        isOpen={isImportDialogOpen}
                        setIsOpen={setIsImportDialogOpen}
                        credentials={importedCustomCredentials}
                        importDraft={importDraft}
                        processDefinition={processDefinition}
                        additionalProps={additionalProps}
                    />
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
