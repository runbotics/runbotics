import { Select, MenuItem } from '@mui/material';
import { GridColDef, GridValueFormatterParams } from '@mui/x-data-grid';
import moment from 'moment';

import useTranslations from '#src-app/hooks/useTranslations';

import { StyledButton } from './UsersRegisterTable.styles';

const useUsersRegisterColumns = (): GridColDef[] => {
    const { translate } = useTranslations();

    return [
        {
            field: 'login',
            headerName: 'Login',
            flex: 0.6
        },
        {
            field: 'createdDate',
            headerName: 'Create date',
            flex: 0.3,
            valueFormatter: (params: GridValueFormatterParams) =>
                moment(params.value as string).format('YYYY-MM-DD HH:mm')
        },
        {
            field: 'role',
            headerName: 'Role',
            flex: 0.5,
            renderCell: () => (
                <Select
                    fullWidth
                    required
                >
                    <MenuItem value='user'>User</MenuItem>
                    <MenuItem value='admin'>Admin</MenuItem>
                </Select>
            )
        },
        {
            field: 'action',
            headerName: 'Action',
            flex: 0.6,
            renderCell: () => (
                <>
                    <StyledButton
                        type='submit'
                        variant='contained'
                        color='primary'
                    >
                        Accept
                    </StyledButton>
                    <StyledButton
                        type='submit'
                        variant='outlined'
                        color='primary'
                    >
                        Deny
                    </StyledButton>
                </>
            )
        }
    ];
};

export default useUsersRegisterColumns;
