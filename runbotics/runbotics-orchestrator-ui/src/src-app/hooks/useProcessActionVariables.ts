import { useMemo } from 'react';

import { addScope, getParentScope, getParentScopesActionVars } from '#src-app/utils/variableScopes';
import {
    ExtensionElement,
    ModdleElement,
} from '#src-app/views/process/ProcessBuildView/Modeler/helpers/elementParameters';

import { useModelerContext } from './useModelerContext';
import {
    ActionVariableObject,
    ActionVariables,
    ScopedModdleElement,
} from './useProcessVariables.types';


const useProcessActionVariables = (selectedElementParentId?: string) => {
    const context = useModelerContext();
    const canvas = context?.modeler?.get('canvas');
    const rootElement = canvas?.getRootElement();
    const rootElementScopeId = rootElement?.businessObject?.id;
    const processScopes = ({ id: rootElementScopeId });

    const getLocalVarsActions = (element: ModdleElement[]): ModdleElement[] => element ? element.filter(
        (item: ModdleElement) =>
            item.id.includes('Activity_')
    ) : [];

    const getLocalVarsAssigningActions = (elements: ModdleElement[], scopeId: string): ModdleElement[] => {
        const varsElements = elements.filter(
            element => 
                (element.actionId === 'variables.assign' ||
                element.actionId === 'variables.assignList')
        );
        
        const scopedVarsElements = varsElements.map(
            element => ({ ...element, scopeId })
        );

        return scopedVarsElements;
    };

    const getLocalLoops = (elements: ModdleElement[]): ModdleElement[] => 
        elements
            .filter(
                element => element.actionId === 'loop.loop'
            );

    const getVarsAssigningActions = (elements: ModdleElement[], scopeId: string): ModdleElement[] => {
        if (!elements) return [];
        
        const scopeLoops = getLocalLoops(elements);

        const localActionsWithoutLoops = getLocalVarsAssigningActions(elements, scopeId)
            .filter(element => element.actionId !== 'loop.loop');
        
        if (scopeLoops.length <= 0) return localActionsWithoutLoops;

        const scopeLoopsActions = scopeLoops
            .map(scopeLoop => {
                const loopScopeId = scopeLoop.id;

                addScope(processScopes, scopeId, loopScopeId);

                if (scopeLoop?.flowElements?.length <= 0) return [];
            
                const loopScopeActions = getVarsAssigningActions(scopeLoop.flowElements, loopScopeId);

                return loopScopeActions;
            })
            .flat();

        return [...localActionsWithoutLoops, ...scopeLoopsActions];
    };

    const allLocalVarsActions = useMemo(() => getLocalVarsActions(
        rootElement?.businessObject?.flowElements
    ), [rootElement]);

    const allVarsAssigningActions = getVarsAssigningActions(allLocalVarsActions, rootElementScopeId);

    const allVarsActions = useMemo<ActionVariables>((): ActionVariables => {
        if (!allLocalVarsActions || !canvas) {
            return { inputActionVariables: [], outputActionVariables: [] };
        }

        /**
         * @name inputActionVariables
         * @name outputActionVariables
         * @description Variables used by actions:
         * Variables -> Assign value to variable
         * Variables -> Assign list variable
         */

        const inputActionVars = allVarsAssigningActions
            .map((variable: ScopedModdleElement) => {
                const variableInfo: ExtensionElement[] =
                    variable.extensionElements.values[0].inputParameters;

                if (!variableInfo) {
                    return [];
                }

                const inputVariables = variableInfo
                    .filter(
                        (item: ActionVariableObject) => item.name === 'variable'
                    )
                    .map((item: ActionVariableObject) => ({
                        name: item.value,
                        value: item.name,
                        scopeId: variable.scopeId
                    }));

                return inputVariables;
            })
            .flatMap((variable: ActionVariableObject[]) =>
                variable[0].name ? variable : []
            );

        const outputActionVars = allVarsAssigningActions
            .map((element: ModdleElement) => {
                const variableInfo: ExtensionElement[] =
                    element.extensionElements.values[0].outputParameters;

                if (!variableInfo) {
                    return [];
                }

                const outputVariables = variableInfo
                    .filter(
                        (item: ActionVariableObject) =>
                            item.name === 'variableName'
                    )
                    .map((item: ActionVariableObject) => ({
                        name: item.value,
                        value: item.name,
                    }));

                return outputVariables;
            })
            .filter((item: ActionVariableObject[]) => item.length > 0)
            .flat();

        if(!selectedElementParentId) return { inputActionVariables: inputActionVars, outputActionVariables: outputActionVars };
            
        const parentScopes = getParentScope(processScopes, selectedElementParentId);

        if(!Array.isArray(parentScopes)) return { inputActionVariables: [], outputActionVariables: [] };

        const localInputActionVars = getParentScopesActionVars(parentScopes, inputActionVars);

        return { inputActionVariables: localInputActionVars, outputActionVariables: outputActionVars };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [allLocalVarsActions, allVarsAssigningActions, canvas, selectedElementParentId]);
    
    return allVarsActions;
};

export default useProcessActionVariables;
