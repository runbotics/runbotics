import React, { useEffect } from 'react';
import type { FC } from 'react';
import { Box } from '@mui/material';
import { botActions } from 'src/store/slices/Bot';
import { botCollectionActions } from 'src/store/slices/BotCollections';
import { useDispatch } from 'src/store';

import Results from './Results';

interface BotListViewProps {
    collectionId?: string;
}

const BotListView: FC<BotListViewProps> = ({ collectionId }) => {
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(botActions.getAll());
        dispatch(botCollectionActions.getAll());
    }, []);

    return (
        <Box mt={3}>
            <Results collectionId={collectionId} />
        </Box>
    );
};

export default BotListView;
