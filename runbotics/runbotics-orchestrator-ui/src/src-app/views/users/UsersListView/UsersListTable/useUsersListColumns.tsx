import { GridColDef, GridValidRowModel, GridValueFormatterParams } from '@mui/x-data-grid';
import { Tenant } from 'runbotics-common';

import useTranslations from '#src-app/hooks/useTranslations';
import { formatDate } from '#src-app/utils/dateFormat';

import { StyledCell } from './UsersListTable.styles';
import { UserField, formatUserRoles } from '../../UsersBrowseView/UsersBrowseView.utils';

const useUsersListColumns = (): GridColDef[] => {
    const { translate } = useTranslations();

    const RoleField = (row: GridValidRowModel) => {
        const roles = formatUserRoles(row.roles).join(', ');
        return <StyledCell title={roles}>{roles}</StyledCell>;
    };

    return [
        {
            field: UserField.EMAIL,
            headerName: translate('Users.List.Table.Columns.Email'),
            filterable: false,
            flex: 0.6
        },
        {
            field: UserField.TENANT,
            headerName: translate('Users.List.Table.Columns.Tenant'),
            filterable: false,
            flex: 0.5,
            valueFormatter: (params: GridValueFormatterParams<Tenant>) => params.value?.name
        },
        {
            field: UserField.ROLE,
            headerName: translate('Users.List.Table.Columns.Roles'),
            filterable: false,
            flex: 0.4,
            renderCell: ({ row }) => RoleField(row)
        },
        {
            field: UserField.CREATED_BY,
            headerName: translate('Users.List.Table.Columns.CreatedBy'),
            filterable: false,
            flex: 0.3
        },
        {
            field: UserField.CREATED_DATE,
            headerName: translate('Users.List.Table.Columns.CreatedDate'),
            filterable: false,
            flex: 0.3,
            valueFormatter: (params: GridValueFormatterParams) => formatDate(params.value)
        },
        {
            field: UserField.LAST_MODIFIED_BY,
            headerName: translate('Users.List.Table.Columns.LastModifiedBy'),
            filterable: false,
            flex: 0.3
        },
        {
            field: UserField.LAST_MODIFIED_DATE,
            headerName: translate('Users.List.Table.Columns.LastModifiedDate'),
            filterable: false,
            flex: 0.3,
            valueFormatter: (params: GridValueFormatterParams) => formatDate(params.value)
        }
    ];
};

export default useUsersListColumns;
