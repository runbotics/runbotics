import React, { MouseEvent, useEffect, useState, FC, ChangeEvent } from 'react';

import {
    Autocomplete,
    Box,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TablePagination,
    TableRow,
    TextField,
} from '@mui/material';
import clsx from 'clsx';

import moment from 'moment';

import { useRouter } from 'next/router';
import { BotStatus } from 'runbotics-common';

import Label from 'src/components/Label';


import If from 'src/components/utils/If';
import LoadingScreen from 'src/components/utils/LoadingScreen';
import useBotStatusSocket from 'src/hooks/useBotStatusSocket';
import useQuery from 'src/hooks/useQuery';
import { useReplaceQueryParams } from 'src/hooks/useReplaceQueryParams';
import useTranslations from 'src/hooks/useTranslations';
import { useDispatch, useSelector } from 'src/store';
import { capitalizeFirstLetter, convertToPascalCase } from 'src/utils/text';

import { botActions } from '../../../store/slices/Bot';
import { DefaultPageSize } from '../BotBrowseView/BotBrowseView.utils';
import ActionBotButton from './ActionBotButton';
import { classes, StyledCard } from './Results.styles';



interface ResultsProps {
    className?: string;
    collectionId?: string;
}

const getBotStatusColor = (status: BotStatus) => {
    if (status === BotStatus.CONNECTED) return 'success';
    if (status === BotStatus.DISCONNECTED) return 'error';
    return 'warning';
};

const Results: FC<ResultsProps> = ({ className, collectionId, ...rest }) => {
    const router = useRouter();
    const dispatch = useDispatch();
    const query = useQuery();

    const pageFromUrl = query.get('page');
    const [currentPage, setCurrentPage] = useState(pageFromUrl ? parseInt(pageFromUrl, 10) : 0);
    const pageSizeFromUrl = query.get('pageSize');
    const [limit, setLimit] = useState(pageSizeFromUrl ? parseInt(pageSizeFromUrl, 10) : DefaultPageSize.TABLE);
    const { page, loading: loadingBots } = useSelector((state) => state.bot.bots);
    const { botCollections, loading: loadingCollections } = useSelector((state) => state.botCollection);
    const collectionName = botCollections?.find((collection) => collection.id === collectionId)?.name;
    const getDefaultCollectionFilter = () => (collectionName ? [collectionName] : []);
    const [collectionFilter, setCollectionFilter] = useState<string[]>(getDefaultCollectionFilter());
    useBotStatusSocket();
    const { translate } = useTranslations();
    const replaceQueryParams = useReplaceQueryParams();

    useEffect(() => {
        const pageNotAvailable = page && currentPage >= page.totalPages;
        if (pageNotAvailable) {
            setCurrentPage(0);
            replaceQueryParams({ page: 0, pageSize: limit });
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [page]);

    useEffect(() => {
        const params = {
            page: currentPage,
            size: limit,
            ...(collectionFilter &&
                collectionFilter.length && {
                filter: {
                    in: {
                        collection: collectionFilter,
                    },
                },
            }),
        };
        dispatch(botActions.getPage(params));
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentPage, limit, collectionFilter]);

    const handlePageChange = (event: any, newPage: number): void => {
        replaceQueryParams({ page: newPage, pageSize: limit });
        setCurrentPage(newPage);
    };

    const handleLimitChange = (event: ChangeEvent<HTMLInputElement>): void => {
        setCurrentPage(0);
        replaceQueryParams({ page: 0, pageSize: parseInt(event.target.value, 10) });
        setLimit(parseInt(event.target.value, 10));
    };

    const handleRedirect = (event: MouseEvent<HTMLTableCellElement>, botId: number) => {
        router.push(`/app/bots/${botId}/details/logs`);
    };

    const handleFilterCollection = (event, value) => {
        setCollectionFilter(value);
    };

    const getPageContent = () => (page && page.content) ?? [];

    return (
        <StyledCard className={clsx(classes.root, className)} {...rest}>
            <div className={classes.filterField}>
                <Autocomplete
                    onChange={handleFilterCollection}
                    id="filter-bots-by-collections"
                    options={botCollections.map((collection) => collection.name)}
                    getOptionLabel={(collectionNameLabel) => collectionNameLabel}
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
                <If condition={!(loadingBots || loadingCollections)} else={<LoadingScreen />}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>{translate('Bot.ListView.Results.Table.Header.InstallationId')}</TableCell>
                                <TableCell>{translate('Bot.ListView.Results.Table.Header.User')}</TableCell>
                                <TableCell sx={{ width: '11.25rem' }}>
                                    {translate('Bot.ListView.Results.Table.Header.Status')}
                                </TableCell>
                                <TableCell>{translate('Bot.ListView.Results.Table.Header.Collection')}</TableCell>
                                <TableCell>{translate('Bot.ListView.Results.Table.Header.System')}</TableCell>
                                <TableCell>{translate('Bot.ListView.Results.Table.Header.Version')}</TableCell>
                                <TableCell>{translate('Bot.ListView.Results.Table.Header.LastConnected')}</TableCell>
                                <TableCell width={20} />
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {getPageContent().map((bot) => {
                                const formattedStatus = convertToPascalCase(bot.status);

                                return (
                                    <TableRow hover key={bot.installationId}>
                                        <TableCell onClick={(ev) => handleRedirect(ev, bot.id)}>
                                            {bot.installationId}
                                        </TableCell>
                                        <TableCell onClick={(ev) => handleRedirect(ev, bot.id)}>
                                            {bot.user?.login}
                                        </TableCell>
                                        <TableCell onClick={(ev) => handleRedirect(ev, bot.id)}>
                                            <Label color={getBotStatusColor(bot.status)}>
                                                {/* @ts-ignore */}
                                                {translate(`Bot.ListView.Results.Table.Status.${formattedStatus}`)}
                                            </Label>
                                        </TableCell>
                                        <TableCell onClick={(ev) => handleRedirect(ev, bot.id)}>
                                            {bot.collection?.name}
                                        </TableCell>
                                        <TableCell>{capitalizeFirstLetter(bot.system?.name ?? '')}</TableCell>
                                        <TableCell onClick={(ev) => handleRedirect(ev, bot.id)}>
                                            {bot.version}
                                        </TableCell>
                                        <TableCell onClick={(ev) => handleRedirect(ev, bot.id)}>
                                            {moment(bot.lastConnected).format('YYYY-MM-DD HH:mm')}
                                        </TableCell>
                                        <TableCell>
                                            <ActionBotButton bot={bot} />
                                        </TableCell>
                                    </TableRow>
                                );
                            })}
                        </TableBody>
                    </Table>
                </If>
                <TablePagination
                    component="div"
                    count={page ? page.totalElements : 0}
                    onPageChange={handlePageChange}
                    onRowsPerPageChange={handleLimitChange}
                    page={currentPage}
                    rowsPerPage={limit}
                    rowsPerPageOptions={[10, 20, 30]}
                />
            </Box>
        </StyledCard>
    );
};

export default Results;
