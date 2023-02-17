import { ActionReducerMapBuilder } from '@reduxjs/toolkit';

import _, { uniqueId } from 'lodash';

import { IBpmnAction, Runner } from '#src-app/Actions/types';
import LoadingType from '#src-app/types/loading';
import objFromArray from '#src-app/utils/objFromArray';

import { ActionState } from './Action.state';
import { getActions, saveAction, setShowEditModal } from './Action.thunks';

const buildActionExtraReducers = (
    builder: ActionReducerMapBuilder<ActionState>
) => {
    builder
        .addCase(getActions.fulfilled, (state, action) => {
            state.actions.byId = objFromArray(action.payload, 'id');
            state.actions.allIds = Object.keys(state.actions.byId);
            state.actions.loading = false;
            const externalBpmnActions: Record<string, IBpmnAction> =
                Object.entries(state.actions.byId).reduce(
                    (prev, [key, actionValue]) => {
                        const bpmnAction: IBpmnAction = {
                            id: actionValue.id,
                            label: actionValue.label,
                            script: actionValue.script,
                            runner: Runner.DESKTOP_SCRIPT,
                            form: JSON.parse(actionValue.form)
                        };
                        if (bpmnAction.form.formData.output) {
                            bpmnAction.output = {
                                assignVariables: true,
                                outputMethods: {
                                    variableName: '${content.output[0]}'
                                }
                            };
                        }

                        const prevValue = prev;
                        prevValue[key] = bpmnAction;
                        return prevValue;
                    },
                    {}
                );
            state.bpmnActions.byId = {
                ...externalBpmnActions
            };
            state.bpmnActions.external = Object.keys(externalBpmnActions);
        })

        .addCase(getActions.pending, state => {
            state.actions.loading = true;
        })

        .addCase(saveAction.pending, (state, action) => {
            state.draft.loading = LoadingType.PENDING;
            state.draft.currentRequestId = action.meta.requestId;
        })
        .addCase(saveAction.fulfilled, state => {
            // do not update state
            // state.draft.process = payload;

            state.draft.loading = LoadingType.IDLE;
        })
        .addCase(setShowEditModal.fulfilled, (state, { payload }) => {
            state.draft.loading = LoadingType.IDLE;
            if(payload.show){
                state.draft.action = _.cloneDeep({...payload.action, shallowId: uniqueId()});
            }
            state.showEditModal = payload.show;
        })
        .addCase(saveAction.rejected, (state, action) => {
            state.draft.loading = LoadingType.IDLE;
            if (action.payload) {
                state.draft.error = action.payload;
            } else {
                state.draft.error = action.error.message;
            }
        });
};

export default buildActionExtraReducers;
