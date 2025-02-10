import React from 'react';

import { Clear } from '@mui/icons-material';
import {
    IconButton,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableRow,
} from '@mui/material';

interface EmailTriggerWhitelistTableProps {
    emailTriggerWhitelist: string[];
    onDeleteWhitelistItem: (item: string) => void;
}

export const EmailTriggerWhitelistTable = ({
    emailTriggerWhitelist,
    onDeleteWhitelistItem,
}: EmailTriggerWhitelistTableProps) => (
    <TableContainer sx={{ width: '100%', padding: 0 }}>
        <Table>
            <TableBody>
                {emailTriggerWhitelist &&
                    emailTriggerWhitelist.map((item) => (
                        <TableRow key={item}>
                            <TableCell sx={{ width: '85%' }}>{item}</TableCell>
                            <TableCell sx={{ width: '15%' }} align="right">
                                <IconButton
                                    color="secondary"
                                    onClick={() => onDeleteWhitelistItem(item)}
                                >
                                    <Clear />
                                </IconButton>
                            </TableCell>
                        </TableRow>
                    ))}
            </TableBody>
        </Table>
    </TableContainer>
);
