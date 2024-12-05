import BpmnModdle from 'bpmn-moddle';
import { ActionCredentialType } from 'runbotics-common';
import { Definition, ModdleElement } from './findSubprocess';

const isValueInEnum = (value: string) => {
    return (Object.values(ActionCredentialType) as string[]).includes(value);
};


const isCredentialType = (element: ModdleElement) =>
    'camunda:actionId' in element.$attrs &&
    typeof element.$attrs['camunda:credentialType'] === 'string' &&
    isValueInEnum(element.$attrs['camunda:credentialType']);


export const findProcessActionTemplates = async (xmlStr: string) => {
    const moddle = new BpmnModdle();

    const parsedProcessDefinition = (await moddle.fromXML(
        xmlStr
    )) as Definition;

    const bpmnElements = parsedProcessDefinition.elementsById;

    const credentialTypes = Object.entries(bpmnElements).reduce((acc, [elementId, element]) => {
            if (isCredentialType(element)) {
                acc.add(element.$attrs['camunda:credentialType']);
            }
            return acc;
        }, new Set<string>());

    return [...credentialTypes];
};
