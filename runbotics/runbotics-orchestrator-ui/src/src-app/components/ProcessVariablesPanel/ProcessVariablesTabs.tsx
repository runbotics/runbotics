
import React, {useState} from 'react';

import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import { Box, Tab } from '@mui/material';


const ProcessVariablesTabs = ({tabs}) => {
    const [tabIdx, setTabIdx] = useState(1);
    const [value, setValue] = React.useState('1');
   

    const tabsJSX = tabs.map((tab, index) => (
        <Tab key={tab} label={tab} value={index.toString()}/>
    ));


    const handleChange = (event: React.SyntheticEvent, newValue: string) => {
        console.log(newValue);
        setValue(newValue);
        setTabIdx(+newValue);
    };

    console.log('rerendered');

    return (
        <TabContext value={value}>
            <Box>
                <TabList onChange={handleChange}>
                    {tabsJSX}
                </TabList>
                <TabPanel value={value}>{tabs[tabIdx]}</TabPanel>

            </Box>
        </TabContext>
    );
};

export default ProcessVariablesTabs;
