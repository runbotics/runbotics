import { MenuItem } from '@mui/material';
import {
    GridColDef,
    GridValidRowModel,
    GridValueFormatterParams,
} from '@mui/x-data-grid';

import { DEFAULT_TENANT_ID } from 'runbotics-common';

import useTranslations from '#src-app/hooks/useTranslations';
import { useSelector } from '#src-app/store';
import { authSelector } from '#src-app/store/slices/Auth';
import { tenantsSelector } from '#src-app/store/slices/Tenants';
import { formatDate } from '#src-app/utils/dateFormat';

import { getAllowedRoles } from '#src-app/utils/getAllowedRoles';

import { StyledSelect } from './UsersRegistrationTable.styles';
import {
    UserField,
    formatUserRoles,
} from '../../UsersBrowseView/UsersBrowseView.utils';

const useUsersRegistrationColumns = (
    handleSelectRoleChange,
    handleSelectTenantChange,
    isForAdmin: boolean
): GridColDef[] => {
    const { translate } = useTranslations();
    const user = useSelector(authSelector);
    const roles = getAllowedRoles(user);
    const formattedRoles = formatUserRoles(roles);
    const { all: allTenants } = useSelector(tenantsSelector);

    const RoleSelect = (row: GridValidRowModel) => {
        const filteredRoles = formattedRoles.filter((role) => {
            if (row.tenant.id !== DEFAULT_TENANT_ID) {
                return role !== 'USER' && role !== 'ADMIN';
            }
            return true;
        });
        return (
            <StyledSelect
                fullWidth
                required
                defaultValue=""
                onChange={(e) => handleSelectRoleChange(row.id, e.target.value)}
                variant="filled"
            >
                {filteredRoles.map((role) => (
                    <MenuItem key={role} value={`ROLE_${role}`}>
                        {role}
                    </MenuItem>
                ))}
            </StyledSelect>
        );
    };

    const TenantSelect = (row: GridValidRowModel) => (
        <StyledSelect
            fullWidth
            required
            defaultValue={row.tenant.id}
            onChange={(e) => handleSelectTenantChange(row.id, e.target.value)}
            variant="filled"
        >
            {allTenants.map((tenant) => (
                <MenuItem key={tenant.name} value={tenant.id}>
                    {tenant.name}
                </MenuItem>
            ))}
        </StyledSelect>
    );

    return [
        {
            field: UserField.EMAIL,
            headerName: translate('Users.Registration.Table.Columns.Email'),
            filterable: false,
            flex: 0.6,
        },
        {
            field: UserField.TENANT,
            headerName: translate('Users.Registration.Table.Columns.Tenant'),
            filterable: false,
            flex: 0.5,
            renderCell: ({ row }) => TenantSelect(row),
        },
        {
            field: UserField.CREATED_DATE,
            headerName: translate(
                'Users.Registration.Table.Columns.CreateDate'
            ),
            filterable: false,
            flex: 0.3,
            valueFormatter: (params: GridValueFormatterParams) =>
                formatDate(params.value),
        },
        {
            field: UserField.ROLE,
            headerName: translate('Users.Registration.Table.Columns.Role'),
            flex: 0.5,
            sortable: false,
            filterable: false,
            renderCell: ({ row }) => RoleSelect(row),
        },
    ];
};

export default useUsersRegistrationColumns;
