import React, { useEffect, useState, FC, useMemo } from 'react';

import {
    Autocomplete,
    Box,
    TextField,
} from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import clsx from 'clsx';

import _ from 'lodash';
import { useRouter } from 'next/router';

import { IBot } from 'runbotics-common';

import If from '#src-app/components/utils/If';
import useBotStatusSocket from '#src-app/hooks/useBotStatusSocket';
import useQuery from '#src-app/hooks/useQuery';
import { useReplaceQueryParams } from '#src-app/hooks/useReplaceQueryParams';
import useTranslations from '#src-app/hooks/useTranslations';
import { useDispatch, useSelector } from '#src-app/store';

import ActionBotButtonDelete from './ActionBotButton';
import { BotsDataGridStyles, classes, StyledCard } from './Results.styles';
import useBotListViewColumns from './useBotListViewColumns';
import { botActions } from '../../../store/slices/Bot';
import { DefaultPageSize } from '../BotBrowseView/BotBrowseView.utils';

interface ResultsProps {
    className?: string;
}

const Results: FC<ResultsProps> = ({ className, ...rest }) => {
    const router = useRouter();
    const dispatch = useDispatch();
    const { firstValueFrom, allValuesFrom } = useQuery();
    const { translate } = useTranslations();
    const replaceQueryParams = useReplaceQueryParams();
    useBotStatusSocket();

    const { page, loading: loadingBots } = useSelector((state) => state.bot.bots);
    const { botCollections, loading: loadingCollections } = useSelector((state) => state.botCollection);

    const pageFromUrl = firstValueFrom('page');
    const pageSizeFromUrl = firstValueFrom('pageSize');
    const collectionFromUrl = allValuesFrom('collection') ?? [];
    const [currentPage, setCurrentPage] = useState(pageFromUrl ? parseInt(pageFromUrl, 10) : 0);
    const [limit, setLimit] = useState(pageSizeFromUrl ? parseInt(pageSizeFromUrl, 10) : DefaultPageSize.TABLE);
    const [collectionState, setCollectionState] = useState(collectionFromUrl);
    const mappedBotCollections = useMemo(() => botCollections?.reduce((acc, collection) => ({
        ...acc,
        [collection.id]: collection.name,
    }), {}), [botCollections]);

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
            ...(!(_.isEmpty(mappedBotCollections)) &&
                collectionState.length &&
                {
                    filter: {
                        in: {
                            'collection->name': collectionState.map((collectionId) =>
                                mappedBotCollections[collectionId]),
                        },
                    },
                }),
        };
        dispatch(botActions.getPage({ pageParams: params }));
    };

    const handlePageChange = (newPage: number) => {
        setCurrentPage(newPage);
    };

    const handleLimitChange = (newLimit: number) => {
        setCurrentPage(0);
        setLimit(newLimit);
    };

    const handleRedirect = (botId: number) => {
        router.push(`/app/bots/${botId}/details/logs`);
    };

    const handleFilterCollection = (event, collections: string[]) => {
        setCurrentPage(0);
        setCollectionState(collections);
    };

    useEffect(() => {
        const pageNotAvailable = page && currentPage >= page.totalPages;
        if (pageNotAvailable) {
            setCurrentPage(0);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [page]);

    useEffect(() => {
        handlePageUpdate();
        replaceQueryParams({
            page: currentPage,
            pageSize: limit,
            collection: collectionState,
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentPage, limit, collectionState, mappedBotCollections]);

    return (
        <StyledCard className={clsx(classes.root, className)} {...rest}>
            <div className={classes.filterField}>
                <Autocomplete
                    id="filter-bots-by-collections"
                    options={botCollections?.map(collection => collection.id)}
                    getOptionLabel={(collectionId) => mappedBotCollections[collectionId]}
                    value={collectionState}
                    onChange={handleFilterCollection}
                    renderInput={(params) => (
                        <TextField {...params} label={translate('Bot.ListView.Results.Collections')}/>
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
                    paginationMode="server"
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
                    onClose={handlePageUpdate}
                />
            </If>
        </StyledCard>
    );
};

export default Results;
