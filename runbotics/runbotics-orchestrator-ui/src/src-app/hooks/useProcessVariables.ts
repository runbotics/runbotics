

import { is } from 'bpmn-js/lib/util/ModelUtil';

import { useSelector } from '#src-app/store';
import { globalVariableSelector } from '#src-app/store/slices/GlobalVariable';


import { currentProcessSelector } from '#src-app/store/slices/Process';




import { BPMNElement, CamundaInputOutputElement } from '#src-app/views/process/ProcessBuildView/Modeler/helpers/elementParameters';

import { useModelerContext } from './useModelerContext';

export enum VariableTag {
    Global = 'GLOBAL',
    InputOutput = 'INPUT/OUTPUT',
    ActionAssigned = 'ACTION ASSIGNED',
}

const useProcessVariables = () => {
    const { globalVariables } = useSelector(globalVariableSelector);
    const context = useModelerContext();
    const { executionInfo, isAttended } = useSelector(currentProcessSelector);
    const { passedInVariables } = useSelector((state) => state.process.modeler);
    
    const getGlobalVariablesUsedInProcess = () => {
        const assignVariablesElements =
                context?.modeler
                    ?.get('elementRegistry')
                    .filter((element: BPMNElement) => is(element, 'bpmn:Task'))
                    .filter(
                        (element: BPMNElement) =>
                            element.businessObject.actionId ===
                                'variables.assign' ||
                            element.businessObject.actionId ===
                                'variables.assignList' ||
                            element.businessObject.actionId ===
                                'variables.assignGlobalVariable'
                    ) ?? [];

        const extractGlobalVariables = (
            inputOutput: CamundaInputOutputElement
        ) => {
            const globalVariableList = inputOutput.inputParameters.find(
                inputParameter => inputParameter.name === 'globalVariables'
            );
    
            if (globalVariableList) {
                return globalVariableList.definition.items.map(item => {
                    const globalVariableName = globalVariables.find(
                        variable => variable.id === Number(item.value)
                    )?.name;
    
                    if (!globalVariableName) {
                        return undefined;
                    }
    
                    return {
                        name: globalVariableName,
                        tag: VariableTag.Global,
                    };
                });
            }

            return [];
        };

        const variables = assignVariablesElements
            .map(assignVariablesElement => {
                // console.log('assignVariablesElement', assignVariablesElement);
                const inputOutput: CamundaInputOutputElement =
                        assignVariablesElement.businessObject?.extensionElements
                            ?.values[0] as CamundaInputOutputElement;

                // console.log('inputOutput', inputOutput);
                if (!inputOutput) {
                    return undefined;
                }

                return (
                    extractGlobalVariables(inputOutput)
                );
            });
            
        return [...(variables[0] ?? []), ...(variables[1] ?? [])];
    };


    const taggedGlobalVariables = getGlobalVariablesUsedInProcess();  
    
    
    const getActionVariables = () => {
        const canvas = context?.modeler?.get('canvas');
        const rootElement = canvas.getRootElement();
        const assignValueActions = rootElement.businessObject.flowElements.filter(item => item.actionId === 'variables.assign');
        // const proba = rootElement.children.filter(item => item.type === 'bpmn:ServiceTask' && item.businessObject.actionId === 'variables.assign');
        // console.log(assignValueActions);

        const processVariables = assignValueActions.map(element => {
            const variableInfo = element.extensionElements.values[0].inputParameters;

            const assignedVariables = variableInfo.filter(item => item.name === 'variable');
          
            return assignedVariables;
        }); 

        console.log(processVariables);
           

        const taggedAssignedVariables = processVariables.map(variable => ({
            name: variable[0].value,
            tag: VariableTag.ActionAssigned
        }));

        console.log(...taggedAssignedVariables);


        // const processVariables = getProcessVariables(
        //     rootElement.businessObject
        // );
        
        // const processScopeVariables = getVariablesForScope('Process_1', 
        //     rootElement.businessObject
        // );
            
        // console.log('process variables', processVariables);
        return [...taggedAssignedVariables];
    };

    const taggedActionVariables = getActionVariables();
            
    // const taggedGlobalVariables = globalVariablesInProcess.length > 0
    //     ? globalVariablesInProcess.map((item) => ({
    //         name: `#{${item.name}}`,
    //         tag: VariableTag.Global,
    //     }))
    //     : [];



    // const taggedGlobalVariables = globalVariablesInProcess;
    // const taggedGlobalVariables = globalVariablesInProcess.length === 0 ? [] :
    //     globalVariablesInProcess.map((item) => ({
    //         name: `#{${item.name}}`,
    //         tag: VariableTag.Global,
    //     }));
            


    const taggedAttendedVariables =
        isAttended && executionInfo
            ? passedInVariables.map((variable) => ({
                name: `#{${variable}}`,
                tag: VariableTag.InputOutput,
            }))
            : [];

    return {
        taggedGlobalVariables,
        taggedActionVariables,
        taggedAttendedVariables,
    };
};

export default useProcessVariables;
