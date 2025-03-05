import React, { FC, useEffect } from 'react';

import { InputLabel, MenuItem, Select, SelectChangeEvent } from '@mui/material';
import { WidgetProps } from '@rjsf/core';

import useTranslations from '#src-app/hooks/useTranslations';

import { FieldsWrapper } from './BrowserTarget.styles';
import { BrowserTargetState } from './BrowserTarget.types';
import { initialFormState, PREFIX_WIDTH } from './BrowserTarget.utils';
import CustomTextWidget from '../CustomTextWidget';

interface BrowserTargetWidgetProps extends WidgetProps {
    options: {
        defaultTarget?: string;
        selectorName: string;
    }
}

const BrowserTargetWidget: FC<BrowserTargetWidgetProps> = (props) => {
    const { translate } = useTranslations();
    const [formState, setFormState] = React.useState<BrowserTargetState>(initialFormState);
    const defaultTarget =  props.options.defaultTarget ? props.options.defaultTarget: '';
    const selectorName = props.options.selectorName ? props.options.selectorName : translate('Process.Details.Modeler.Actions.Browser.Target.Selector.Label');

    useEffect(() => {
        defaultTarget && setFormState((prevState) => ({...prevState, prefix: defaultTarget}));
    }, []);

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

    useEffect(() => {
        if (props.value) {
            const prefix = Object.keys(PREFIX_OPTIONS).find((option) => props.value.startsWith(option)) || 'None';
            const value = prefix === 'None' ? props.value : props.value.replace(prefix, '');
            setFormState({ prefix: prefix, value: value});
        }
    }, []);

    const onChangeWrapper = (prefix: string, value: string) => {
        if (!prefix || !value) {
            props.onChange(undefined);
        } else if (prefix === 'None') {
            props.onChange(value);
        } else {
            props.onChange(prefix + value);
        };
    };

    const handlePrefixChange = (event: SelectChangeEvent<string>) => {
        setFormState(prev => ({ prefix: event.target.value, value: prev.value }));
        onChangeWrapper(event.target.value, formState.value);
    };

    const handleValueChange = (event: string) => {
        setFormState(prev => ({ prefix: prev.prefix, value: event ?? '' }));
        onChangeWrapper(formState.prefix, event ?? '');
    };

    const prefixOptions = Object.keys(PREFIX_OPTIONS)
        .map((option) => <MenuItem key={option} value={option}>{PREFIX_OPTIONS[option].label}</MenuItem>);

    return (
        <FieldsWrapper>
            <InputLabel>{selectorName}</InputLabel>
            <Select
                sx={{ minWidth: `${PREFIX_WIDTH}px`}}
                required={props.required}
                label={selectorName}
                onChange={handlePrefixChange}
                value={formState.prefix}
            >
                {prefixOptions}
            </Select>
            <CustomTextWidget
                {...props}
                sx={{ flexGrow: 1 }}
                options={{info: PREFIX_OPTIONS[formState.prefix]?.tooltip}}
                variant="outlined"
                label={props.label}
                InputLabelProps={{ shrink: true }}
                onChange={handleValueChange}
                defaultValue={''}
                value={formState.value ?? ''}
                required={props.required}
            />
        </FieldsWrapper>
    );
};

export default BrowserTargetWidget;
