import BpmnModdle, { BaseElement, Definitions } from 'bpmn-moddle';
import { GeneralAction, IProcess } from 'runbotics-common';

interface CustomExtensionElement {
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

interface CustomModdleElement
    extends Pick<BaseElement, 'id' | '$attrs' | '$type'> {
    implementation: string;
    extensionElements: CustomExtensionElement;
}

interface CustomDefinition extends Definitions {
    elementsById: {
        [key: BaseElement['id']]: CustomModdleElement;
    };
}

const startProcessActionBodyPattern = /\${(.+?)}/;

const isActionStartProcess = (elementId: string, element: unknown) =>
    elementId.startsWith('Activity') &&
    element !== null &&
    element !== undefined &&
    typeof element === 'object' &&
    '$attrs' in element &&
    element.$attrs !== null &&
    element.$attrs !== undefined &&
    typeof element.$attrs === 'object' &&
    'camunda:actionId' in element.$attrs &&
    typeof element.$attrs['camunda:actionId'] === 'string' &&
    element.$attrs['camunda:actionId'] === GeneralAction.START_PROCESS;

export const findSubprocess = async (xmlStr: string) => {
    const moddle = new BpmnModdle();

    const parsedProcessDefinition = (await moddle.fromXML(
        xmlStr
    )) as CustomDefinition;

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

                const processId = startProcessActionElement.$body.match(
                    startProcessActionBodyPattern
                );
                if (!processId) return processIds;

                processIds.push(Number(processId[1]));

                return processIds;
            },
            []
        )
    );

    const uniqueSubprocessIds = Array.from(new Set(subprocessIds));

    return uniqueSubprocessIds;
};
