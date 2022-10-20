import React, { MouseEvent, useEffect, useState, VFC } from 'react';
import { Box, Pagination } from '@mui/material';
import BotCollectionTile from 'src/components/Tile/BotCollectionTile';
import LoadingScreen from 'src/components/utils/LoadingScreen';
import { useRouter } from 'next/router';
import { BotCollectionViewProps } from './BotCollectionView.types';
import { CollectionsRoot, classes } from './BotCollectionView.styles';
import { useSelector } from '../../../store';
import { botCollectionSelector } from '../../../store/slices/BotCollections';

const BotCollectionGridView: VFC<BotCollectionViewProps> = ({ page, setPage, displayMode }) => {
    const { byPage, loading } = useSelector(botCollectionSelector);
    const [botCollections, setBotCollections] = useState([]);
    const router = useRouter();
    useEffect(() => {
        setBotCollections(byPage ? byPage.content : []);
    }, [byPage, loading]);

    const handlePageChange = (event: MouseEvent<HTMLElement>, currentPage: number) => {
        setPage(currentPage - 1);
        router.push(`/app/bots/collections?page=${currentPage - 1}`);
    };

    return (
        <CollectionsRoot>
            {loading ? (
                <LoadingScreen />
            ) : (
                <Box className={classes.cardsWrapper}>
                    {botCollections.map((collection) => (
                        <BotCollectionTile key={collection.id} botCollection={collection} displayMode={displayMode} />
                    ))}
                </Box>
            )}
            <Box mt={6} display="flex" justifyContent="center">
                <Pagination count={byPage?.totalPages ?? 1} onChange={handlePageChange} page={page + 1} />
            </Box>
        </CollectionsRoot>
    );
};

export default BotCollectionGridView;
