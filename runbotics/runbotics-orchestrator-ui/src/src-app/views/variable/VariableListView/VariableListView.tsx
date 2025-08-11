import React, { FunctionComponent, useState } from 'react';

import { Box, TextField } from '@mui/material';

import InternalPage from '#src-app/components/pages/InternalPage';
import useGlobalVariableSearch from '#src-app/hooks/useGlobalVariableSearch';
import useTranslations from '#src-app/hooks/useTranslations';

import Header from './Header';
import Table from './Table/Table';
import { VariableDetailState } from '../Variable.types';
import VariableDetails from '../VariableDetails/VariableDetails';



const initialVariableDetailState: VariableDetailState = { show: false };

const VariableListView: FunctionComponent = () => {
    const [variableDetailState, setVariableDetailState] = useState<VariableDetailState>(initialVariableDetailState);
    const { translate } = useTranslations();
    const { handleSearch, search } = useGlobalVariableSearch();

    return (
        <>
            <InternalPage title={translate('Variables.Meta.Title')}>
                <Header onVariableCreate={() => setVariableDetailState({ show: true })} />
                <Box display='flex' justifyContent='flex-end' mt={2}>
                    <TextField 
                        label={'Search'}
                        onChange={handleSearch}
                        value={search}
                    />
                </Box>
                <Box mt={3}>
                    <Table setVariableDetailState={setVariableDetailState} />
                </Box>
            </InternalPage>
            <VariableDetails
                variableDetailState={variableDetailState}
                onClose={() => setVariableDetailState({ show: false })}
            />
        </>
    );
};

export default VariableListView;
