import { useEffect, VFC } from 'react';

import { Box } from '@mui/material';

import InternalPage from '#src-app/components/pages/InternalPage';
import useProcessInstanceMapSocket from '#src-app/hooks/useProcessInstanceMapSocket';
import { useDispatch } from '#src-app/store';
import { botCollectionActions } from '#src-app/store/slices/BotCollections';
import { botSystemsActions } from '#src-app/store/slices/BotSystem';
import { processActions } from '#src-app/store/slices/Process';
import { processInstanceActions } from '#src-app/store/slices/ProcessInstance';

import Header from './Header';
import ProcessList from './ProcessList';
import useTranslations from '../../../hooks/useTranslations';

const ProcessBrowseView: VFC = () => {
    const dispatch = useDispatch();
    const { translate } = useTranslations();

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
        <InternalPage
            title={translate('Process.Collection.Navigation.Processes.Label')}
        >
            <Header />
            <Box mt={6}>
                <ProcessList />
            </Box>
        </InternalPage>
    );
};

export default ProcessBrowseView;
