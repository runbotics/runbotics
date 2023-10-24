import { useEffect, VFC } from 'react';

import { Box } from '@mui/material';

import InternalPage from '#src-app/components/pages/InternalPage';
import useProcessInstanceMapSocket from '#src-app/hooks/useProcessInstanceMapSocket';
import { useDispatch } from '#src-app/store';
import { botCollectionActions } from '#src-app/store/slices/BotCollections';
import { botSystemsActions } from '#src-app/store/slices/BotSystem';
import { processInstanceActions } from '#src-app/store/slices/ProcessInstance';

import Header from './Header';
import ProcessList from './ProcessList';

const ProcessBrowseView: VFC = () => {
    const dispatch = useDispatch();

    useProcessInstanceMapSocket();

    useEffect(() => {
        dispatch(botCollectionActions.getAll());
        dispatch(botSystemsActions.getAll());

        return () => {
            dispatch(processInstanceActions.resetAllActiveProcessInstances());
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
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
