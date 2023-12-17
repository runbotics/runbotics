import React, { ChangeEvent, VFC, useMemo, useState } from 'react';

import CloseIcon from '@mui/icons-material/Close';
import { Grid, IconButton, Typography } from '@mui/material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';

import useTranslations from '#src-app/hooks/useTranslations';
import { DefaultPageValue } from '#src-app/views/users/UsersBrowseView/UsersBrowseView.utils';
import { StyledActionsContainer, StyledTextField } from '#src-app/views/users/UsersListView/UsersListView.styles';

import { StyledHeaderWrapper, StyledWrapper } from './NotificationTableComponent.styles';
import { BotNotificationRow, ProcessNotificationRow } from './NotificationTableComponent.types';

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
                rows={filteredSubscribersList}
                rowCount={filteredSubscribersList.length}
                loading={loading}
                disableSelectionOnClick
                pageSize={DefaultPageValue.PAGE_SIZE}
                localeText={{
                    noRowsLabel: translate('Component.NotificationTable.Results.Error')
                }}
            />
        </StyledWrapper>
    );
};

export default NotificationTableComponent;
