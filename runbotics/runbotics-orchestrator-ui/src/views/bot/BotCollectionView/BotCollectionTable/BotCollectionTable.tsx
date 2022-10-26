import React, { VFC } from 'react';
import { Card, Grid } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { useSelector } from 'src/store';
import { useRouter } from 'next/router';
import { botCollectionSelector } from 'src/store/slices/BotCollections';
import useBotCollectionColumns from './useBotCollectionColumns';

interface TableProps {
    page: number;
    onPageChange: (page: number) => void;
    pageSize: number;
    onPageSizeChange: (pageSize: number) => void;
    onFilterModelChange?: (event) => void;
}

const ROWS_PER_PAGE_OPTIONS = [10, 20, 30];

const BotCollectionTable: VFC<TableProps> = ({
    page,
    pageSize,
    onPageSizeChange,
    onPageChange,
    onFilterModelChange,
}) => {
    const botCollectionColumns = useBotCollectionColumns();
    const router = useRouter();
    const { byPage, loading } = useSelector(botCollectionSelector);

    const handleRedirect = (collectionId: string) => {
        router.push(`/app/bots?collection=${collectionId}`);
    };

    return (
        <Card>
            <Grid container>
                <Grid item xs={12} md={12}>
                    <DataGrid
                        autoHeight
                        columns={botCollectionColumns}
                        rows={byPage?.content ?? []}
                        rowCount={byPage?.totalElements ?? 0}
                        disableSelectionOnClick
                        disableColumnSelector
                        rowsPerPageOptions={ROWS_PER_PAGE_OPTIONS}
                        pageSize={pageSize}
                        onPageSizeChange={(newPageSize) => onPageSizeChange(newPageSize)}
                        page={page}
                        onPageChange={(newPage) => onPageChange(newPage)}
                        paginationMode="server"
                        loading={loading}
                        filterMode="server"
                        onFilterModelChange={onFilterModelChange}
                        onCellClick={(param) => {
                            handleRedirect(param.row.id);
                        }}
                    />
                </Grid>
            </Grid>
        </Card>
    );
};

export default BotCollectionTable;
