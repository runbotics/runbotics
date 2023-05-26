import { useMemo } from 'react';

import { addScope, getAncestorScope, getAncestorScopesActions } from '#src-app/utils/variableScopes';
import {
    ExtensionElement,
    ModdleElement,
} from '#src-app/views/process/ProcessBuildView/Modeler/helpers/elementParameters';

import { useModelerContext } from './useModelerContext';
import {
    ActionVariableObject,
    ActionVariables,
    Scope,
    ScopedModdleElement,
} from './useProcessVariables.types';


const useProcessActionVariables = (selectedElementParentId?: string) => {
    const context = useModelerContext();
    const canvas = context?.modeler?.get('canvas');
    const rootElement = canvas?.getRootElement();
    const rootElementScopeId = rootElement?.businessObject?.id;
    const ProcessScopes: Scope = useMemo<Scope>(() => ({ id: rootElementScopeId }), [rootElementScopeId]);

    const getLocalVarsActions = (element: ModdleElement[]): ModdleElement[] => element ? element.filter(
        (item: ModdleElement) =>
            item.id.includes('Activity_')
    ) : [];

    const getLocalVarsAsigningsActions = (elements: ModdleElement[], scopeId: string): ModdleElement[] => {
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

        const localActionsWithoutLoops = getLocalVarsAsigningsActions(elements, scopeId)
            .filter(element => element.actionId !== 'loop.loop');
        
        if (scopeLoops.length <= 0) return localActionsWithoutLoops;

        const scopeLoopsActions = scopeLoops.map(scopeLoop => {
            const loopScopeId = scopeLoop.id;

            addScope(ProcessScopes, scopeId, loopScopeId);

            if (scopeLoop.flowElements.length <= 0) return [];
            
            const loopScopeActions = getVarsAssigningActions(scopeLoop.flowElements, loopScopeId);

            return loopScopeActions;
        });

        const scopeLoopsActionsFlat = scopeLoopsActions.flat();

        return [...localActionsWithoutLoops, ...scopeLoopsActionsFlat];
    };

    const allActionsWithVariables = useMemo(() => getLocalVarsActions(
        rootElement?.businessObject?.flowElements
    ), [rootElement]);

    const allActionsAssigningVars = getVarsAssigningActions(allActionsWithVariables, rootElementScopeId);

    const allActionVariables = useMemo<ActionVariables>((): ActionVariables => {
        if (!allActionsWithVariables || !canvas) {
            return { inputActionVariables: [], outputActionVariables: [] };
        }

        /**
         * @name inputActionVariables
         * @name outputActionVariables
         * @description Variables used by actions:
         * Variables -> Assign value to variable
         * Variables -> Assign list variable
         */

        const inputActionVariables = allActionsAssigningVars
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

        const outputActionVariables = allActionsAssigningVars
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

        if(!selectedElementParentId) return { inputActionVariables, outputActionVariables };
            
        const ancestorScopes = getAncestorScope(ProcessScopes, selectedElementParentId);

        if(!Array.isArray(ancestorScopes)) return { inputActionVariables: [], outputActionVariables: [] };

        const localScopeInputActionVariables = getAncestorScopesActions(ancestorScopes, inputActionVariables);

        return { inputActionVariables: localScopeInputActionVariables, outputActionVariables };
    }, [allActionsWithVariables, allActionsAssigningVars, canvas, selectedElementParentId, ProcessScopes]);
    
    return allActionVariables;
};

export default useProcessActionVariables;
