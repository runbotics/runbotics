import { TableRow, TableCell, Button, Divider } from '@mui/material';

import { Box } from '@mui/system';

import { useTheme } from 'styled-components';

import useTranslations from '#src-app/hooks/useTranslations';

import { ProcessInstanceRow } from '../../HistoryTable/HistoryTable.types';
import { COLUMNS_NUMBER } from '../../HistoryTable/HistoryTable.utils';
import { LoadMoreProps } from '../Table.types';
import { LOAD_MORE_SUBPROCESSES_PAGE_SIZE, SUBROW_INDENT_MULTIPLIER, TABLE_ROW_HEIGHT } from '../Table.utils';

export const LoadMore = ({ row, pageNum, size, getSubprocessesPage, columnsNum }: LoadMoreProps) => {
    const { translate } = useTranslations();
    const theme = useTheme();
    const totalSubprocesses = row.original?.subprocessesCount;
    const subprocessesToLoad = totalSubprocesses - (row as ProcessInstanceRow)?.subRows?.length;
    const rowDepthIndent = (row.depth * SUBROW_INDENT_MULTIPLIER) + 15;
    const displayLoadAll = subprocessesToLoad <= LOAD_MORE_SUBPROCESSES_PAGE_SIZE;

    return (
        <TableRow>
            <TableCell colSpan={columnsNum ?? COLUMNS_NUMBER} sx={{ height: `${TABLE_ROW_HEIGHT}px` }}>
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%'}}>
                    <Box sx={{ width: '100%',  paddingLeft: `${rowDepthIndent}px` }}>
                        <Divider sx={{ backgroundColor: theme.palette.secondary.main }} />
                    </Box>
                    <Button
                        onClick={() => getSubprocessesPage({ currRow: row, pageNum, size })}
                        color='primary'
                        size='small'
                        variant='outlined'
                        fullWidth
                    >
                        {
                            displayLoadAll
                                ? translate('Component.HistoryTable.Special.LoadAll', { total: totalSubprocesses })
                                : translate('Component.HistoryTable.Special.LoadMore', { pageSize: size, count: subprocessesToLoad })
                        }
                    </Button>
                    <Box sx={{ width: '100%', paddingRight: `${rowDepthIndent}px` }} />
                </Box>
            </TableCell>
        </TableRow>
    );
};
