import React, { FC, useState } from 'react';

import { TextField } from '@mui/material';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { WidgetProps } from '@rjsf/core';

import moment from 'moment';

import { StyledDateTimePicker } from './DatePickerWidget.styles';

const inputTypes = {
    date: {
        format: 'YYYY-MM-DD',
        views: ['year', 'month', 'day'],
    },
    'date-time': {
        format: 'YYYY-MM-DD HH:mm',
        views: ['year', 'month', 'day', 'hours', 'minutes'],
    },
    time: {
        format: 'HH:mm',
        views: ['hours', 'minutes'],
    },
    default: {
        format: 'YYYY-MM-DD',
        views: ['year', 'month', 'day'],
    },
} as const;

const checkFormat = (format: string) => {
    if (!format) {
        return {
            inputFormat: inputTypes.default.format,
            views: inputTypes.default.views,
        };
    }

    const typeFound: string = Object.keys(inputTypes).find(
        (type) => type === format
    );
    if (typeFound) {
        return {
            inputFormat: inputTypes[typeFound].format,
            views: inputTypes[typeFound].views,
        };
    }

    return { inputFormat: format, views: inputTypes['date-time'].views };
};

const DatePickerWidget: FC<WidgetProps> = (props) => {
    const [selectedDate, setSelectedDate] = useState<Date | null>(null);
    const format: string = props.uiSchema['ui:options']?.format as string;
    const { inputFormat, views } = checkFormat(format);

    const handleDateChange = (date: Date | null) => {
        setSelectedDate(date);
        if (date !== null) {
            props.onChange(moment(date).format(inputFormat));
        }
    };

    const renderInput = (params: any) => (
        <TextField
            {...params}
            label={props.label}
            required={props.required}
            color={selectedDate === null ? 'error' : 'primary'}
            sx={{
                button: { marginRight: (theme) => theme.spacing(0.5) },
                caretColor: 'transparent',
            }}
            {...(selectedDate === null && {
                InputLabelProps: { style: { color: 'error' } },
            })}
        />
    );

    return (
        <LocalizationProvider dateAdapter={AdapterMoment}>
            <StyledDateTimePicker
                inputFormat={inputFormat}
                value={selectedDate}
                onChange={handleDateChange}
                renderInput={renderInput}
                views={views}
                InputProps={{
                    onKeyDown: (event) => {
                        event.preventDefault();
                    },
                }}
                error={selectedDate === null}
            />
        </LocalizationProvider>
    );
};

export default DatePickerWidget;
