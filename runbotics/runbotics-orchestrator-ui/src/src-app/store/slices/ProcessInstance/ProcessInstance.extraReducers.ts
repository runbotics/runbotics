import { ActionReducerMapBuilder } from '@reduxjs/toolkit';
import union from 'lodash/union';


import objFromArray from '#src-app/utils/objFromArray';

import { ProcessInstanceState } from './ProcessInstance.state';
import {
    getAll,
    getAllByProcessId,
    getBotProcessInstances,
    getProcessInstance,
    getSubprocesses,
    getProcessInstancePage,
    getProcessInstanceAndUpdatePage,
    getProcessInstancePageWithSpecificInstance,
} from './ProcessInstance.thunks';
import { updateProcessInstanceProps } from './ProcessInstance.utils';

const buildProcessInstanceExtraReducers = (builder: ActionReducerMapBuilder<ProcessInstanceState>) => {
    builder
        // GET all
        .addCase(getAll.pending, (state) => {
            state.all.loading = true;
        })
        .addCase(getAll.fulfilled, (state, action) => {
            state.all.byId = objFromArray(action.payload);
            state.all.ids = Object.keys(state.all.byId);
            state.all.loading = false;
        })
        .addCase(getAll.rejected, (state) => {
            state.all.loading = false;
        })

        // GET all by process id
        .addCase(getAllByProcessId.pending, (state) => {
            state.all.loading = true;
        })
        .addCase(getAllByProcessId.fulfilled, (state, action) => {
            state.all.byProcessId[action.meta.arg.processId] = action.payload;
            state.all.loading = false;
        })
        .addCase(getAllByProcessId.rejected, (state) => {
            state.all.loading = false;
        })

        // GET bot process instances
        .addCase(getBotProcessInstances.pending, (state) => {
            state.all.loading = true;
        })
        .addCase(getBotProcessInstances.fulfilled, (state, action) => {
            state.all.byId = objFromArray(action.payload);
            state.all.ids = Object.keys(state.all.byId);
            state.all.loading = false;
        })
        .addCase(getBotProcessInstances.rejected, (state) => {
            state.all.loading = false;
        })

        // GET
        .addCase(getProcessInstance.pending, (state) => {
            state.all.loading = true;
        })
        .addCase(getProcessInstance.fulfilled, (state, action) => {
            if (action.payload) {
                state.all.byId[action.payload.id] = action.payload;
                state.all.ids = union(state.all.ids, [String(action.payload.id)]);
            }
            state.all.loading = false;
        })
        .addCase(getProcessInstance.rejected, (state) => {
            state.all.loading = false;
        })

        .addCase(getProcessInstanceAndUpdatePage.fulfilled, (state, action) => {
            state.all.byId[action.payload.id] = action.payload;
            state.all.ids = union(state.all.ids, [String(action.payload.id)]);
            const pageContent = state.all.page?.content;
            if (pageContent && pageContent.find((processInstance) => processInstance.id === action.payload.id)) {
                state.all.page.content = pageContent.map((processInstance) =>
                    processInstance.id === action.payload.id ? action.payload : processInstance,
                );
            }

        })

        // GET sub processes
        .addCase(getSubprocesses.pending, (state, action) => {
            updateProcessInstanceProps(
                state, 
                { 
                    id: action.meta.arg.processInstanceId, 
                    isLoadingSubprocesses: true,
                }
            );
        })
        .addCase(getSubprocesses.fulfilled, (state, action) => {
            updateProcessInstanceProps(
                state, 
                { 
                    id: action.meta.arg.processInstanceId, 
                    isLoadingSubprocesses: false, 
                    subprocesses: action.payload 
                }
            );
        })
        .addCase(getSubprocesses.rejected, (state, action) => {
            updateProcessInstanceProps(
                state, 
                { 
                    id: action.meta.arg.processInstanceId, 
                    isLoadingSubprocesses: false, 
                    hasSubprocesses: false 
                }
            );
        })

        // GET page
        .addCase(getProcessInstancePage.pending, (state) => {
            state.all.loadingPage = true;
        })
        .addCase(getProcessInstancePage.fulfilled, (state, action) => {
            state.all.page = action.payload;
            state.all.loadingPage = false;
        })
        .addCase(getProcessInstancePage.rejected, (state) => {
            state.all.loadingPage = false;
        })

        .addCase(getProcessInstancePageWithSpecificInstance.pending, (state) => {
            state.all.loadingPage = true;
        })
        .addCase(getProcessInstancePageWithSpecificInstance.fulfilled, (state, action) => {
            state.all.page = action.payload;
            state.all.loadingPage = false;
        })
        .addCase(getProcessInstancePageWithSpecificInstance.rejected, (state) => {
            state.all.loadingPage = false;
        });
};

export default buildProcessInstanceExtraReducers;
