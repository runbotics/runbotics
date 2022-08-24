import React, { useState } from 'react';
import styled from 'styled-components';
import type { FC } from 'react';
import clsx from 'clsx';
import {
    Card, Grid, IconButton,
} from '@mui/material';
import {
    DataGrid,
    GridCellParams,
    GridColDef,
} from '@mui/x-data-grid';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { FeatureKey } from 'runbotics-common';
import { useDispatch, useSelector } from 'src/store';
import { IAction } from 'src/types/model/action.model';
import { setShowEditModal } from 'src/store/slices/Action/Action.thunks';
import useTranslations from 'src/hooks/useTranslations';
import If from 'src/components/utils/If';
import useFeatureKey from 'src/hooks/useFeatureKey';
import DeleteActionDialog from '../DeleteActionDialog';

const PREFIX = 'Results';

const classes = {
    root: `${PREFIX}-root`,
};

const StyledCard = styled(Card)(() => ({
    [`&.${classes.root}`]: {},
}));

const Actions: FC<{ params: GridCellParams }> = (props) => {
    const [showDelete, setShowDelete] = useState(false);
    const dispatch = useDispatch();
    const action: IAction = props.params.row as IAction;
    const hasEditActionAccess = useFeatureKey([FeatureKey.EXTERNAL_ACTION_EDIT]);
    const hasDeleteActionAccess = useFeatureKey([FeatureKey.EXTERNAL_ACTION_DELETE]);

    return (
        <>
            <If condition={hasEditActionAccess}>
                <IconButton
                    onClick={() => {
                        dispatch(setShowEditModal({ show: true, action: { ...action } }));
                    }}
                >
                    <EditIcon fontSize="small" />
                </IconButton>
            </If>
            <If condition={hasDeleteActionAccess}>
                <DeleteActionDialog
                    action={action}
                    open={showDelete}
                    onDelete={() => setShowDelete(false)}
                    onClose={() => setShowDelete(false)}
                />
                <IconButton onClick={() => setShowDelete(true)}>
                    <DeleteIcon fontSize="small" />
                </IconButton>
            </If>
        </>
    );
};

interface ResultsProps {
    className?: string;
}

const Results: FC<ResultsProps> = ({ className, ...rest }) => {
    const { translate } = useTranslations();

    const columns: GridColDef[] = [
        {
            field: 'id',
            headerName: translate('Action.List.Results.Id'),
            flex: 0.3,
        },
        {
            field: 'label',
            headerName: translate('Action.List.Results.Label'),
            flex: 0.3,
        },
        {
            field: 'script',
            headerName: translate('Action.List.Results.Script'),
            flex: 0.3,
        },
        {
            field: 'actions',
            headerName: translate('Action.List.Results.Actions'),
            width: 200,
            renderCell: (params: GridCellParams) => <Actions params={params} />,
        },
    ];

    const actions = useSelector((state) => state.action.actions);

    return (
        <StyledCard className={clsx(classes.root, className)} {...rest}>
            <Grid container>
                <Grid item xs={12} md={12}>
                    <DataGrid
                        loading={actions.loading}
                        getRowId={(row) => row.id}
                        autoHeight
                        rows={Object.values(actions.byId)}
                        columns={columns}
                    />
                </Grid>
            </Grid>
        </StyledCard>
    );
};

export default Results;
