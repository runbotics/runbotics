import { ActionReducerMapBuilder } from '@reduxjs/toolkit';

import {
    EventMapTypes,
    ProcessInstanceEventState,
} from './ProcessInstanceEvent.state';
import {
    getProcessInstanceEvents,
    getProcessInstanceLoopEvents,
} from './ProcessInstanceEvent.thunks';

const buildProcessInstanceEventExtraReducers = (
    builder: ActionReducerMapBuilder<ProcessInstanceEventState>
) => {
    builder
        // GET
        .addCase(getProcessInstanceEvents.pending, (state) => {
            state.all.loading = true;
            state.all.events = [];
            state.all.nestedEvents = {
                eventMap: {},
                idNameMap: {},
            };
            state.all.eventsBreadcrumbTrail = [];
        })
        .addCase(getProcessInstanceEvents.fulfilled, (state, action) => {
            state.all.events = action.payload;
            state.all.eventsBreadcrumbTrail = ['Main events'];
            state.all.loading = false;
        })
        .addCase(getProcessInstanceEvents.rejected, (state) => {
            state.all.loading = false;
        })
        .addCase(getProcessInstanceLoopEvents.pending, (state) => {
            state.all.loading = true;
        })
        .addCase(getProcessInstanceLoopEvents.fulfilled, (state, action) => {
            const breadcrumbTrail = [...state.all.eventsBreadcrumbTrail];
            const eventMap = action.payload.reduce((acc, item) => {
                const newIteration =
                    acc.length === 0 ||
                    acc[acc.length - 1].iterationNumber !==
                        item.iterationNumber;
                if (newIteration) {
                    acc.push({
                        iterationNumber: item.iterationNumber,
                        type: EventMapTypes.IterationGutter,
                        created: item.created,
                    });
                }
                acc.push({
                    ...item,
                    type: EventMapTypes.ProcessInstanceLoopEvent,
                });

                return acc;
            }, []);

            if (action.meta.arg.nestedIteration) {
                breadcrumbTrail.push(
                    'Iteration ' + action.meta.arg.nestedIteration.toString()
                );
            }

            state.all = {
                ...state.all,
                loading: false,
                eventsBreadcrumbTrail: [
                    ...breadcrumbTrail,
                    action.meta.arg.loopId,
                ],
                nestedEvents: {
                    ...state.all.nestedEvents,
                    eventMap: {
                        ...state.all.nestedEvents.eventMap,
                        [action.meta.arg.loopId]: eventMap,
                    },
                    idNameMap: {
                        ...state.all.nestedEvents.idNameMap,
                        [action.meta.arg.loopId]: 'Loop',
                    },
                },
            };
        })
        .addCase(getProcessInstanceLoopEvents.rejected, (state) => {
            state.all.loading = false;
        });
};

export default buildProcessInstanceEventExtraReducers;
