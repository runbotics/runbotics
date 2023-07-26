import { checkIfKeyExists, translate } from '#src-app/hooks/useTranslations';
import { BPMNElement } from '#src-app/views/process/ProcessBuildView/Modeler/helpers/elementParameters';

import { capitalizeFirstLetter } from './text';

const getElementLabel = (element: BPMNElement): string => {
    const {
        businessObject: { actionId, label }
    } = element;

    if (label) return label;

    const partialActionTranslationKey = actionId
        ? capitalizeFirstLetter({
            text: actionId,
            lowerCaseRest: false,
            delimiter: '.',
            join: '.'
        })
        : '';
    const translationKey = `Process.Details.Modeler.Actions.${partialActionTranslationKey}.Label`;
    const actionGroupKey = partialActionTranslationKey.split('.')[0];
    const actionGroupTranslationKey = `Process.Details.Modeler.ActionsGroup.${actionGroupKey}`;
    
    if (checkIfKeyExists(translationKey)) {
        if (checkIfKeyExists(actionGroupTranslationKey)) {
            return `${translate(actionGroupTranslationKey)}: ${translate(translationKey)}`;
        }
        return translate(translationKey);
    }
    return actionId || '';
};

export default getElementLabel;
