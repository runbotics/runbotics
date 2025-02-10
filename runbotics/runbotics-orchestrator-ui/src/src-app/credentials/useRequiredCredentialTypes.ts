import { useMemo } from 'react';

import { ActionCredentialType } from 'runbotics-common';

import internalBpmnActions from '#src-app/Actions';
import { getRequiredCredentialsTypesInProcess } from '#src-app/credentials/getRequiredCredentialsTypesInProcess';
import { useSelector } from '#src-app/store';
import { processSelector } from '#src-app/store/slices/Process';

export const useRequiredCredentialTypes = (): ActionCredentialType[] | null => {
    const { draft: { process } } = useSelector(processSelector);
    const externalBpmnActions = useSelector(
        state => state.action.bpmnActions.byId
    );

    const actions = { ...internalBpmnActions, ...externalBpmnActions };

    const requiredCredentialTypes = useMemo(() => process.definition
        ? getRequiredCredentialsTypesInProcess(process.definition, actions)
        : null,
    [process, externalBpmnActions]);

    return requiredCredentialTypes;
};
