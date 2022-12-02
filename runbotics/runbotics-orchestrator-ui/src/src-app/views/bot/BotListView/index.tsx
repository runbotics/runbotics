import { useEffect, FC } from 'react';

import { Box } from '@mui/material';


import { useDispatch } from '#src-app/store';
import { botActions } from '#src-app/store/slices/Bot';
import { botCollectionActions } from '#src-app/store/slices/BotCollections';

import Results from './Results';


interface BotListViewProps {
    collectionId?: string;
}

const BotListView: FC<BotListViewProps> = ({ collectionId }) => {
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(botActions.getAll());
        dispatch(botCollectionActions.getAll());
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <Box mt={3}>
            <Results collectionId={collectionId} />
        </Box>
    );
};

export default BotListView;
