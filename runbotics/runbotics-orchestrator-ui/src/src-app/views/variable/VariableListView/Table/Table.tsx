import React, { Dispatch, FunctionComponent, SetStateAction, useEffect, useState } from 'react';

import { Card, Grid } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { FeatureKey } from 'runbotics-common';

import If from '#src-app/components/utils/If';

import useFeatureKey from '#src-app/hooks/useFeatureKey';
import { useDispatch, useSelector } from '#src-app/store';
import { globalVariableActions, globalVariableSelector } from '#src-app/store/slices/GlobalVariable';
import { IGlobalVariable } from '#src-app/types/model/global-variable.model';

import DeleteGlobalVariableDialog from './DeleteGlobalVariableDialog';
import useGlobalVariablesColumns from './useGlobalVariablesColumns';
import { VariableDetailState } from '../../Variable.types';

interface TableProps {
    className?: string;
    setVariableDetailState: Dispatch<SetStateAction<VariableDetailState>>;
}

export interface DeleteDialogState {
    open: boolean;
    globalVariable?: IGlobalVariable;
}

const initialDeleteDialogState: DeleteDialogState = {
    open: false,
};

const Table: FunctionComponent<TableProps> = ({ className, setVariableDetailState }) => {
    const dispatch = useDispatch();
    const { globalVariables, loading } = useSelector(globalVariableSelector);
    const [deleteDialogState, setDeleteDialogState] = useState<DeleteDialogState>(initialDeleteDialogState);
    const hasDeleteVariableAccess = useFeatureKey([FeatureKey.GLOBAL_VARIABLE_DELETE]);
    const hasEditVariableAccess = useFeatureKey([FeatureKey.GLOBAL_VARIABLE_EDIT]);

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
        globalVariables,
    });

    useEffect(() => {
        dispatch(globalVariableActions.getGlobalVariables());
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <div>
            <Card className={className}>
                <Grid container>
                    <Grid item xs={12} md={12}>
                        <DataGrid
                            loading={loading}
                            rows={globalVariables}
                            columns={globalVariablesColumns}
                            autoHeight
                            disableSelectionOnClick
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
