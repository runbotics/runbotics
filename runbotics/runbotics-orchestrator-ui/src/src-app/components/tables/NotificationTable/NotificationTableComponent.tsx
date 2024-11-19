import React, { ChangeEvent, VFC, useMemo, useState } from 'react';

import CloseIcon from '@mui/icons-material/Close';
import { Grid, IconButton, Typography } from '@mui/material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { Role } from 'runbotics-common';

import useRole from '#src-app/hooks/useRole';
import useTranslations from '#src-app/hooks/useTranslations';

import { StyledActionsContainer, StyledTextField } from '#src-app/views/users/UsersListView/UsersListView.styles';

import { DEFAULT_TABLE_PAGING_VALUES } from '#src-app/views/utils/TablePaging.provider';

import { StyledHeaderWrapper, StyledWrapper } from './NotificationTableComponent.styles';
import { BotNotificationRow, ProcessNotificationRow } from './NotificationTableComponent.types';
import { SubscribersTableFields } from './NotificationTableComponent.utils';


interface NotificationTableProps {
    notificationTableColumns: GridColDef[];
    subscribersList: (BotNotificationRow | ProcessNotificationRow)[];
    loading?: boolean;
    onClose: () => void;
}

const NotificationTableComponent: VFC<NotificationTableProps> = ({
    notificationTableColumns,
    subscribersList,
    loading,
    onClose,
}) => {
    const { translate } = useTranslations();
    const isTenantAdmin = useRole([Role.ROLE_TENANT_ADMIN]);
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
            <StyledHeaderWrapper>
                <Grid item>
                    <Typography variant="h3" color="textPrimary">
                        {translate('Component.NotificationTable.View.Header')}
                    </Typography>
                </Grid>
                <Grid item>
                    <IconButton onClick={onClose}>
                        <CloseIcon />
                    </IconButton>
                </Grid>
            </StyledHeaderWrapper>
            <StyledActionsContainer>
                <StyledTextField
                    margin='dense'
                    placeholder={translate('Component.NotificationTable.View.SearchBarPlaceholder')}
                    size='small'
                    value={search}
                    onChange={handleSearch}
                />
            </StyledActionsContainer>
            <DataGrid
                columns={notificationTableColumns}
                columnVisibilityModel={{ [SubscribersTableFields.ACTIONS]: isTenantAdmin }}
                rows={filteredSubscribersList}
                rowCount={filteredSubscribersList.length}
                loading={loading}
                disableSelectionOnClick
                pageSize={DEFAULT_TABLE_PAGING_VALUES.pageSize}
                localeText={{
                    noRowsLabel: translate('Component.NotificationTable.Results.Error')
                }}
            />
        </StyledWrapper>
    );
};

export default NotificationTableComponent;
