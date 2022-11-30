import { IProcessTrigger, IUser, ProcessTrigger } from 'runbotics-common';

import useTranslations from './useTranslations';

const isProcessTrigger = (
    trigger: IProcessTrigger | ProcessTrigger
): trigger is ProcessTrigger => typeof trigger === 'string' && trigger in ProcessTrigger;

const useInitiatorLabel = () => {
    const { translate } = useTranslations();

    const mapInitiatorLabel = (
        user: IUser, trigger: IProcessTrigger | ProcessTrigger, triggeredBy: string | undefined
    ) => {
        const triggerName = isProcessTrigger(trigger) ? trigger : trigger.name;

        switch (triggerName) {
            case ProcessTrigger.SCHEDULER:
                return translate('Component.HistoryTable.Rows.Initiator.Scheduler', { login: user?.login });
            case ProcessTrigger.API:
                return translate('Component.HistoryTable.Rows.Initiator.Api', { login: user?.login });
            case ProcessTrigger.EMAIL:
                return translate('Component.HistoryTable.Rows.Initiator.Email', { email: triggeredBy });
            default:
                return user?.login;
        }
    };

    return { mapInitiatorLabel };
};

export default useInitiatorLabel;
