import React, { FC, useState } from 'react';
import { WidgetProps } from '@rjsf/core';
import ReactJson, { InteractionProps } from 'react-json-view';
import { Tab, Tabs, TextField } from '@mui/material';
import Box from '@mui/material/Box';
import useTranslations from 'src/hooks/useTranslations';

interface TabPanelProps {
    children?: React.ReactNode;
    index: any;
    value: any;
}

function TabPanel(props: TabPanelProps) {
    const {
        children, value, index, ...other
    } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`wrapped-tabpanel-${index}`}
            aria-labelledby={`wrapped-tab-${index}`}
            {...other}
        >
            {value === index && <Box p={1}>{children}</Box>}
        </div>
    );
}

const JsonViewWidget: FC<WidgetProps> = (props) => {
    const [tab, setTab] = useState('view');
    const { translate } = useTranslations();

    const handleChange = (change: InteractionProps) => {
        props.onChange(JSON.stringify(change.updated_src));
    };

    const handleTextFieldChange = (event) => {
        props.onChange(JSON.stringify(JSON.parse(event.target.value)));
    };
    let json = {};
    try {
        json = props.value ? JSON.parse(props.value) : {};
    } catch (e) {
        throw new Error(translate('Process.Details.Modeler.Widgets.JsonView.Errors.UnableToParse'));
    }
    return (
        <>
            <Tabs value={tab} onChange={(event, value) => setTab(value)} indicatorColor="primary" textColor="primary">
                <Tab label={translate('Process.Details.Modeler.Widgets.JsonView.Tabs.View.Title')} value="view" />
                <Tab label={translate('Process.Details.Modeler.Widgets.JsonView.Tabs.Editor.Title')} value="editor" />
            </Tabs>

            <TabPanel value={tab} index="editor">
                <ReactJson
                    enableClipboard
                    name={false}
                    src={json}
                    displayDataTypes={false}
                    displayObjectSize={false}
                    onEdit={handleChange}
                    onDelete={handleChange}
                    onAdd={handleChange}
                />
            </TabPanel>
            <TabPanel value={tab} index="view">
                <TextField
                    fullWidth
                    defaultValue={props.value}
                    onBlur={handleTextFieldChange}
                    multiline
                    rows={4}
                />
            </TabPanel>
        </>
    );
};

export default JsonViewWidget;
