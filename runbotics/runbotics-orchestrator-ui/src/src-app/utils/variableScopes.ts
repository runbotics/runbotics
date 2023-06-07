/* 
    DOCUMENTATION: https://all41.atlassian.net/wiki/spaces/RPA/pages/2317746190/Scope+zmiennych
*/

import { ActionVariableObject, Scope } from '#src-app/hooks/useProcessVariables.types';

export const getUpdatedScopeTree = (scopeTree: Scope, localScopeId: string, newScopeId: string): Scope => {
    if (scopeTree.id === localScopeId) {
        const updatedChildren = scopeTree.children ? [...scopeTree.children, { id: newScopeId }] : [{ id: newScopeId }];
        return { ...scopeTree, children: updatedChildren };
    }
  
    if (!scopeTree.children) return scopeTree;
  
    const updatedChildren = scopeTree.children.map(child => getUpdatedScopeTree(child, localScopeId, newScopeId));
    return { ...scopeTree, children: updatedChildren };
};

export const mergeTrees = (treeOne: Scope, treeTwo: Scope): Scope | Scope[]  => 
    treeOne.id !== treeTwo.id 
        ? [treeOne, treeTwo]
        : {
            id: treeOne.id,
            children: treeOne.children
                .map(childOne => treeTwo.children
                    .map(childTwo => mergeTrees(childOne, childTwo))
                    .flat())
                .flat()
        };


export const getParentScope = (scopeTree: Scope, scopeId: string): string[] | number => {
    if (scopeTree.id === scopeId) return [scopeTree.id];

    if (!scopeTree.children) return -1;
        
    const childrenScopes = scopeTree.children
        .map(
            child => getParentScope(child, scopeId)
        )
        .filter(
            child => child !== -1
        );

    if (childrenScopes.length === 0) return -1;

    return [scopeTree.id, ...childrenScopes.flat() as string[]];
};

export const getParentScopesActionVars = (scopeIds: string[], allActions: ActionVariableObject[]): ActionVariableObject[] =>
    scopeIds
        .map(
            scopeId => allActions.filter(
                action => action.scopeId === scopeId
            )
        )
        .flat();
