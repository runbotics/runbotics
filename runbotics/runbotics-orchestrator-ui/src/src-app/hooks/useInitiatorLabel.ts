import { EmailTriggerData, IProcessInstance, TriggerEvent } from 'runbotics-common';

import useTranslations from './useTranslations';

type InitiatorLabelParams = Pick<IProcessInstance, 'user'| 'trigger' | 'triggerData'>;

const useInitiatorLabel = () => {
    const { translate } = useTranslations();

    const mapInitiatorLabel = ({ user, trigger, triggerData }: InitiatorLabelParams) => {
        switch (trigger.name) {
            case TriggerEvent.SCHEDULER:
                return translate('Component.HistoryTable.Rows.Initiator.Scheduler', { login: user?.email });
            case TriggerEvent.API:
                return translate('Component.HistoryTable.Rows.Initiator.Api', { login: user?.email });
            case TriggerEvent.EMAIL:
                return translate('Component.HistoryTable.Rows.Initiator.Email', {
                    email: (triggerData as EmailTriggerData).sender,
                });
            default:
                return user?.email;
        }
    };

    return { mapInitiatorLabel };
};

export default useInitiatorLabel;
