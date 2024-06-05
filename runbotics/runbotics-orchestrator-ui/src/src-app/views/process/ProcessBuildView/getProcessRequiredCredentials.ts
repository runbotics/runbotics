import { BpmnElementType } from 'runbotics-common';
import { useModelerContext } from '#src-app/hooks/useModelerContext';
import { useEffect } from 'react';
import { useSelector } from '#src-app/store';
import { BPMNElementRegistry } from '#src-app/views/process/ProcessBuildView/Modeler/helpers/elementParameters';
import actions from '#src-app/Actions';


export const getProcessRequiredCredentials = () => {
    const draftProcess = useSelector((state) => state.process.draft.process);
    const { modeler } = useModelerContext();

    useEffect(() => {
        if(modeler && draftProcess){
            // console.log('xd', process.definition);
            const elements = modeler.get('elementRegistry')._elements as BPMNElementRegistry;
            const credentialTypesWithDuplicates = Object.values(elements)
                .filter(element => element.element.type === BpmnElementType.SERVICE_TASK)
                .flatMap(serviceTask => {
                    return actions[serviceTask.element.businessObject.actionId].credentialType;
                })
                .filter(credentialType => !!credentialType);
            const credentialTypes = Array.from(new Set(credentialTypesWithDuplicates));
        }
    }, [draftProcess, modeler]);
    // const engine = new Engine({
    //     name: process.name,
    //     source: process.definition,
    // })
}
