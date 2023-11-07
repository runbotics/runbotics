import React, { VFC } from 'react';

import { Card, Grid } from '@mui/material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';

import styled from 'styled-components';

import useTranslations from '#src-app/hooks/useTranslations';

import { ROWS_PER_PAGE } from './NotificationTableComponent.utils';


const StyledWrapper = styled.div`
    display: flex;
    padding: 1.5rem;
    padding-left: 0;
    width: 100%;
`;

interface NotificationTableProps {
    page?: number;
    onPageChange?: (page: number) => void;
    pageSize?: number;
    onPageSizeChange?: (pageSize: number) => void;
    notificationTableColumns: GridColDef[];
    subscribersList: any;
}

const NotificationTableComponent: VFC<NotificationTableProps> = ({
    notificationTableColumns,
    subscribersList,
    page,
    onPageChange,
    pageSize,
    onPageSizeChange,
}) => {
    const { translate } = useTranslations();

    return (
        <StyledWrapper>
            <DataGrid
                autoHeight
                columns={notificationTableColumns}
                rows={subscribersList ?? []}
                rowCount={subscribersList.length ?? 0}
                loading={false}
                disableSelectionOnClick
                localeText={{
                    noRowsLabel: translate('Process.Edit.Table.Results.Error')
                }}
            />
        </StyledWrapper>
    );
};

export default NotificationTableComponent;
