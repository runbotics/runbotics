import { useMemo } from 'react';

import { getParentScopes, getParentScopesActionVars, getUpdatedScopeTree, mergeTrees } from '#src-app/utils/variableScopes';
import {
    ExtensionElement,
    ModdleElement,
} from '#src-app/views/process/ProcessBuildView/Modeler/helpers/elementParameters';

import { useModelerContext } from './useModelerContext';
import {
    ActionVariableObject,
    ActionVariables,
    ActionsAssignedVars,
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

    const extractElementsMatchingScope = (elements: ModdleElement[], scopeId: string): CategorizedElements => {
        const localVarsAssigningActions = [];
        const localLoops = [];

        elements.forEach(
            element => {
                if (element.actionId === 'loop.loop') {
                    localLoops.push({ ...element, scopeId: element.actionId });
                    return;
                }
                localVarsAssigningActions.push({ ...element, scopeId });
            }
        );

        return { localVarsAssigningActions, localLoops };
    };

    const getVarsAssigningActions = (
        elements: ModdleElement[],
        scopeId: string,
        currScopeTree: Scope
    ): ActionsAssignedVars => {
        if (!elements) return ({ varsAssigningActions: [], updatedScopeTree: currScopeTree });

        const { localVarsAssigningActions, localLoops } = extractElementsMatchingScope(elements, scopeId);

        if (localLoops.length <= 0) {
            return ({
                varsAssigningActions: localVarsAssigningActions,
                updatedScopeTree: currScopeTree
            });
        };

        const scopeLoopsActions = [];

        const updatedScopeTree = localLoops
            .map(
                scopeLoop => {
                    const loopScopeId = scopeLoop.id;

                    if (scopeLoop?.flowElements?.length <= 0) {
                        return getUpdatedScopeTree(
                            currScopeTree,
                            scopeId,
                            loopScopeId
                        );
                    }

                    const {
                        varsAssigningActions,
                        updatedScopeTree: tempUpdatedScopeTree
                    } = getVarsAssigningActions(
                        scopeLoop.flowElements,
                        loopScopeId,
                        getUpdatedScopeTree(currScopeTree, scopeId, loopScopeId)
                    );

                    scopeLoopsActions.push(...varsAssigningActions);

                    return tempUpdatedScopeTree;
                })
            .reduce(
                (acc: Scope, curr: Scope) =>
                    mergeTrees(acc, curr) as Scope
            );

        return ({
            varsAssigningActions: [...localVarsAssigningActions, ...scopeLoopsActions, ...localLoops],
            updatedScopeTree
        });
    };

    const allLocalVarsActions = useMemo(() => getLocalVarsActions(
        rootElement?.businessObject?.flowElements
    ), [rootElement]);


    const allVarsActions = useMemo<ActionVariables>((): ActionVariables => {
        const { varsAssigningActions: allVarsAssigningActions, updatedScopeTree } =
            getVarsAssigningActions(
                allLocalVarsActions,
                rootElementScopeId,
                { id: rootElementScopeId }
            );


        if (!allLocalVarsActions || !canvas) {
            return { inputActionVariables: [], outputActionVariables: [], loopVariables: [], allActionVariables: [] };
        }

        /**
         * @name inputActionVariables
         * @description Variables assigned by actions:
         * - Variables > Assign value to variable
         * - Variables > Assign list variable
         */

        const inputActionVars = allVarsAssigningActions
            .map((variable: ScopedModdleElement) => {
                const variableInfo: ExtensionElement[] =
                    variable.extensionElements?.values[0].inputParameters;

                if (!variableInfo) {
                    return [];
                }

                const inputVariables = variableInfo
                    .filter(
                        (item: ExtensionElement) => item.name === 'variable' || item.name === 'elementVariable'
                    )
                    .map((item: ExtensionElement) => ({
                        name: item.value,
                        value: item.name,
                        scopeId: variable.scopeId,
                        actionId: variable.id
                    }));

                return inputVariables;
            })
            .flatMap((variable: ActionVariableObject[]) =>
                variable[0]?.name ? variable : []
            );

        /**
         * @name outputActionVariables
         * @description Variables assigned (in "Output" field) for example by actions:
         * - JavaScript > TypeScript
         * - API > API Request
         * - Browser > Count
         */

        const outputActionVars = allVarsAssigningActions
            .map((element: ScopedModdleElement) => {
                const variableInfo: ExtensionElement[] =
                    element.extensionElements?.values[0].outputParameters;

                if (!variableInfo) {
                    return [];
                }

                const outputVariables = variableInfo
                    .filter(
                        (item: ExtensionElement) =>
                            item.name === 'variableName'
                    )
                    .map((item: ExtensionElement) => ({
                        name: item.value,
                        value: item.name,
                        scopeId: element.scopeId,
                        actionId: element.id
                    }));

                return outputVariables;
            })
            .filter((item: ActionVariableObject[]) => item.length > 0)
            .flat();

        const allActionVariables = [...inputActionVars, ...outputActionVars];

        if(!selectedElementParentId) return { inputActionVariables: inputActionVars, outputActionVariables: outputActionVars, loopVariables: [], allActionVariables };

        const loopIds = allVarsAssigningActions
            .filter((element: ScopedModdleElement) => element.actionId === 'loop.loop')
            .map((element: ScopedModdleElement) => element.id);

        const loopIterator = loopIds.includes(selectedElementParentId) ? [{ name: 'iterator', value: 'variable' }] : [];

        const parentScopes = getParentScopes(updatedScopeTree, selectedElementParentId);
        if(!Array.isArray(parentScopes)) return { inputActionVariables: [], outputActionVariables: [], loopVariables: [], allActionVariables: [] };

        const localInputActionVars = getParentScopesActionVars(parentScopes, inputActionVars);
        const localOutputActionVars = getParentScopesActionVars(parentScopes, outputActionVars);

        return {
            inputActionVariables: localInputActionVars,
            outputActionVariables: localOutputActionVars,
            loopVariables: loopIterator,
            allActionVariables,
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [allLocalVarsActions, canvas, selectedElementParentId]);

    return allVarsActions;
};

export default useProcessActionVariables;
