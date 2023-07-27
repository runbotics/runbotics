import ActiveProcess from './activeProcess';
import Common from './common';
import Delete from './delete';
import Dialog from './dialog';
import ScheduledProcess from './scheduledProcess';
import View from './view';
import WaitingProcess from './waitingProcess';

const schedulerTranslations = {
    ...ActiveProcess,
    ...Common,
    ...Delete,
    ...Dialog,
    ...ScheduledProcess,
    ...View,
    ...WaitingProcess,
};

export default schedulerTranslations;
