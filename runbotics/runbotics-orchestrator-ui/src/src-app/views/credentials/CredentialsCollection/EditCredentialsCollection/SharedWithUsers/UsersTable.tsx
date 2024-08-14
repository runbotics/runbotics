import React from 'react';

import Clear from '@mui/icons-material/Clear';
import { TableBody, TableCell, TableHead, TableRow, IconButton, Select, MenuItem, FormControl, TableContainer, Table } from '@mui/material';

import useTranslations from '#src-app/hooks/useTranslations';

import { SharedWithUser } from './SharedWithUsers';
import { PrivilegeType } from '../../CredentialsCollection.types';

interface UsersTableProps {
    users: SharedWithUser[];
    onDeleteUser: (email: string) => void;
    onChangeAccessType: ({ login, privilegeType }: SharedWithUser) => void;
}

const UsersTable: React.FC<UsersTableProps> = ({ users, onDeleteUser, onChangeAccessType }) => {
    const { translate } = useTranslations();

    return (
        <TableContainer sx={{ width: '100%', padding: 0 }}>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell sx={{ width: '65%' }}>Email</TableCell>
                        <TableCell sx={{ width: '20%' }}>Access</TableCell>
                        <TableCell sx={{ width: '15%' }}></TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {users.map(user => (
                        <TableRow key={user.login}>
                            <TableCell>{user.login}</TableCell>
                            <TableCell>
                                <FormControl fullWidth>
                                    <Select
                                        // TODO for the mvp purposes there is only write access atm
                                        disabled={true}
                                        variant="standard"
                                        defaultValue={PrivilegeType.WRITE}
                                        // end to TODO
                                        value={user.privilegeType}
                                        onChange={e =>
                                            onChangeAccessType({ login: user.login, privilegeType: e.target.value as PrivilegeType })
                                        }
                                    >
                                        <MenuItem value={PrivilegeType.READ}>{PrivilegeType.READ}</MenuItem>
                                        <MenuItem value={PrivilegeType.WRITE}>{PrivilegeType.WRITE}</MenuItem>
                                    </Select>
                                </FormControl>
                            </TableCell>
                            <TableCell align="right">
                                <IconButton color="secondary" onClick={() => onDeleteUser(user.login)}>
                                    <Clear />
                                </IconButton>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
};

export default UsersTable;
