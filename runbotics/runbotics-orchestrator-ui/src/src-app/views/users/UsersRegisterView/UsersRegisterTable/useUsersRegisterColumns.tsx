import { Select, MenuItem } from '@mui/material';
import { GridColDef, GridValueFormatterParams } from '@mui/x-data-grid';
import moment from 'moment';

import useTranslations from '#src-app/hooks/useTranslations';

import { getKeysFromRoleEnum, formatUserRole } from '../UsersRegisterTable.utils';

const useUsersRegisterColumns = (handleSelectChange): GridColDef[] => {
    const { translate } = useTranslations();
    const roles = getKeysFromRoleEnum();

    return [
        {
            field: 'email',
            headerName: translate('Users.Register.Table.Columns.Email'),
            filterable: false,
            flex: 0.6
        },
        {
            field: 'createdDate',
            headerName: translate('Users.Register.Table.Columns.CreateDate'),
            filterable: false,
            flex: 0.3,
            valueFormatter: (params: GridValueFormatterParams) =>
                moment(params.value as string).format('YYYY-MM-DD HH:mm')
        },
        {
            field: 'role',
            headerName: translate('Users.Register.Table.Columns.Role'),
            flex: 0.5,
            sortable: false,
            filterable: false,
            renderCell: ({ row }) => (
                <Select
                    fullWidth
                    required
                    defaultValue=''
                    onChange={(e) => handleSelectChange(row.id, e.target.value)}
                >
                    {roles.map((role) =>
                        <MenuItem key={role} value={role}>{formatUserRole(role)}</MenuItem>
                    )}
                </Select>
            )
        },
    ];
};

export default useUsersRegisterColumns;
