import React, { FunctionComponent, useState } from 'react';
import { Box } from '@mui/material';

import InternalPage from 'src/components/pages/InternalPage';
import useTranslations from 'src/hooks/useTranslations';
import { VariableDetailState } from '../Variable.types';
import VariableDetails from '../VariableDetails/VariableDetails';

import Header from './Header';
import Table from './Table/Table';

const initialVariableDetailState: VariableDetailState = { show: false };

const VariableListView: FunctionComponent = () => {
    const [variableDetailState, setVariableDetailState] = useState<VariableDetailState>(initialVariableDetailState);
    const { translate } = useTranslations();

    return (
        <>
            <InternalPage title={translate('Variables.Meta.Title')}>
                <Header onVariableCreate={() => setVariableDetailState({ show: true })} />
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
