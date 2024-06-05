import { useModelerContext } from '#src-app/hooks/useModelerContext';
import { useEffect } from 'react';
import { useSelector } from '#src-app/store';
import { getRequiredCredentialsTypesInProcess } from '#src-app/credentials/getRequiredCredentialsTypesInProcess';

export const useRequiredCredentialTypes = () => {
    const draftProcess = useSelector((state) => state.process.draft.process);
    const { modeler } = useModelerContext();

    useEffect(() => {
        if(modeler && draftProcess){
            getRequiredCredentialsTypesInProcess(modeler);
        }
    }, [draftProcess, modeler]);
}
