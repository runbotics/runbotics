import { MenuItem } from '@mui/material';
import { GridColDef, GridValidRowModel, GridValueFormatterParams } from '@mui/x-data-grid';

import useTranslations from '#src-app/hooks/useTranslations';
import { formatDate } from '#src-app/utils/dateFormat';

import { StyledSelect } from './UsersRegisterTable.styles';
import { UserField, getAllUserRoles, formatUserRole } from './UsersRegisterTable.utils';

const useUsersRegisterColumns = (handleSelectChange): GridColDef[] => {
    const { translate } = useTranslations();
    const roles = getAllUserRoles();

    const RoleSelect = (row: GridValidRowModel) => (
        <StyledSelect
            fullWidth
            required
            defaultValue=''
            onChange={(e) => handleSelectChange(row.id, e.target.value)}
            variant='filled'
        >
            {roles.map((role) =>
                <MenuItem key={role} value={role}>{formatUserRole(role)}</MenuItem>
            )}
        </StyledSelect>
    );

    return [
        {
            field: UserField.EMAIL,
            headerName: translate('Users.Register.Table.Columns.Email'),
            filterable: false,
            flex: 0.6
        },
        {
            field: UserField.CREATED_DATE,
            headerName: translate('Users.Register.Table.Columns.CreateDate'),
            filterable: false,
            flex: 0.3,
            valueFormatter: (params: GridValueFormatterParams) => formatDate(params.value)
        },
        {
            field: UserField.ROLE,
            headerName: translate('Users.Register.Table.Columns.Role'),
            flex: 0.5,
            sortable: false,
            filterable: false,
            renderCell: ({ row }) => RoleSelect(row)
        },
    ];
};

export default useUsersRegisterColumns;
