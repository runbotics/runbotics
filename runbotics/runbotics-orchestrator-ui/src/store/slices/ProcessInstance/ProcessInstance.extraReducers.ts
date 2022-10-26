import { ActionReducerMapBuilder } from '@reduxjs/toolkit';
import union from 'lodash/union';
import objFromArray from 'src/utils/objFromArray';
import {
    getAll,
    getAllByProcessId,
    getBotProcessInstances,
    getProcessInstance,
    getProcessInstancePage,
    getProcessInstanceAndUpdatePage,
} from './ProcessInstance.thunks';
import { ProcessInstanceState } from './ProcessInstance.state';

const buildProcessInstanceExtraReducers = (builder: ActionReducerMapBuilder<ProcessInstanceState>) => {
    builder
        // GET ALL
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

        // GET ALL BY PROCESS
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

        // GET BOT PROCESS INSTANCES
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
            if (pageContent && pageContent.find((processInstance) => processInstance.id === action.payload.id)) 
                state.all.page.content = pageContent.map((processInstance) =>
                    processInstance.id === action.payload.id ? action.payload : processInstance,
                );
            
        })

        // GET PAGE
        .addCase(getProcessInstancePage.pending, (state) => {
            state.all.loadingPage = true;
        })
        .addCase(getProcessInstancePage.fulfilled, (state, action) => {
            state.all.page = action.payload;
            state.all.loadingPage = false;
        })
        .addCase(getProcessInstancePage.rejected, (state) => {
            state.all.loadingPage = false;
        });
};

export default buildProcessInstanceExtraReducers;
