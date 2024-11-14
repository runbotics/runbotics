import { useEffect, VFC } from 'react';

import { Box } from '@mui/material';

import InternalPage from '#src-app/components/pages/InternalPage';

import { useDispatch } from '#src-app/store';
import { activityActions } from '#src-app/store/slices/Action';


import Header from './Header';

import Results from './Results';
import ActionDetails from '../ActionDetails';



const ActionListView: VFC = () => {
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(activityActions.getAllActions());
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
