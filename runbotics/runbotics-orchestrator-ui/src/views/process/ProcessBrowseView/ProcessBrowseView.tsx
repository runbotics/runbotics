import { useEffect, VFC } from 'react';
import { Box } from '@mui/material';
import { useDispatch } from 'src/store';
import { botSystemsActions } from 'src/store/slices/BotSystem';
import { botCollectionActions } from 'src/store/slices/BotCollections';
import InternalPage from 'src/components/pages/InternalPage';
import Header from './Header';
import ProcessList from './ProcessList';

const ProcessBrowseView: VFC = () => {
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(botCollectionActions.getAll());
        dispatch(botSystemsActions.getAll());
    }, []);

    return (
        <InternalPage title="Processes">
            <Header />
            <Box mt={6}>
                <ProcessList />
            </Box>
        </InternalPage>
    );
};

export default ProcessBrowseView;
