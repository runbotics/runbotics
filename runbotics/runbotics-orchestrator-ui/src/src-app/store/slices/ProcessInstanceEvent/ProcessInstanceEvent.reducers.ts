import { initialState } from './ProcessInstanceEvent.slice';
import { ProcessInstanceEventState } from './ProcessInstanceEvent.state';

export const resetAll = (state: ProcessInstanceEventState) => {
    state.all = initialState.all;
};
