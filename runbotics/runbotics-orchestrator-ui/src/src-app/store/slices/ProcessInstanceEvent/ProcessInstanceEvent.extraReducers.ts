import { ActionReducerMapBuilder } from '@reduxjs/toolkit';

import {
    EventMapTypes,
    ProcessInstanceEventState,
} from './ProcessInstanceEvent.state';
import {
    getProcessInstanceEvents,
    getProcessInstanceLoopEvents,
} from './ProcessInstanceEvent.thunks';
import {
    divideEventsByIteration,
    shouldAddIterationBreadcrumb,
} from './ProcessInstanceEvent.utils';

const buildProcessInstanceEventExtraReducers = (
    builder: ActionReducerMapBuilder<ProcessInstanceEventState>
) => {
    builder
        // GET
        .addCase(getProcessInstanceEvents.pending, (state) => {
            state.all.loading = true;
            state.all.events = [];
            state.all.nestedEvents = {};
            state.all.eventsBreadcrumbTrail = [];
        })
        .addCase(getProcessInstanceEvents.fulfilled, (state, action) => {
            state.all.events = action.payload.content;
            state.all.eventsBreadcrumbTrail = [
                {
                    id: 'root',
                    labelKey: 'Component.InfoPanel.Root.Breadcrumb',
                    type: EventMapTypes.ProcessInstanceEvent,
                },
            ];
            state.all.loading = false;
        })
        .addCase(getProcessInstanceEvents.rejected, (state) => {
            state.all.loading = false;
        })
        .addCase(getProcessInstanceLoopEvents.pending, (state) => {
            state.all.loading = true;
        })

        .addCase(getProcessInstanceLoopEvents.fulfilled, (state, action) => {
            const eventsBreadcrumbTrail = [...state.all.eventsBreadcrumbTrail];
            const eventMap = action.payload
                .reduce(divideEventsByIteration, {});

            if (
                shouldAddIterationBreadcrumb(
                    state,
                    Boolean(action.meta.arg.nestedIteration)
                )
            ) {
                eventsBreadcrumbTrail.push({
                    id: `${action.meta.arg.loopId}_${action.meta.arg.nestedIteration}`,
                    labelKey:
                        'Process.Details.Modeler.Actions.Loop.Loop2.Iteration',
                    type: EventMapTypes.Iteration,
                    iterationNumber: action.meta.arg.nestedIteration,
                });
            }

            state.all = {
                ...state.all,
                loading: false,
                eventsBreadcrumbTrail: [
                    ...eventsBreadcrumbTrail,
                    {
                        id: action.meta.arg.loopId,
                        labelKey: action.meta.arg.loopLabel,
                        type: EventMapTypes.ProcessInstanceLoopEvent,
                    },
                ],
                nestedEvents: {
                    ...state.all.nestedEvents,
                    [action.meta.arg.loopId]: eventMap,
                },
            };
        })
        .addCase(getProcessInstanceLoopEvents.rejected, (state) => {
            state.all.loading = false;
        });
};

export default buildProcessInstanceEventExtraReducers;
