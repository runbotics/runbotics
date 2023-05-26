import { ActionVariableObject, Scope } from '#src-app/hooks/useProcessVariables.types';

export const addScope = (mainObj: Scope, localScopeId: string, newScopeId: string): void => {
    if (mainObj.id === localScopeId) {
        if (!mainObj.children) mainObj.children = [];

        mainObj.children.push({ id: newScopeId });
        
        return;
    }
    
    if (!mainObj.children) return;
    
    for (let i = 0; i < mainObj.children.length; i++) {
        addScope(
            mainObj.children[i],
            localScopeId,
            newScopeId
        );
    }
};

export const getAncestorScope = (scopeObj: Scope, scopeId: string): string[] | number => {
    if (scopeObj.id === scopeId) return [scopeObj.id];

    if (!scopeObj.children) return -1;
        
    const childrenScopes = scopeObj.children
        .map(child => getAncestorScope(child, scopeId))
        .filter(child => child !== -1);

    if (childrenScopes.length === 0) return -1;

    return [scopeObj.id, ...childrenScopes.flat() as string[]];
};

export const getAncestorScopesActions = (scopeIds: string[], allActions: ActionVariableObject[]): ActionVariableObject[] =>
    scopeIds
        .map(
            scopeId => allActions.filter(
                action => action.scopeId === scopeId
            )
        )
        .flat();
