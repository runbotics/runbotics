import _ from 'lodash';

import { ActionVariableObject, Scope } from '#src-app/hooks/useProcessVariables.types';

/**
 * Updates the scope tree by adding a new scope (newScopeId) as a child of the desired scope (localScopeId).
 * Recursively traverses the scope tree and returns the updated scope tree.
 * The scope equals the loop and the ID of the scope equals the ID of the loop (e.g. Action_xklcjfsl).
 * @param scopeTree - The current scope tree (hierarchy of scopes in the process).
 * @param localScopeId - The ID of the scope under which the new scope should be added.
 * @param newScopeId - The ID of the new scope to be added.
 * @returns The updated scope tree.
 */
export const getUpdatedScopeTree = (scopeTree: Scope, localScopeId: string, newScopeId: string): Scope => {
    if (scopeTree.id === localScopeId) {
        const updatedChildren = scopeTree.children 
            ? [...scopeTree.children, { id: newScopeId }] 
            : [{ id: newScopeId }];

        return { ...scopeTree, children: updatedChildren };
    }

    if (!scopeTree.children) return scopeTree;
  
    const updatedChildren = _.map(
        scopeTree.children, child => getUpdatedScopeTree(child, localScopeId, newScopeId)
    );
    
    return { ...scopeTree, children: updatedChildren };
};

/**
 * Takes two (identical to some depth level) scopeTrees and merges them into one.
 * Recursively traverses the trees until the nodes doesn't match, then returns merged children.
 *
 * @param treeOne - The first scope tree to merge.
 * @param treeTwo - The second scope tree to merge.
 * @returns The merged scope tree for the first function call OR an array of trees on deeper levels of recursion.
 */

export const mergeTrees = (treeOne: Scope, treeTwo: Scope): Scope | Scope[] => {
    if (treeOne.id !== treeTwo.id) return [treeOne, treeTwo];

    const mergedChildren = _.uniqBy(
        _.flatMap(treeOne.children, childOne =>
            _.flatMap(treeTwo.children, childTwo =>
                mergeTrees(childOne, childTwo)
            )
        ),
        'id'
    );

    return {
        id: treeOne.id,
        children: mergedChildren
    };
};


/**
 * Gets ID of all scopes surrounding (superior to) the one given as parameter.
 *
 * @param scopeTree - The scope tree to search within.
 * @param scopeId - The ID of the scope for which to find the parent scopes.
 * @returns An array of scope IDs representing the path to the parent scope, or -1 if the scope ID is not found.
 */
export const getParentScopes = (scopeTree: Scope, scopeId: string): string[] | number => {
    if (scopeTree.id === scopeId) return [scopeTree.id];

    if (!scopeTree.children) return -1;
        
    const childrenScopes = scopeTree.children
        .reduce(
            (acc, child) => {
                const parentScopes = getParentScopes(child, scopeId);
                if (parentScopes !== -1) return [...acc, ...parentScopes as string[]];
                return acc;
            }, []
        );
        
    if (childrenScopes.length === 0) return -1;

    return [scopeTree.id, ...childrenScopes];
};

/**
 * From all provided variables filters all that exist in the given scopes.
 *
 * @param scopeIds - An array of scope IDs.
 * @param allActions - An array of action variables.
 * @returns An array of action variables assigned inside of the given scopes.
 */
export const getParentScopesActionVars = (scopeIds: string[], allActions: ActionVariableObject[]): ActionVariableObject[] =>
    allActions
        .filter(
            (action) => scopeIds.includes(action.scopeId) ||
                (action.scopeId === 'loop.loop' && scopeIds.includes(action.actionId))
        );
