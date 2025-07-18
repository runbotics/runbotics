import React, { Dispatch, FunctionComponent, SetStateAction, useState } from 'react';

import { Card, Grid } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { FeatureKey } from 'runbotics-common';

import If from '#src-app/components/utils/If';

import useFeatureKey from '#src-app/hooks/useFeatureKey';
import useGlobalVariableSearch from '#src-app/hooks/useGlobalVariableSearch';
import { useSelector } from '#src-app/store';
import { globalVariableSelector } from '#src-app/store/slices/GlobalVariable';
import { IGlobalVariable } from '#src-app/types/model/global-variable.model';


import DeleteGlobalVariableDialog from './DeleteGlobalVariableDialog';
import useGlobalVariablesColumns from './useGlobalVariablesColumns';
import { VariableDetailState } from '../../Variable.types';

interface TableProps {
    className?: string;
    setVariableDetailState: Dispatch<SetStateAction<VariableDetailState>>;
    searchValue?: string;
}

export interface DeleteDialogState {
    open: boolean;
    globalVariable?: IGlobalVariable;
}

const initialDeleteDialogState: DeleteDialogState = {
    open: false,
};

const Table: FunctionComponent<TableProps> = ({ className, setVariableDetailState }) => {
    const { globalVariables, loading } = useSelector(globalVariableSelector);
    const [deleteDialogState, setDeleteDialogState] = useState<DeleteDialogState>(initialDeleteDialogState);
    const hasDeleteVariableAccess = useFeatureKey([FeatureKey.GLOBAL_VARIABLE_DELETE]);
    const hasEditVariableAccess = useFeatureKey([FeatureKey.GLOBAL_VARIABLE_EDIT]);

    const [page, setPage] = useState(0);
    const [pageSize, setPageSize] = useState(10);

    const onEdit = (variable: IGlobalVariable) => {
        setVariableDetailState({ show: true, variable });
    };

    const onDelete = (globalVariable: IGlobalVariable) => {
        setDeleteDialogState({ open: true, globalVariable });
    };

    const onReadOnlyView = (variable: IGlobalVariable) => {
        setVariableDetailState({ show: true, variable, readOnly: true });
    };

    const globalVariablesColumns = useGlobalVariablesColumns({
        onDelete,
        onEdit,
        hasDeleteVariableAccess,
        hasEditVariableAccess,
        globalVariables
    });

    useGlobalVariableSearch(pageSize, page);

    const handlePageChange = (newPage: number) => {
        setPage(newPage);
    };

    const handlePageSizeChange = (newPageSize: number) => {
        setPageSize(newPageSize);
        setPage(0);
    };

    return (
        <div>
            <Card className={className}>
                <Grid container>
                    <Grid item xs={12} md={12}>
                        <DataGrid
                            loading={loading}
                            rows={globalVariables?.content ?? []}
                            columns={globalVariablesColumns}
                            autoHeight
                            disableSelectionOnClick
                            paginationMode='server'
                            page={page}
                            onPageChange={handlePageChange}
                            pageSize={pageSize}
                            onPageSizeChange={handlePageSizeChange}
                            rowsPerPageOptions={[5, 10, 20, 50]}
                            rowCount={globalVariables?.totalElements ?? 0}
                            onCellClick={(param) => {
                                if (param.field !== 'actions') onReadOnlyView(param.row as IGlobalVariable);
                            }}
                        />
                    </Grid>
                </Grid>
            </Card>
            <If condition={hasDeleteVariableAccess}>
                <DeleteGlobalVariableDialog
                    deleteDialogState={deleteDialogState}
                    onClose={() => setDeleteDialogState({ open: false })}
                />
            </If>
        </div>
    );
};

export default Table;
