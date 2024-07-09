import { TableRow, TableCell, Button, Typography } from '@mui/material';

import { Box } from '@mui/system';

import useTranslations from '#src-app/hooks/useTranslations';

import { ProcessInstanceRow } from '../../HistoryTable/HistoryTable.types';
import { COLUMNS_NUMBER } from '../../HistoryTable/HistoryTable.utils';
import { LoadMoreProps } from '../Table.types';
import { SUBPROCESSES_PAGE_SIZE, TABLE_ROW_HEIGHT } from '../Table.utils';

export const LoadMore = ({ row, pageNum, size, getSubprocessesPage, columnsNum }: LoadMoreProps) => {
    const subprocessesToLoad = row.original?.subprocessesCount - (row as ProcessInstanceRow)?.subRows?.length;
    const { translate } = useTranslations();

    return (
        <TableRow>
            <TableCell colSpan={columnsNum ?? COLUMNS_NUMBER} sx={{ height: `${TABLE_ROW_HEIGHT}px` }}>
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%', flexDirection: 'column' }}>
                    <Button
                        onClick={() => getSubprocessesPage({ currRow: row, pageNum, size })}
                        color='primary'
                        size='small'
                    >
                        {translate('Component.HistoryTable.Special.LoadMore', { pageSize: SUBPROCESSES_PAGE_SIZE, count: subprocessesToLoad })}
                    </Button>
                    <Typography variant='caption' sx={{ marginLeft: '0.5rem' }}>
                        {translate('Component.HistoryTable.Special.LoadMore.Subtitle', { processName: row.original?.process?.name })}
                    </Typography>
                </Box>
            </TableCell>
        </TableRow>
    );
};
