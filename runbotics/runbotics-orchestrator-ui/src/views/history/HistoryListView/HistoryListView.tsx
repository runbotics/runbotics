import React, { VFC } from 'react';
import { Box } from '@mui/material';
import useProcessInstanceSocket from 'src/hooks/useProcessInstanceSocket';
import useTranslations from 'src/hooks/useTranslations';
import InternalPage from 'src/components/pages/InternalPage';
import Header from './Header';
import HistoryTable from '../../../components/HistoryTable';

const HistoryListView: VFC = () => {
    useProcessInstanceSocket({ fullHistoryUpdate: true });
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
