import { useModelerContext } from '#src-app/hooks/useModelerContext';
import { useMemo } from 'react';
import { useSelector } from '#src-app/store';
import { getRequiredCredentialsTypesInProcess } from '#src-app/credentials/getRequiredCredentialsTypesInProcess';

export const useRequiredCredentialTypes = () => {
    const draftProcess = useSelector((state) => state.process.draft.process);
    const { modeler } = useModelerContext();

    return useMemo(() => {
        if(modeler && draftProcess){
            return getRequiredCredentialsTypesInProcess(modeler);
        }
        return null;
    }, [draftProcess, modeler]);
}
