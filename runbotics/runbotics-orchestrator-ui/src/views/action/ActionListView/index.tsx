import { useEffect, VFC } from 'react';
import { Box } from '@mui/material';
import { getActions } from 'src/store/slices/Action/Action.thunks';
import { useDispatch } from 'src/store';
import InternalPage from 'src/components/pages/InternalPage';
import Header from './Header';
import Results from './Results';
import ActionDetails from '../ActionDetails';

const ActionListView: VFC = () => {
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(getActions());
    }, [dispatch]);

    return (
        <InternalPage title="Actions">
            <Header />
            <Box mt={3}>
                <Results />
            </Box>
            <ActionDetails />
        </InternalPage>
    );
};

export default ActionListView;
