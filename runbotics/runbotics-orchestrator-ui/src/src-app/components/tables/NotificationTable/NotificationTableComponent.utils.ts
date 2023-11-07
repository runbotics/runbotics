import { GridColDef } from '@mui/x-data-grid';

export const ROWS_PER_PAGE = [10, 20, 30];

export enum DefaultPageValue {
    PAGE_SIZE = 10,
    PAGE = 0,
}

export enum SubscribersTableFields {
    USER = 'user',
    SUBSCRIBED_AT = 'subscribedAt',
    ACTIONS = 'actions',
};

export const notificationTableColumns: GridColDef[] = [
    {
        field: SubscribersTableFields.USER,
        headerName: 'User',
        flex: 0.3
    },
    {
        field: SubscribersTableFields.SUBSCRIBED_AT,
        headerName: 'Subscribed at',
        flex: 0.3
    },
    {
        field: SubscribersTableFields.ACTIONS,
        headerName: 'Actions',
        flex: 0.3
    }
];
