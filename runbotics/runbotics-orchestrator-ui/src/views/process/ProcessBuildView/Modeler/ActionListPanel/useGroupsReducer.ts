import React, { useReducer } from 'react';

export type GroupState = Record<string, boolean>;
export type GroupAction =
    | { type: 'openAll' }
    | { type: 'closeAll' }
    | { type: 'updateGroup'; label: string; open: boolean };

export const groupActions = {
    closeAll: () => ({ type: 'closeAll' } as GroupAction),
    openAll: () => ({ type: 'openAll' } as GroupAction),
    updateGroup: (key: string, open: boolean) => ({ type: 'updateGroup', label: key, open } as GroupAction),
};

const mapAll = (state: GroupState, value: boolean): GroupState => {
    return Object.fromEntries(Object.keys(state).map((key) => [key, value]));
};

const groupReducer: React.Reducer<GroupState, GroupAction> = (state, action) => {
    switch (action.type) {
        case 'openAll':
            return mapAll(state, true);
        case 'closeAll':
            return mapAll(state, false);
        case 'updateGroup':
            state[action.label] = action.open;
            return { ...state, [action.label]: action.open };
    }
};

const useGroupReducer = (initialState: GroupState) => {
    return useReducer(groupReducer, initialState);
};

export default useGroupReducer;
