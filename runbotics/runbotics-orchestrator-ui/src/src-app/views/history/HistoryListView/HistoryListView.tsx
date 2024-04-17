import React, { VFC } from 'react';

import { Box } from '@mui/material';



import InternalPage from '#src-app/components/pages/InternalPage';
import useProcessInstanceSocket from '#src-app/hooks/useProcessInstanceSocket';
import { useProcessQueueSocket } from '#src-app/hooks/useProcessQueueSocket';
import useTranslations from '#src-app/hooks/useTranslations';

import Header from './Header';
import HistoryTable from '../../../components/tables/HistoryTable';


const HistoryListView: VFC = () => {
    useProcessInstanceSocket({ fullHistoryUpdate: true });
    useProcessQueueSocket();
    const { translate } = useTranslations();

    return (
        <InternalPage title={translate('History.Meta.Title')}>
            <Box display="flex" flexDirection="column" width="100%">
                <Box display="flex" flexDirection="column" width="100%" padding="0 24px" gap="20px">
                    <Header />
                </Box>
                <Box padding="1rem 1.5rem" paddingBottom="0">
                    <HistoryTable sx={{ display: 'flex', flexDirection: 'column' }} />
                </Box>
            </Box>
        </InternalPage>
    );
};

export default HistoryListView;
