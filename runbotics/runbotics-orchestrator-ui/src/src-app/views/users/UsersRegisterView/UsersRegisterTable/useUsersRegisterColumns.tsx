import { Select, MenuItem } from '@mui/material';
import { GridColDef } from '@mui/x-data-grid';

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
            flex: 0.3
        },
        {
            field: 'role',
            headerName: 'Role',
            flex: 0.5,
            renderCell: () => {
                return (
                    <Select fullWidth>
                        <MenuItem value='User'>User</MenuItem>
                        <MenuItem value='Admin'>Admin</MenuItem>
                    </Select>
                );
            },
        },
        {
            field: 'action',
            headerName: 'Action',
            flex: 0.6,
            renderCell: () => {
                return (
                    <>
                        <StyledButton
                            variant='contained'
                            color='primary'
                        >
                            Accept
                        </StyledButton>
                        <StyledButton 
                            variant='outlined'
                            color='primary'
                        >
                            Deny
                        </StyledButton>
                    </>
                );
            },
        }
    ];
};

export default useUsersRegisterColumns;
