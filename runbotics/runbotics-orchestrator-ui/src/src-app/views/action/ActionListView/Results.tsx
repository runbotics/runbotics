import { useState, FC } from 'react';

import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { Card, Grid, IconButton, Typography } from '@mui/material';
import { DataGrid, GridCellParams, GridColDef } from '@mui/x-data-grid';
import clsx from 'clsx';
import { FeatureKey } from 'runbotics-common';
import styled from 'styled-components';


import If from '#src-app/components/utils/If';
import useFeatureKey from '#src-app/hooks/useFeatureKey';
import useTranslations from '#src-app/hooks/useTranslations';
import { useDispatch, useSelector } from '#src-app/store';
import { setShowEditModal } from '#src-app/store/slices/Action/Action.thunks';
import { IAction } from '#src-app/types/model/action.model';

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
            field: 'label',
            headerName: translate('Action.List.Results.Label'),
            flex: 0.5,
        },
        {
            field: 'script',
            headerName: translate('Action.List.Results.Script'),
            flex: 0.5,
        },
        {
            field: 'actions',
            headerName: translate('Action.List.Results.Actions'),
            width: 100,
            renderCell: (params: GridCellParams) => <Actions params={params} />,
        },
    ];

    const actions = useSelector((state) => state.action.actions);

    return (
        <StyledCard className={clsx(classes.root, className)} {...rest}>
            <Typography>{'All actions will be available in the process build view under "External" action group'}</Typography>
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
