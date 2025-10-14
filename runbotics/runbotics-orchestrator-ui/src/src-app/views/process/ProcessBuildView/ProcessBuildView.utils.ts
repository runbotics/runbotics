import BpmnIoModeler from 'bpmn-js/lib/Modeler';
import { useSnackbar } from 'notistack';
import { ProcessDto } from 'runbotics-common';

import { translate } from '#src-app/hooks/useTranslations';
import { AppDispatch } from '#src-app/store';
import { processActions } from '#src-app/store/slices/Process';
import { recordProcessSaveSuccess, recordProcessSaveFail } from '#src-app/utils/Mixpanel/utils';

import { ModelerImperativeHandle, retrieveGlobalVariableIds } from './Modeler/BpmnModeler';


export const BORDER_SIZE = 2;
const SNACKBAR_DURATION = 1500;

interface SaveProcessParams {
    modeler: BpmnIoModeler;
    BpmnModelerRef: React.RefObject<ModelerImperativeHandle>;
    process: ProcessDto;
    dispatch: AppDispatch;
    enqueueSnackbar: ReturnType<typeof useSnackbar>['enqueueSnackbar'];
}

export const saveProcess = async ({
    modeler,
    BpmnModelerRef,
    process,
    dispatch,
    enqueueSnackbar,
}: SaveProcessParams) => {
    try {
        const definition = await BpmnModelerRef.current.export();
        const globalVariableIds = retrieveGlobalVariableIds(modeler);

        await dispatch(
            processActions.updateDiagram({
                payload: {
                    definition,
                    globalVariableIds,
                    executionInfo: process.executionInfo,
                },
                resourceId: process.id,
            }),
        )
            .unwrap()
            .then(() => {
                dispatch(processActions.clearErrors());
                enqueueSnackbar(translate('Process.MainView.Toast.Save.Success'), {
                    variant: 'success',
                    autoHideDuration: SNACKBAR_DURATION,
                });
                recordProcessSaveSuccess({ processName: process.name, processId: String(process.id) });
            })
            .catch((error) => {
                // eslint-disable-next-line no-console
                console.error('Error occured in ProcessBuildView', error);
                dispatch(processActions.fetchProcessById(process.id));
                throw error;
            });
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
