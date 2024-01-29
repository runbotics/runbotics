import { useEffect, FC } from 'react';

import { Box } from '@mui/material';


import { useDispatch } from '#src-app/store';
import { botCollectionActions } from '#src-app/store/slices/BotCollections';

import Results from './Results';

const BotListView: FC = () => {
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(botCollectionActions.getAll());
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <Box mt={3}>
            <Results />
        </Box>
    );
};

export default BotListView;
