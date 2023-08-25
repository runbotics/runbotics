import { ExcelAction } from 'runbotics-common';

import { translate } from '#src-app/hooks/useTranslations';

import { ActionSystem, IBpmnAction, Runner } from '../types';

const getActionClose = (): IBpmnAction => ({
    id: ExcelAction.CLOSE,
    label: translate('Process.Details.Modeler.Actions.Excel.Close.Label'),
    script: ExcelAction.CLOSE,
    runner: Runner.DESKTOP_SCRIPT,
    system: ActionSystem.WINDOWS,
    form: {
        schema: {},
        uiSchema: {},
        formData: {},
    },
});

export default getActionClose;
