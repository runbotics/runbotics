import { MenuItem } from '@mui/material';
import { GridColDef, GridValidRowModel, GridValueFormatterParams } from '@mui/x-data-grid';

import useTranslations from '#src-app/hooks/useTranslations';
import { formatDate } from '#src-app/utils/dateFormat';

import { UserField, getAllUserRoles, formatUserRoles } from '../../UsersBrowseView/UsersBrowseView.utils';
import { StyledSelect } from './UsersRegistrationTable.styles';

const useUsersRegistrationColumns = (handleSelectChange): GridColDef[] => {
    const { translate } = useTranslations();
    const roles = getAllUserRoles();
    const formattedRoles = formatUserRoles(roles);

    const RoleSelect = (row: GridValidRowModel) => (
        <StyledSelect
            fullWidth
            required
            defaultValue=''
            onChange={(e) => handleSelectChange(row.id, e.target.value)}
            variant='filled'
        >
            {formattedRoles.map((role) =>
                <MenuItem key={role} value={role}>{role}</MenuItem>
            )}
        </StyledSelect>
    );

    return [
        {
            field: UserField.EMAIL,
            headerName: translate('Users.Registration.Table.Columns.Email'),
            filterable: false,
            flex: 0.6
        },
        {
            field: UserField.CREATED_DATE,
            headerName: translate('Users.Registration.Table.Columns.CreateDate'),
            filterable: false,
            flex: 0.3,
            valueFormatter: (params: GridValueFormatterParams) => formatDate(params.value)
        },
        {
            field: UserField.ROLE,
            headerName: translate('Users.Registration.Table.Columns.Role'),
            flex: 0.5,
            sortable: false,
            filterable: false,
            renderCell: ({ row }) => RoleSelect(row)
        },
    ];
};

export default useUsersRegistrationColumns;
