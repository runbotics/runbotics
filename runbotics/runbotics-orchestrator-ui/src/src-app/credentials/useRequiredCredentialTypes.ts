import { useMemo } from 'react';

import { getRequiredCredentialsTypesInProcess } from '#src-app/credentials/getRequiredCredentialsTypesInProcess';
import { useSelector } from '#src-app/store';
import { processSelector } from '#src-app/store/slices/Process';

export const useRequiredCredentialTypes = () => {
    const { draft: { process } } = useSelector(processSelector);
    const requiredCredentialTypes = useMemo(() => process.definition
        ? getRequiredCredentialsTypesInProcess(process.definition)
        : null,
    [process]);

    return requiredCredentialTypes;
};
