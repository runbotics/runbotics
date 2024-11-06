import { ChangeEvent, MouseEvent, useState, VFC } from 'react';

import CheckCircleOutlineOutlinedIcon from '@mui/icons-material/CheckCircleOutlineOutlined';
import RemoveCircleOutlineOutlinedIcon from '@mui/icons-material/RemoveCircleOutlineOutlined';
import { Box, Table, TableBody, TableCell, TableHead, TablePagination, TableRow, TextField } from '@mui/material';
import { red } from '@mui/material/colors';
import moment from 'moment';
import { useRouter } from 'next/router';
import { IBotCollection } from 'runbotics-common';


import LoadingScreen from '#src-app/components/utils/LoadingScreen';

import useTranslations from '#src-app/hooks/useTranslations';

import { BotCollectionViewProps } from './BotCollectionView.types';
import { ROWS_PER_PAGE_LIST_VIEW } from './BotCollectionView.utils';
import BotCollectionTileAction from '../../../components/Tile/BotCollectionTile/BotCollectionTile.actions';
import { useSelector } from '../../../store';
import { botCollectionSelector } from '../../../store/slices/BotCollections';


const BotCollectionListView: VFC<BotCollectionViewProps> = ({
    page,
    setPage,
    limit,
    setLimit,
    setSearch,
    setSearchField,
}) => {
    const router = useRouter();
    const { byPage, loading } = useSelector(botCollectionSelector);

    const [searchName, setSearchName] = useState('');
    const [searchCreator, setSearchCreator] = useState('');

    const { translate } = useTranslations();

    const handlePageChange = (event: MouseEvent<HTMLElement>, currentPage: number) => {
        setPage(currentPage);
    };

    const handleLimitChange = (event: ChangeEvent<HTMLInputElement>) => {
        setLimit(Number(event.target.value));
    };

    const handleRedirect = (event, collectionId: string) => {
        if (event.target.nodeName === 'TD') router.push(`/app/bots?collection=${collectionId}`);
    };

    const handleSearchName = (event) => {
        setSearchCreator('');
        setSearchName(event.target.value);
        setSearchField(event.target.id);
        setSearch(event.target.value);
    };

    const handleSearchCreator = (event) => {
        setSearchName('');
        setSearchCreator(event.target.value);
        setSearchField(event.target.id);
        setSearch(event.target.value);
    };

    const mapCollectionToRow = (collection: IBotCollection) => {
        const includedPublicBotMark = collection.publicBotsIncluded ? (
            <CheckCircleOutlineOutlinedIcon color="success" />
        ) : (
            <RemoveCircleOutlineOutlinedIcon sx={{ color: red[500] }} />
        );
        return (
            <TableRow hover key={collection.id} onClick={(ev) => handleRedirect(ev, collection.id)}>
                <TableCell>{collection.name}</TableCell>
                <TableCell>{collection.createdByUser?.login}</TableCell>
                <TableCell>{includedPublicBotMark}</TableCell>
                <TableCell>{collection.created ? moment(collection.created).format('YYYY-MM-DD HH:mm') : ''}</TableCell>
                <TableCell>{collection.updated ? moment(collection.updated).format('YYYY-MM-DD HH:mm') : ''}</TableCell>
                <TableCell align="right">
                    <BotCollectionTileAction botCollection={collection} />
                </TableCell>
            </TableRow>
        );
    };

    const getTableView = () => (
        <Table>
            <TableHead>
                <TableRow>
                    <TableCell>
                        <TextField id="name" onChange={handleSearchName} value={searchName} variant="standard" />
                    </TableCell>
                    <TableCell>
                        <TextField
                            id="createdByName"
                            onChange={handleSearchCreator}
                            value={searchCreator}
                            variant="standard"
                        />
                    </TableCell>
                    <TableCell />
                    <TableCell />
                    <TableCell />
                </TableRow>
                <TableRow>
                    <TableCell>{translate('Bot.ListView.Table.Header.Name')}</TableCell>
                    <TableCell>{translate('Bot.ListView.Table.Header.Creator')}</TableCell>
                    <TableCell>{translate('Bot.ListView.Table.Header.PublicIncluded')}</TableCell>
                    <TableCell>{translate('Bot.ListView.Table.Header.Created')}</TableCell>
                    <TableCell>{translate('Bot.ListView.Table.Header.Updated')}</TableCell>
                    <TableCell align="right">{translate('Bot.ListView.Table.Header.Options')}</TableCell>
                </TableRow>
            </TableHead>
            <TableBody>{byPage?.content.map((collection) => mapCollectionToRow(collection))}</TableBody>
        </Table>
    );

    return (
        <Box minWidth={1200}>
            {loading ? <LoadingScreen /> : getTableView()}
            <TablePagination
                component="div"
                count={byPage?.totalElements ?? 0}
                onPageChange={handlePageChange}
                onRowsPerPageChange={handleLimitChange}
                page={page}
                rowsPerPage={limit}
                rowsPerPageOptions={ROWS_PER_PAGE_LIST_VIEW}
            />
        </Box>
    );
};

export default BotCollectionListView;
