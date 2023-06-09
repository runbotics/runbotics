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
    // Condition ending the recursion - check if the current node is the parent of the new scope - otherwise continue traversing the tree
    if (scopeTree.id === localScopeId) {
        // Add the new scope as a child of the current node
        const updatedChildren = scopeTree.children 
            ? [...scopeTree.children, { id: newScopeId }] 
            : [{ id: newScopeId }];

        return { ...scopeTree, children: updatedChildren };
    }

    // If the current node doesn't have children end the branch of the recursion
    if (!scopeTree.children) return scopeTree;
  
    // Recursively update the children of the current node (traverse the tree)
    const updatedChildren = scopeTree.children
        .map(
            child => getUpdatedScopeTree(child, localScopeId, newScopeId)
        );
    
    return { ...scopeTree, children: updatedChildren };
};

/**
 * Takes two (identical to some depth level) scopeTrees and merges them into one.
 * Recursively traverses the trees until the nodes doesn't match, then returns merged children.
 *
 * @param {Scope} treeOne - The first scope tree to merge.
 * @param {Scope} treeTwo - The second scope tree to merge.
 * @returns {Scope | Scope[]} - The merged scope tree for the first function call OR an array of trees on deeper levels of recursion.
 */
export const mergeTrees = (treeOne: Scope, treeTwo: Scope): Scope | Scope[]  => {
    if(treeOne.id !== treeTwo.id) return [treeOne, treeTwo];
    return ({
        id: treeOne.id,
        children: [
            ...new Set(
                treeOne.children
                    .map(
                        childOne => treeTwo.children
                            .map(
                                childTwo => mergeTrees(childOne, childTwo)
                            )
                            .flat()
                    )
                    .flat()
            )
        ]
    });
};

/**
 * Gets ID of all scopes surrounding (superior to) the one given as parameter.
 *
 * @param {Scope} scopeTree - The scope tree to search within.
 * @param {string} scopeId - The ID of the scope for which to find the parent scopes.
 * @returns {string[] | number} - An array of scope IDs representing the path to the parent scope, or -1 if the scope ID is not found.
 */
export const getParentsScope = (scopeTree: Scope, scopeId: string): string[] | number => {
    if (scopeTree.id === scopeId) return [scopeTree.id];

    if (!scopeTree.children) return -1;
        
    const childrenScopes = scopeTree.children
        .map(
            child => getParentsScope(child, scopeId)
        )
        .filter(
            child => child !== -1
        );

    if (childrenScopes.length === 0) return -1;

    return [scopeTree.id, ...childrenScopes.flat() as string[]];
};

/**
 * From all provided variables filters all that exist in the given scopes.
 *
 * @param {string[]} scopeIds - An array of scope IDs.
 * @param {ActionVariableObject[]} allActions - An array of action variables.
 * @returns {ActionVariableObject[]} - An array of action variables assigned inside of the given scopes.
 */
export const getParentScopesActionVars = (scopeIds: string[], allActions: ActionVariableObject[]): ActionVariableObject[] =>
    scopeIds
        .map(
            scopeId => allActions.filter(
                action => action.scopeId === scopeId
            )
        )
        .flat();
