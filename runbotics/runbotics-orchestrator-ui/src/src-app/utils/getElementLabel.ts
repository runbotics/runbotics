import { checkIfKeyExists, translate } from '#src-app/hooks/useTranslations';
import { BPMNElement } from '#src-app/views/process/ProcessBuildView/Modeler/helpers/elementParameters';

import { capitalizeFirstLetter } from './text';

const getElementLabel = (element: BPMNElement): string => {
    const {
        businessObject: { actionId, label }
    } = element;
    if (label) return label;

    const translationKey = `Process.Details.Modeler.Actions.${
        actionId
            ? capitalizeFirstLetter({
                text: actionId,
                lowerCaseRest: false,
                delimiter: '.',
                join: '.'
            })
            : ''
    }.Label`;
    
    if (checkIfKeyExists(translationKey)) return translate(translationKey);
    return actionId || '';
};

export default getElementLabel;
