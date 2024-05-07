import React from 'react';

import Clear from '@mui/icons-material/Clear';
import { TableBody, TableCell, TableHead, TableRow, IconButton, Select, MenuItem, FormControl, TableContainer, Table } from '@mui/material';

import useTranslations from '#src-app/hooks/useTranslations';

interface User {
    email: string;
    accessType: 'READ' | 'EDIT';
}

interface UsersTableProps {
    users: User[];
    onDeleteUser: (email: string) => void;
    onChangeAccessType: (email: string, accessType: 'READ' | 'EDIT') => void;
}

// const CustomTable = styled(Table)(
//     ({ theme }) => `
//     root: {

//     padding: 0;
//     }
// `
// );

const UsersTable: React.FC<UsersTableProps> = ({ users, onDeleteUser, onChangeAccessType }) => {
    const { translate } = useTranslations();

    return (
        <TableContainer sx={{ width: '100%', padding: 0 }}>
            <Table>
                <TableHead>
                    <TableRow >
                        <TableCell sx={{ width: '65%' }}>Email</TableCell>
                        <TableCell sx={{ width: '20%' }}>Access</TableCell>
                        <TableCell sx={{ width: '15%' }}></TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {users.map(user => (
                        <TableRow key={user.email}>
                            <TableCell>{user.email}</TableCell>
                            <TableCell>
                                <FormControl fullWidth>
                                    <Select
                                        variant="standard"
                                        value={user.accessType}
                                        onChange={e => onChangeAccessType(user.email, e.target.value as 'READ' | 'EDIT')}
                                    >
                                        <MenuItem value="READ">READ</MenuItem>
                                        <MenuItem value="EDIT">EDIT</MenuItem>
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
};

export default UsersTable;
