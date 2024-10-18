
import { isValidJson } from '#src-app/views/action/action.utils';
import { AdditionalInfo } from '#src-app/views/process/ProcessBuildView/Modeler/BpmnModeler';

interface ImportInfo extends AdditionalInfo {
    definition: string;
}
const useProcessImport = () => {
    const extractImportInfo = (xmlString: string): ImportInfo => {
        const parser = new DOMParser();
        const serializer = new XMLSerializer();
        const parsed = parser.parseFromString(xmlString, 'text/xml');
        const parent = parsed.getElementsByTagName('bpmn2:definitions')[0];
        const runboticsInfoElement = parsed.getElementsByTagName(
            'runbotics:additionalInfo'
        )[0];
        if (!runboticsInfoElement) {
            return { definition: xmlString };
        }

        const importInfo: ImportInfo = {
            definition: '',
        };

        const executionInfo = parsed.getElementsByTagName(
            'runbotics:executionInfo'
        )[0];

        if (executionInfo && executionInfo.innerHTML.trim() !== 'null') {
            importInfo.executionInfo = executionInfo?.innerHTML.trim() ?? '';
        }

        const system = parsed.getElementsByTagName('runbotics:system')[0];

        if (isValidJson(system?.innerHTML)) {
            importInfo.system = JSON.parse(system.innerHTML);
        }

        const isAttended = parsed.getElementsByTagName(
            'runbotics:isAttended'
        )[0]?.innerHTML;
        if (isAttended) {
            importInfo.isAttended = stringToBoolean(isAttended);
        }

        const isTriggerable = parsed.getElementsByTagName(
            'runbotics:isTriggerable'
        )[0]?.innerHTML;
        if (isTriggerable) {
            importInfo.isTriggerable = stringToBoolean(isTriggerable);
        }

        parent.removeChild(runboticsInfoElement);
        importInfo.definition = serializer.serializeToString(parsed);

        return importInfo;
    };

    const stringToBoolean = (isAttendedRaw: string): boolean | null => {
        const trimmed = isAttendedRaw.trim().toLowerCase();
        if (trimmed === 'true') {
            return true;
        }
        if (trimmed === 'false') {
            return false;
        }
        return null;
    };

    return {
        extractImportInfo,
    };
};

export default useProcessImport;
