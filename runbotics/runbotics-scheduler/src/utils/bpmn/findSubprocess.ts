import BpmnModdle, { BaseElement, Definitions } from 'bpmn-moddle';
import { GeneralAction, IProcess } from 'runbotics-common';

interface ExtensionElement {
    values: {
        $children: {
            $body: string;
            $type: string;
            type: string;
            name: string;
        }[];
        $type: string;
    }[];
}

interface ModdleElement extends Pick<BaseElement, 'id' | '$attrs' | '$type'> {
    implementation: string;
    extensionElements: ExtensionElement;
}

interface Definition extends Definitions {
    elementsById: {
        [key: BaseElement['id']]: ModdleElement;
    };
}

const startProcessActionBodyPattern = /\${(.+?)}/;

const isObject = (element: unknown): element is object =>
    element !== null && element !== undefined && typeof element === 'object';

const hasAttributes = (element: object): element is ModdleElement =>
    '$attrs' in element &&
    element.$attrs !== null &&
    element.$attrs !== undefined &&
    typeof element.$attrs === 'object';

const hasStartEventActionId = (element: ModdleElement) =>
    'camunda:actionId' in element.$attrs &&
    typeof element.$attrs['camunda:actionId'] === 'string' &&
    element.$attrs['camunda:actionId'] === GeneralAction.START_PROCESS;

const isActionStartProcess = (elementId: string, element: unknown) =>
    elementId.startsWith('Activity') &&
    isObject(element) &&
    hasAttributes(element) &&
    hasStartEventActionId(element);

export const findSubprocess = async (xmlStr: string) => {
    const moddle = new BpmnModdle();

    const parsedProcessDefinition = (await moddle.fromXML(
        xmlStr
    )) as Definition;

    const bpmnElements = parsedProcessDefinition.elementsById;
    const activities = Object.entries(bpmnElements).filter(
        ([elementId, element]) => isActionStartProcess(elementId, element)
    );

    const subprocessIds = activities.flatMap(([elementId, element]) =>
        element?.extensionElements.values.reduce<IProcess['id'][]>(
            (processIds, extensionElement) => {
                if (!('$children' in extensionElement)) return processIds;

                const startProcessActionElement =
                    extensionElement.$children.find(
                        ({ name }) => name === 'processId'
                    );
                if (!startProcessActionElement) return processIds;

                const processIdMatch = startProcessActionElement.$body.match(
                    startProcessActionBodyPattern
                );
                if (!processIdMatch) return processIds;

                const processIdValue = Number(processIdMatch[1]);
                processIds.push(processIdValue);

                return processIds;
            },
            []
        )
    );

    const uniqueSubprocessIdSet = new Set(subprocessIds);
    return [...uniqueSubprocessIdSet];
};
