import { ActionVariableObject, Scope } from '#src-app/hooks/useProcessVariables.types';

export const addScope = (scopeTree: Scope, localScopeId: string, newScopeId: string): void => {
    if (scopeTree.id === localScopeId) { 
        scopeTree.children ? scopeTree.children.push({ id: newScopeId }) : scopeTree.children = [{ id: newScopeId }];
        return;
    }

    if (!scopeTree.children) return;

    scopeTree.children.forEach(
        child => addScope(child, localScopeId, newScopeId)
    );
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
