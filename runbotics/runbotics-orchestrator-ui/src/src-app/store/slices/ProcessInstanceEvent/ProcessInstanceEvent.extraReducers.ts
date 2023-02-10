import { ActionReducerMapBuilder } from '@reduxjs/toolkit';

import { sortByFinished } from '#src-app/components/InfoPanel/ProcessInstanceEventsDetails/ProcessInstanceEventsDetails.utils';


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
            };
            state.all.eventsBreadcrumbTrail = [];
        })
        .addCase(getProcessInstanceEvents.fulfilled, (state, action) => {
            state.all.events = action.payload;
            state.all.eventsBreadcrumbTrail = [{id: 'root', labelKey: 'Root', type: EventMapTypes.ProcessInstanceEvent}];
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
            const eventMap = action.payload.slice().sort(sortByFinished).reduce((acc, item) => {
                const newIteration =
                    acc.length === 0 ||
                    acc[acc.length - 1].iterationNumber !==
                        item.iterationNumber;
                if (newIteration) {
                    const iterationStarted = new Date(item.created);
                    iterationStarted.setMilliseconds(iterationStarted.getMilliseconds() - 1).toString(); 
                    acc.push({
                        iterationNumber: item.iterationNumber,
                        type: EventMapTypes.Iteration,
                        created: iterationStarted.toISOString(),
                    });
                }
                acc.push({
                    ...item,
                    type: EventMapTypes.ProcessInstanceLoopEvent,
                });

                return acc;
            }, []);

            if (action.meta.arg.nestedIteration) {
                breadcrumbTrail.push({
                    id: `${action.meta.arg.loopId}_${action.meta.arg.nestedIteration}`,
                    labelKey: 'Iteration',
                    type: EventMapTypes.Iteration,
                    iterationNumber: action.meta.arg.nestedIteration,
                });
            }

            state.all = {
                ...state.all,
                loading: false,
                eventsBreadcrumbTrail: [
                    ...breadcrumbTrail,
                    {
                        id: action.meta.arg.loopId,
                        labelKey: action.meta.arg.loopLabel,
                        type: EventMapTypes.ProcessInstanceLoopEvent,
                    }
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
