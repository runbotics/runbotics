import { BpmnElementType } from 'runbotics-common';
import BpmnModelerType from 'bpmn-js/lib/Modeler';
import { BPMNElementRegistry } from '#src-app/views/process/ProcessBuildView/Modeler/helpers/elementParameters';
import actions from '#src-app/Actions';
import { ActionCredentialType } from '#src-app/credentials/actionCredentialType.enum';

export const getRequiredCredentialsTypesInProcess = (modeler: BpmnModelerType): ActionCredentialType[] => {
    const elements = modeler.get('elementRegistry')._elements as BPMNElementRegistry;

    const credentialTypesWithDuplicates = Object.values(elements)
        .filter(element => element.element.type === BpmnElementType.SERVICE_TASK)
        .map(serviceTask => {
            return actions[serviceTask.element.businessObject.actionId].credentialType;
        })
        .filter(credentialType => !!credentialType);
    
    return Array.from(new Set(credentialTypesWithDuplicates));
};
