import React, { Dispatch, FunctionComponent, SetStateAction, useEffect, useState } from 'react';

import { Card, Grid } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { useRouter } from 'next/router';
import { FeatureKey } from 'runbotics-common';

import If from '#src-app/components/utils/If';

import useFeatureKey from '#src-app/hooks/useFeatureKey';
import { useReplaceQueryParams } from '#src-app/hooks/useReplaceQueryParams';
import { useDispatch, useSelector } from '#src-app/store';
import { globalVariableActions, globalVariableSelector } from '#src-app/store/slices/GlobalVariable';
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
    searchValue?: string;
}

const initialDeleteDialogState: DeleteDialogState = {
    open: false,
};

const Table: FunctionComponent<TableProps> = ({ className, setVariableDetailState, searchValue }) => {
    const dispatch = useDispatch();
    const { globalVariables, loading } = useSelector(globalVariableSelector);
    const [deleteDialogState, setDeleteDialogState] = useState<DeleteDialogState>(initialDeleteDialogState);
    const hasDeleteVariableAccess = useFeatureKey([FeatureKey.GLOBAL_VARIABLE_DELETE]);
    const hasEditVariableAccess = useFeatureKey([FeatureKey.GLOBAL_VARIABLE_EDIT]);

    const [page, setPage] = useState(0);
    const [pageSize, setPageSize] = useState(10);
    const [search, setSearch] = useState<string | undefined>(searchValue);
    const [isInitializedFromQuery, setIsInitializedFromQuery] = useState(false);

    const replaceQueryParams = useReplaceQueryParams();
    const router = useRouter();

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

    useEffect(() => {
        const queryPage = parseInt(router.query.page as string) || 0;
        const queryPageSize = parseInt(router.query.pageSize as string) || 10;
        const querySearch = router.query.name as string || '';

        setPage(queryPage);
        setPageSize(queryPageSize);
        setSearch(querySearch);

        dispatch(globalVariableActions.getGlobalVariables({
            pageParams: { page: queryPage, size: queryPageSize, 'name.contains': querySearch }
        }));

        setIsInitializedFromQuery(true);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        dispatch(globalVariableActions.getGlobalVariables({ pageParams: { page, size: pageSize, 'name.contains': search } }));
        replaceQueryParams({
            page,
            pageSize,
            search,
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [dispatch, page, pageSize, search, isInitializedFromQuery]);

    const handlePageChange = (newPage: number) => {
        setPage(newPage);
    };

    const handlePageSizeChange = (newPageSize: number) => {
        setPageSize(newPageSize);
        setPage(0);
    };

    useEffect(() => {
        setSearch(searchValue);
    }, [searchValue]);

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
                            sortingMode='server'
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
