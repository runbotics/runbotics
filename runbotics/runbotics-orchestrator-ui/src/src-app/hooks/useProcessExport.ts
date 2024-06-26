import { IProcess } from 'runbotics-common';

const useProcessExport = () => {
    const formatAdditionalInfo = (process: IProcess) => `
      <runbotics:additionalInfo>
          <runbotics:isTriggerable>
            ${process.isTriggerable}
          </runbotics:isTriggerable>
          <runbotics:system>
            ${JSON.stringify(process.system)}
          </runbotics:system>
          <runbotics:attendedForm>
            <runbotics:isAttended>
              ${process.isAttended}
            </runbotics:isAttended>
            <runbotics:executionInfo>
                ${process.executionInfo}
            </runbotics:executionInfo>
          </runbotics:attendedForm>
      </runbotics:additionalInfo>\n`;

    const createRbexFile = (definition: string, process: IProcess) => {
        const definitionEnd = definition.indexOf('</bpmn2:definitions>');
        return (
            definition.substring(0, definitionEnd) +
            formatAdditionalInfo(process) +
            definition.substring(definitionEnd)
        );
    };
    return { createRbexFile };
};

export default useProcessExport;
