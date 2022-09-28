import React, { useReducer } from 'react';

export type GroupState = Record<string, boolean>;
export type GroupAction =
    | { type: 'openAll' }
    | { type: 'closeAll' }
    | { type: 'updateGroup'; label: string; open: boolean };

export const groupActions = {
    closeAll: () => ({ type: 'closeAll' } as GroupAction),
    openAll: () => ({ type: 'openAll' } as GroupAction),
    updateGroup: (label: string, open: boolean) => ({ type: 'updateGroup', label, open } as GroupAction),
};

const groupReducer: React.Reducer<GroupState, GroupAction> = (state, action) => {
    switch (action.type) {
        case 'openAll':
            for (const label of Object.keys(state)) {
                state[label] = true;
            }
            break;
        case 'closeAll':
            for (const label of Object.keys(state)) {
                state[label] = false;
            }
            break;
        case 'updateGroup':
            state[action.label] = action.open;
            break;
    }
    console.log('update');

    return state;
};

const useGroupReducer = (initialState: GroupState) => {
    return useReducer(groupReducer, initialState);
};

export default useGroupReducer;
