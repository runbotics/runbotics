import {
    Divider, Grid, Tab, Tabs,
} from '@mui/material';
import React, { FC } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import { useSelector } from 'src/store';
import useTranslations from 'src/hooks/useTranslations';
import { ProcessTab } from 'src/utils/process-tab';
import { ProcessParams } from '../../../utils/types/ProcessParams';
import ProcessMainViewManager from './ProcessMainView.manager';
import { ProcessTitle, ProcessInternalPage } from './ProcessMainView.styled';

const ProcessMainView: FC = () => {
    const history = useHistory();
    const { process } = useSelector((state) => state.process.draft);
    const { id, tab } = useParams<ProcessParams>();
    const { translate } = useTranslations();

    const processTabs = [
        { value: ProcessTab.BUILD, label: translate('Process.MainView.Tabs.Build.Title') },
        { value: ProcessTab.RUN, label: translate('Process.MainView.Tabs.Run.Title') },
        { value: ProcessTab.CONFIGURE, label: translate('Process.MainView.Tabs.Configure.Title') },
    ];

    const handleMainTabsChange = (processTab: ProcessTab) => {
        history.push(`/app/processes/${id}/${processTab}`);
    };

    return (
        <ProcessInternalPage title={translate('Process.MainView.Meta.Title')} fullWidth>
            <Grid container>
                <Grid item xs={3} mb={1} mt={1} ml={1}>
                    <Tabs
                        onChange={(_, processTab) => handleMainTabsChange(processTab)}
                        scrollButtons="auto"
                        textColor="secondary"
                        value={tab}
                        variant="scrollable"
                    >
                        {processTabs.map((processTab) => (
                            <Tab key={processTab.value} label={processTab.label} value={processTab.value} />
                        ))}
                    </Tabs>
                </Grid>
                <Grid item xs={6} mb={1} mt={1}>
                    <ProcessTitle variant="h3" color="textPrimary">
                        {process.name}
                    </ProcessTitle>
                </Grid>
            </Grid>
            <Divider />
            <ProcessMainViewManager />
        </ProcessInternalPage>
    );
};

export default ProcessMainView;
