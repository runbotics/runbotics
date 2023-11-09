import React, { ChangeEvent, VFC, useMemo, useState } from 'react';

import { Grid, Typography } from '@mui/material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';

import styled from 'styled-components';

import useTranslations from '#src-app/hooks/useTranslations';
import { StyledHeaderGrid } from '#src-app/views/users/UsersBrowseView/UsersBrowseView.styles';
import { DefaultPageValue } from '#src-app/views/users/UsersBrowseView/UsersBrowseView.utils';
import { StyledActionsContainer, StyledTextField } from '#src-app/views/users/UsersListView/UsersListView.styles';

import { BotNotificationRow, ProcessNotificationRow } from './NotificationTableComponent.types';

const StyledWrapper = styled.div`
    display: flex;
    flex-direction: column;
    padding: 1rem;
    padding-left: 0;
    width: 100%;
`;

interface NotificationTableProps {
    notificationTableColumns: GridColDef[];
    subscribersList: (BotNotificationRow | ProcessNotificationRow)[];
    loading?: boolean;
}

const NotificationTableComponent: VFC<NotificationTableProps> = ({
    notificationTableColumns,
    subscribersList,
    loading,
}) => {
    const { translate } = useTranslations();
    const [search, setSearch] = useState('');

    const filteredSubscribersList = useMemo(() => subscribersList
        .filter(sub => sub.user
            .includes(search)),
    [search, subscribersList]);

    const handleSearch = (event: ChangeEvent<HTMLInputElement>) => {
        setSearch(event.target.value);
    };

    return (
        <StyledWrapper>
            <StyledHeaderGrid
                container
                spacing={3}
                marginBottom={0}
            >
                <Grid item>
                    <Typography variant="h3" color="textPrimary">
                        {translate('Process.Edit.Table.View.Header')}
                    </Typography>
                </Grid>
            </StyledHeaderGrid>
            <StyledActionsContainer>
                <StyledTextField
                    margin='dense'
                    placeholder={translate('Process.Edit.Table.View.SearchBarPlaceholder')}
                    size='small'
                    value={search}
                    onChange={handleSearch}
                />
            </StyledActionsContainer>
            <DataGrid
                autoHeight
                columns={notificationTableColumns}
                rows={filteredSubscribersList ?? []}
                rowCount={filteredSubscribersList.length ?? 0}
                loading={loading}
                disableSelectionOnClick
                pageSize={DefaultPageValue.PAGE_SIZE}
                localeText={{
                    noRowsLabel: translate('Process.Edit.Table.Results.Error')
                }}
            />
        </StyledWrapper>
    );
};

export default NotificationTableComponent;
