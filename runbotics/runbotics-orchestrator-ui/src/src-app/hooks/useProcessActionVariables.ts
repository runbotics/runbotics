import { useMemo } from 'react';

import {
    ExtensionElement,
    ModdleElement,
} from '#src-app/views/process/ProcessBuildView/Modeler/helpers/elementParameters';

import { useModelerContext } from './useModelerContext';

import { Scope, ScopedModdleElement } from './useProcessAttendedVariables.types';
import {
    ActionVariableObject,
    ActionVariables,
} from './useProcessVariables.types';

const useProcessActionVariables = () => {
    const context = useModelerContext();
    const canvas = context?.modeler?.get('canvas');
    const rootElement = canvas?.getRootElement();
    const rootElementScopeId = rootElement?.businessObject?.id;
    const ProcessScopes: Scope = { 
        id: rootElementScopeId,
        children: []
    };

    const getLocalVarsActions = (element: ModdleElement[]): ModdleElement[] => element ? element.filter(
        (item: ModdleElement) =>
            item.id.includes('Activity_')
    ) : [];

    const filterLocalVarsActions = (elements: ModdleElement[], scopeId: string): ScopedModdleElement[] => {
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

    const getScopeLoops = (elements: ModdleElement[]): ModdleElement[] => elements
        .filter(element => element.actionId === 'loop.loop');

    const addScope = (mainObject, localScopeId, newScopeId) => {
        if (mainObject.id === localScopeId) {
            if (!mainObject.children) {
                mainObject.children = [];
            }
            mainObject.children.push({ id: newScopeId });
            return;
        }
        
        if (mainObject.children) {
            for (let i = 0; i < mainObject.children.length; i++) {
                addScope(mainObject.children[i], localScopeId, newScopeId);
            }
        }
    };

    const getActionsAssigningVars = (elements: ModdleElement[], scopeId: string): ScopedModdleElement[] => {
        if (!elements) return [];
        
        const scopeLoops = getScopeLoops(elements);

        const localActionsWithoutLoops = filterLocalVarsActions(elements, scopeId)
            .filter(element => element.actionId !== 'loop.loop');
        
        if (scopeLoops.length <= 0) return localActionsWithoutLoops;

        const scopeLoopsActions = scopeLoops.map(scopeLoop => {
            const loopScopeId = scopeLoop.id;

            addScope(ProcessScopes, scopeId, loopScopeId);

            if (scopeLoop.flowElements.length <= 0) return [];
            
            const loopScopeActions = getActionsAssigningVars(scopeLoop.flowElements, loopScopeId);

            return loopScopeActions;
        });

        const scopeLoopsActionsFlat = scopeLoopsActions.flat();

        return [...localActionsWithoutLoops, ...scopeLoopsActionsFlat];
    };

    const allActionsWithVariables: ModdleElement[] = getLocalVarsActions(
        rootElement?.businessObject?.flowElements
    );

    const allActionsAssigningVars: ModdleElement[] = getActionsAssigningVars(allActionsWithVariables, rootElementScopeId);

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

        return { inputActionVariables, outputActionVariables };
    }, [allActionsWithVariables, allActionsAssigningVars, canvas]);

    console.log('ProcessScopes', ProcessScopes);
    console.log('allActionVariables', allActionVariables);
    return allActionVariables;
};

export default useProcessActionVariables;
