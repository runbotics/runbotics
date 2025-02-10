import { ActionReducerMapBuilder } from '@reduxjs/toolkit';


import { IBpmnAction, Runner } from '#src-app/Actions/types';
import LoadingType from '#src-app/types/loading';
import { defaultValue } from '#src-app/types/model/action.model';
import objFromArray from '#src-app/utils/objFromArray';

import { ActionState } from './Action.state';
import { getAllActions, setShowEditModal } from './Action.thunks';

const buildActionExtraReducers = (
    builder: ActionReducerMapBuilder<ActionState>
) => {
    builder
        .addCase(getAllActions.pending, (state) => {
            state.actions.loading = true;
        })
        .addCase(getAllActions.fulfilled, (state, action) => {
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
                            credentialType: actionValue.credentialType,
                            runner: Runner.DESKTOP_SCRIPT,
                            form: JSON.parse(actionValue.form),
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
        .addCase(getAllActions.rejected, (state) => {
            state.actions.loading = false;
        })
        .addCase(setShowEditModal.fulfilled, (state, { payload }) => {
            state.draft.loading = LoadingType.IDLE;
            state.draft.action = payload.action
                ? payload.action
                : { ...defaultValue };
            state.showEditModal = payload.show;
        });
};

export default buildActionExtraReducers;
