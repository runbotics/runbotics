import { useEffect, VFC } from 'react';

import { Box } from '@mui/material';

import InternalPage from '#src-app/components/pages/InternalPage';
import { useDispatch } from '#src-app/store';
import { getActions } from '#src-app/store/slices/Action/Action.thunks';

import ActionDetails from '../ActionDetails';
import Header from './Header';
import Results from './Results';

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
