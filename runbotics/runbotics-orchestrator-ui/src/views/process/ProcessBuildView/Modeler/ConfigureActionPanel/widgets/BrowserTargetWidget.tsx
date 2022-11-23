import React, { FC, useEffect } from 'react';

import { InputLabel, MenuItem, Select, SelectChangeEvent } from '@mui/material';
import { WidgetProps } from '@rjsf/core';
import styled from 'styled-components';

import { translate } from 'src/hooks/useTranslations';

import ElementAwareAutocompleteWidget from './ElementAwareAutocompleteWidget';

const FieldsWrapper = styled.div`
    display: flex;
    width: 100%;
    align-items: center;
    gap: 16px;
`;

const PREFIX_OPTIONS = {
    'id=': {
        label: translate('Process.Details.Modeler.Actions.Browser.Target.ID'),
        tooltip: translate('Process.Details.Modeler.Actions.Browser.Target.ID.Tooltip'),
    },
    'xpath=': {
        label: translate('Process.Details.Modeler.Actions.Browser.Target.XPath'),
        tooltip: translate('Process.Details.Modeler.Actions.Browser.Target.XPath.Tooltip'),
    },
    'className=': {
        label: translate('Process.Details.Modeler.Actions.Browser.Target.ClassName'),
        tooltip: translate('Process.Details.Modeler.Actions.Browser.Target.ClassName.Tooltip'),
    },
    'css=': {
        label: translate('Process.Details.Modeler.Actions.Browser.Target.CSS'),
        tooltip: translate('Process.Details.Modeler.Actions.Browser.Target.CSS.Tooltip'),
    },
    'linkText=': {
        label: translate('Process.Details.Modeler.Actions.Browser.Target.LinkText'),
        tooltip: translate('Process.Details.Modeler.Actions.Browser.Target.LinkText.Tooltip'),
    },
    'partialLinkText=': {
        label: translate('Process.Details.Modeler.Actions.Browser.Target.PartialLinkText'),
        tooltip: translate('Process.Details.Modeler.Actions.Browser.Target.PartialLinkText.Tooltip'),
    },
    'None': {
        label: translate('Process.Details.Modeler.Actions.Browser.Target.None'),
        tooltip: translate('Process.Details.Modeler.Actions.Browser.Target.None.Tooltip'),
    }
};

const PREFIX_WIDTH = 170;

interface BrowserTargetState {
    prefix: string;
    value: string;
}

const BrowserTargetWidget: FC<WidgetProps> = (props) => {
    const [formState, setFormState] = React.useState<BrowserTargetState>({prefix: '', value: ''});

    useEffect(() => {
        if(props.value){
            const prefix = Object.keys(PREFIX_OPTIONS).find((option) => props.value.startsWith(option)) || 'None';
            const value = prefix === 'None' ? props.value : props.value.replace(prefix, ''); 
            setFormState({ prefix: prefix, value: value});
        }
    }, []);

    const onChangeWrapper = (prefix: string, value: string) => {
        if(prefix === 'None') {
            props.onChange(value);
        } else{
            props.onChange(prefix + value);
        }
    };
    
    const handlePrefixChange = (event: SelectChangeEvent<string>) => {
        setFormState(prev => ({prefix: event.target.value, value: prev.value}));
        onChangeWrapper(event.target.value, formState.value);
    };

    const handleValueChange = (event: string) => {
        setFormState(prev => ({ prefix: prev.prefix, value: event ?? '' }));
        onChangeWrapper(formState.prefix, event ?? '');
    };

    return <FieldsWrapper>
        <InputLabel>Selector</InputLabel>
        <Select sx={{ minWidth: `${PREFIX_WIDTH}px`}} required={props.required} label="Selector"  onChange={handlePrefixChange} value={formState.prefix}>
            {Object.keys(PREFIX_OPTIONS).map((option) => <MenuItem key={option} value={option}>{PREFIX_OPTIONS[option].label}</MenuItem>)}
        </Select>
        <ElementAwareAutocompleteWidget
            {...props}
            sx={{flexGrow: 1}}
            options={{info: PREFIX_OPTIONS[formState.prefix]?.tooltip}}
            variant="outlined"
            label={props.label}
            InputLabelProps={{ shrink: true }}
            onChange={handleValueChange}
            defaultValue={''}
            value={formState.value ?? ''}
            required={props.required}
        />
    </FieldsWrapper>;
};

export default BrowserTargetWidget;
