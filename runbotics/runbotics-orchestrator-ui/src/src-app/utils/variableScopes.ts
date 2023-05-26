import { Scope } from '#src-app/hooks/useProcessAttendedVariables.types';

export const addScope = (mainObj: Scope, localScopeId: string, newScopeId: string): void => {
    if (mainObj.id === localScopeId) {
        if (!mainObj.children) {
            mainObj.children = [];
        }
        mainObj.children.push({ id: newScopeId });
        return;
    }
    
    if (mainObj.children) {
        for (let i = 0; i < mainObj.children.length; i++) {
            addScope(mainObj.children[i], localScopeId, newScopeId);
        }
    }
};

export const getAncestorScope = (scopeObj, scopeId): string[] | number => {
    if (scopeObj.id === scopeId) return scopeObj.id;
    if (!scopeObj.children) return -1;
        
    const childrenScopes = scopeObj.children.map(child => getAncestorScope(child, scopeId)).filter(child => child !== -1);
        
    if (childrenScopes.length === 0) return -1;

    const flattenedChildrenScopes = childrenScopes.flat();
        
    return [scopeObj.id, ...flattenedChildrenScopes];
};

export const getAncestorScopesActions = (scopeIds, allActions) => 
    scopeIds.map(
        scopeId => allActions.filter(
            action => action.scopeId === scopeId
        )
    )
        .flat();
