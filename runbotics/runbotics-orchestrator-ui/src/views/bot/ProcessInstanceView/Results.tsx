import {
    Box, Tab, Tabs,
} from '@mui/material';
import React, { ChangeEvent, FC, useState } from 'react';
import { IProcessInstance } from 'runbotics-common';
import useTranslations from 'src/hooks/useTranslations';
import Events from './Events';
import Details from './Details';

export interface ResultsProps {
    processInstance: IProcessInstance;
}

const Results: FC<ResultsProps> = ({ processInstance }) => {
    const [currentTab, setCurrentTab] = useState('details');
    const { translate } = useTranslations();
    const tabs = [
        { value: 'details', label: translate('Process.ProcessInstanceView.Tabs.Details.Title') },
        { value: 'events', label: translate('Process.ProcessInstanceView.Tabs.Events.Title') },
    ];

    const handleTabsChange = (event: ChangeEvent<HTMLInputElement>, value: string): void => {
        setCurrentTab(value);
    };

    return (
        <>
            <Tabs
                onChange={handleTabsChange}
                scrollButtons="auto"
                textColor="secondary"
                value={currentTab}
                variant="scrollable"
            >
                {tabs.map((tab) => (
                    <Tab key={tab.value} value={tab.value} label={tab.label} />
                ))}
            </Tabs>
            <Box pt={2}>
                {currentTab === 'events' && <Events processInstance={processInstance} />}
                {currentTab === 'details' && <Details processInstance={processInstance} />}
            </Box>
        </>
    );
};

export default Results;
