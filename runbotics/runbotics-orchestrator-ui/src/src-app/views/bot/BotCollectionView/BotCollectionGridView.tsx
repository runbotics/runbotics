import React, { MouseEvent, useEffect, useState, VFC } from 'react';

import { Box, Pagination } from '@mui/material';

import { useRouter } from 'next/router';


import BotCollectionTile from '#src-app/components/Tile/BotCollectionTile';

import LoadingScreen from '#src-app/components/utils/LoadingScreen';

import { CollectionsRoot, classes } from './BotCollectionView.styles';
import { BotCollectionViewProps } from './BotCollectionView.types';
import { getBotCollectionPageParams, getLimitByDisplayMode } from './BotCollectionView.utils';
import BotCollectionModifyDialog from './Dialog/modify/BotCollectionModifyDialog';
import { useSelector } from '../../../store';
import { botCollectionSelector } from '../../../store/slices/BotCollections';


const BotCollectionGridView: VFC<BotCollectionViewProps> = ({ page, setPage, displayMode }) => {
    const { byPage, loading } = useSelector(botCollectionSelector);
    const [botCollections, setBotCollections] = useState([]);
    const pageParams = getBotCollectionPageParams(0, getLimitByDisplayMode(displayMode));
    const router = useRouter();
    const [isDialogVisible, setIsDialogVisible] = useState(false);
    const [selectedCollection, setSelectedCollection] = useState();

    useEffect(() => {
        setBotCollections(byPage ? byPage.content : []);
    }, [byPage, loading]);

    const handlePageChange = (event: MouseEvent<HTMLElement>, currentPage: number) => {
        setPage(currentPage - 1);
        router.push(`/app/bots/collections?page=${currentPage - 1}`);
    };

    const handleCollectionEdit = (collectionId: string) => {
        setSelectedCollection(botCollections.find(collection => collection.id === collectionId));
        setIsDialogVisible(true);
    };

    return (
        <CollectionsRoot>
            <BotCollectionModifyDialog
                collection={selectedCollection}
                pageParams={pageParams}
                onClose={() => { setIsDialogVisible(false); }}
                open={isDialogVisible}
            />
            {loading ? (
                <LoadingScreen />
            ) : (
                <Box className={classes.cardsWrapper}>
                    {botCollections.map((collection) => (
                        <BotCollectionTile
                            key={collection.id}
                            botCollection={collection}
                            displayMode={displayMode}
                            handleEdit={handleCollectionEdit}
                        />
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
