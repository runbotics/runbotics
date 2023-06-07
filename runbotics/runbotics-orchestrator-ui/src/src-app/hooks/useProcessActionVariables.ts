/* 
    DOCUMENTATION: https://all41.atlassian.net/wiki/spaces/RPA/pages/2317746190/Scope+zmiennych
*/

import { useMemo } from 'react';

import { getParentScope, getParentScopesActionVars, getUpdatedScopeTree, mergeTrees } from '#src-app/utils/variableScopes';
import {
    ExtensionElement,
    ModdleElement,
} from '#src-app/views/process/ProcessBuildView/Modeler/helpers/elementParameters';

import { useModelerContext } from './useModelerContext';
import {
    ActionVariableObject,
    ActionVariables,
    CategorizedElements,
    Scope,
    ScopedModdleElement,
} from './useProcessVariables.types';

// eslint-disable-next-line max-lines-per-function
const useProcessActionVariables = (selectedElementParentId?: string) => {
    const context = useModelerContext();
    const canvas = context?.modeler?.get('canvas');
    const rootElement = canvas?.getRootElement();
    const rootElementScopeId = rootElement?.businessObject?.id;

    const getLocalVarsActions = (element: ModdleElement[]): ModdleElement[] => element ? element.filter(
        (item: ModdleElement) =>
            item.id.includes('Activity_')
    ) : [];

    const splitByScope = (elements: ModdleElement[], scopeId: string): CategorizedElements => {
        const localVarsAssigningActions = [];
        const localLoops = [];

        elements.forEach(
            element => {
                if (element.actionId === 'loop.loop') {
                    localLoops.push(element);
                    return;
                }
                if(
                    element.actionId !== 'variables.assign' &&
                    element.actionId !== 'variables.assignList'
                ) return;
                localVarsAssigningActions.push({ ...element, scopeId });
            }
        );

        return { localVarsAssigningActions, localLoops };
    };

    const scopeTree: Scope = { id: rootElementScopeId };
    
    const getVarsAssigningActions = (elements: ModdleElement[], scopeId: string, currScopeTree: Scope): { varsAssigningActions: ModdleElement[], updatedScopeTree: Scope } => {
        if (!elements) return { varsAssigningActions: [], updatedScopeTree: currScopeTree };
        
        const { localVarsAssigningActions, localLoops } = splitByScope(elements, scopeId);
        
        if (localLoops.length <= 0) return { varsAssigningActions: localVarsAssigningActions, updatedScopeTree: currScopeTree };
                
        const scopeLoopsActions = [];
        
        // eslint-disable-next-line 
        const updatedScopeTree = localLoops
            .map(scopeLoop => {
                const loopScopeId = scopeLoop.id;
                
                if (scopeLoop?.flowElements?.length <= 0) return getUpdatedScopeTree(currScopeTree, scopeId, loopScopeId);
                
                const { varsAssigningActions, updatedScopeTree: tempUpdatedScopeTree } = getVarsAssigningActions(
                    scopeLoop.flowElements,
                    loopScopeId,
                    getUpdatedScopeTree(currScopeTree, scopeId, loopScopeId)
                );
                scopeLoopsActions.push(...varsAssigningActions);
                return tempUpdatedScopeTree;
            })
            .reduce((acc: Scope, curr: Scope) => mergeTrees(acc, curr) as Scope);
            
        return { varsAssigningActions: [...localVarsAssigningActions, ...scopeLoopsActions], updatedScopeTree };
    };

    const allLocalVarsActions = useMemo(() => getLocalVarsActions(
        rootElement?.businessObject?.flowElements
    ), [rootElement]);

    
    const allVarsActions = useMemo<ActionVariables>((): ActionVariables => {
        const { varsAssigningActions: allVarsAssigningActions, updatedScopeTree } = getVarsAssigningActions(allLocalVarsActions, rootElementScopeId, scopeTree);

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
            
        const parentScopes = getParentScope(updatedScopeTree ?? scopeTree, selectedElementParentId);

        if(!Array.isArray(parentScopes)) return { inputActionVariables: [], outputActionVariables: [] };

        const localInputActionVars = getParentScopesActionVars(parentScopes, inputActionVars);

        return { inputActionVariables: localInputActionVars, outputActionVariables: outputActionVars };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [allLocalVarsActions, canvas, selectedElementParentId]);
    
    return allVarsActions;
};

export default useProcessActionVariables;
