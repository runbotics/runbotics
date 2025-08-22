
import activeProcess from './activeProcess';
import common from './common';
import schedulerDelete from './delete';
import dialog from './dialog';
import scheduleProcess from './scheduledProcess';
import schedulerUpdateTranslations from './schedulerUpdateTranslations';
import view from './view';
import waitingProcess from './waitingProcess';

const schedulerTranslations = {
    ...activeProcess,
    ...common,
    ...schedulerDelete,
    ...dialog,
    ...scheduleProcess,
    ...view,
    ...waitingProcess,
    ...schedulerUpdateTranslations,
};

export default schedulerTranslations;
