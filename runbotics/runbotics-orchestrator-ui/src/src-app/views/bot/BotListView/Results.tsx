import React, { useEffect, useState, FC } from 'react';

import {
    Autocomplete,
    Box,
    TextField,
} from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import clsx from 'clsx';

import { useRouter } from 'next/router';

import { IBot } from 'runbotics-common';

import If from '#src-app/components/utils/If';
import useBotStatusSocket from '#src-app/hooks/useBotStatusSocket';
import useQuery from '#src-app/hooks/useQuery';
import { useReplaceQueryParams } from '#src-app/hooks/useReplaceQueryParams';
import useTranslations from '#src-app/hooks/useTranslations';
import { useDispatch, useSelector } from '#src-app/store';

import ActionBotButtonDelete from './ActionBotButton.delete';
import { BotsDataGridStyles, classes, StyledCard } from './Results.styles';
import useBotListViewColumns from './useBotListViewColumns';
import { botActions } from '../../../store/slices/Bot';
import { DefaultPageSize } from '../BotBrowseView/BotBrowseView.utils';

interface ResultsProps {
    className?: string;
    collectionId?: string;
}

const Results: FC<ResultsProps> = ({ className, collectionId, ...rest }) => {
    const router = useRouter();
    const dispatch = useDispatch();
    const { firstValueFrom } = useQuery();
    const { translate } = useTranslations();
    const replaceQueryParams = useReplaceQueryParams();
    useBotStatusSocket();

    const { page, loading: loadingBots } = useSelector((state) => state.bot.bots);
    const { botCollections, loading: loadingCollections } = useSelector((state) => state.botCollection);

    const pageFromUrl = firstValueFrom('page');
    const pageSizeFromUrl = firstValueFrom('pageSize');
    const [currentPage, setCurrentPage] = useState(pageFromUrl ? parseInt(pageFromUrl, 10) : 0);
    const [limit, setLimit] = useState(pageSizeFromUrl ? parseInt(pageSizeFromUrl, 10) : DefaultPageSize.TABLE);
    const collectionName = botCollections?.find((collection) => collection.id === collectionId)?.name;
    const [collectionFilter, setCollectionFilter] = useState<string[]>(collectionName ? [collectionName] : []);

    const [open, setOpen] = useState(false);
    const [botToDelete, setBotToDelete] = useState<IBot>(null);

    const onDelete = (bot: IBot) => {
        setOpen(true);
        setBotToDelete(bot);
    };

    const handleDialog = (state: boolean) => {
        setOpen(state);
    };

    const columns = useBotListViewColumns({ onDelete });

    const handlePageUpdate = () => {
        const params = {
            page: currentPage,
            size: limit,
            ...(collectionFilter.length && {
                filter: {
                    in: {
                        collection: collectionFilter,
                    },
                },
            }),
        };
        dispatch(botActions.getPage(params));
    };

    useEffect(() => {
        const pageNotAvailable = page && currentPage >= page.totalPages;
        if (pageNotAvailable) {
            setCurrentPage(0);
            replaceQueryParams({ page: 0, pageSize: limit });
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [page]);

    useEffect(() => {
        handlePageUpdate();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentPage, limit, collectionFilter]);

    useEffect(() => {
        !collectionId && replaceQueryParams({ page: 0, pageSize: limit });
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handlePageChange = (newPage: number): void => {
        setCurrentPage(newPage);
        replaceQueryParams({ page: newPage, pageSize: limit });
    };

    const handleLimitChange = (newLimit: number): void => {
        setCurrentPage(0);
        setLimit(newLimit);
        replaceQueryParams({ page: 0, pageSize: newLimit });
    };

    const handleRedirect = (botId: number) => {
        router.push(`/app/bots/${botId}/details/logs`);
    };

    const handleFilterCollection = (event, value: string[]) => {
        setCurrentPage(0);
        setCollectionFilter(value);
        replaceQueryParams({ page: 0, pageSize: limit });
    };

    return (
        <StyledCard className={clsx(classes.root, className)} {...rest}>
            <div className={classes.filterField}>
                <Autocomplete
                    onChange={handleFilterCollection}
                    id="filter-bots-by-collections"
                    options={botCollections.map((collection) => collection.name)}
                    getOptionLabel={(collectionNameLabel: string) => collectionNameLabel}
                    defaultValue={collectionFilter}
                    renderInput={(params) => (
                        <TextField {...params} label={translate('Bot.ListView.Results.Collections')} />
                    )}
                    filterSelectedOptions
                    disableCloseOnSelect
                    multiple
                />
            </div>
            <Box minWidth={1200}>
                <DataGrid
                    sx={BotsDataGridStyles}
                    autoHeight
                    disableColumnSelector
                    disableSelectionOnClick
                    rowHeight={80}
                    columns={columns}
                    rows={page?.content ?? []}
                    rowsPerPageOptions={[10, 20, 30]}
                    rowCount={page?.totalElements ?? 0}
                    page={currentPage}
                    onPageChange={handlePageChange}
                    pageSize={limit}
                    onPageSizeChange={handleLimitChange}
                    paginationMode='server'
                    loading={loadingBots || loadingCollections}
                    onCellClick={(param) => {
                        if (param.field !== 'actions') handleRedirect(param.row.id);
                    }}
                />
            </Box>
            <If condition={Boolean(botToDelete)}>
                <ActionBotButtonDelete
                    bot={botToDelete}
                    open={open}
                    setOpen={handleDialog}
                    afterDelete={handlePageUpdate}
                />
            </If>
        </StyledCard>
    );
};

export default Results;
