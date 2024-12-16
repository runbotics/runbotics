import React from 'react';

import Clear from '@mui/icons-material/Clear';
import { TableBody, TableCell, TableHead, TableRow, IconButton, Select, MenuItem, FormControl, TableContainer, Table } from '@mui/material';


import { PrivilegeType } from 'runbotics-common';

import { SharedWithUser } from './SharedWithUsers';

interface UsersTableProps {
    users: SharedWithUser[];
    onDeleteUser: (email: string) => void;
    onChangeAccessType: ({ email, privilegeType }: SharedWithUser) => void;
}

const UsersTable: React.FC<UsersTableProps> = ({ users, onDeleteUser, onChangeAccessType }) => (
    <TableContainer sx={{ width: '100%', padding: 0 }}>
        <Table>
            <TableHead>
                <TableRow>
                    <TableCell sx={{ width: '60%' }}>Email</TableCell>
                    <TableCell sx={{ width: '25%' }}>Access</TableCell>
                    <TableCell sx={{ width: '15%' }}></TableCell>
                </TableRow>
            </TableHead>
            <TableBody>
                {users?.sort((a, b) => a.email.localeCompare(b.email)).map(user => (
                    <TableRow key={user.email}>
                        <TableCell>{user.email}</TableCell>
                        <TableCell>
                            <FormControl fullWidth>
                                <Select
                                    variant="standard"
                                    defaultValue={PrivilegeType.WRITE}
                                    value={user.privilegeType}
                                    onChange={e =>
                                        onChangeAccessType({ email: user.email, privilegeType: e.target.value as PrivilegeType })
                                    }
                                >
                                    <MenuItem value={PrivilegeType.READ}>{PrivilegeType.READ}</MenuItem>
                                    <MenuItem value={PrivilegeType.WRITE}>{PrivilegeType.WRITE}</MenuItem>
                                </Select>
                            </FormControl>
                        </TableCell>
                        <TableCell align="right">
                            <IconButton color="secondary" onClick={() => onDeleteUser(user.email)}>
                                <Clear />
                            </IconButton>
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    </TableContainer>
);

export default UsersTable;
