import React, { FunctionComponent, useState } from 'react';

import { Box, TextField } from '@mui/material';

import InternalPage from '#src-app/components/pages/InternalPage';
import useTranslations from '#src-app/hooks/useTranslations';


import Header from './Header';
import { VariableDetailState } from '../Variable.types';
import Table from './Table/Table';
import VariableDetails from '../VariableDetails/VariableDetails';



const initialVariableDetailState: VariableDetailState = { show: false };

const VariableListView: FunctionComponent = () => {
    const [variableDetailState, setVariableDetailState] = useState<VariableDetailState>(initialVariableDetailState);
    const { translate } = useTranslations();

    const [search, setSearch] = useState('');
    
    const handleSearch = (value: string) => { 
        setSearch(value);
    };

    return (
        <>
            <InternalPage title={translate('Variables.Meta.Title')}>
                <Header onVariableCreate={() => setVariableDetailState({ show: true })} />
                <Box display='flex' justifyContent='flex-end' mt={2}>
                    <TextField 
                        label={'Search'}
                        onChange={(e) => handleSearch(e.target.value)}
                    />
                </Box>
                <Box mt={3}>
                    <Table setVariableDetailState={setVariableDetailState} searchValue={search} />
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
