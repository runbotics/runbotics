import React, { FC, useState } from 'react';

import { TextField } from '@mui/material';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { CalendarOrClockPickerView } from '@mui/x-date-pickers/internals/models';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { WidgetProps } from '@rjsf/core';
import moment from 'moment';

const inputTypes: {
    [key: string]: { format: string; views: CalendarOrClockPickerView[] };
} = {
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
};

const DatePickerWidget: FC<WidgetProps> = (props) => {
    const [selectedDate, setSelectedDate] = useState<Date | null>(null);
    const format: string = props.uiSchema['ui:options']?.format as string;
    const typeFound: string = Object.keys(inputTypes).find(
        (type) => type === format
    );
    let inputFormat: string = '';
    let views: CalendarOrClockPickerView[] = [];

    if (typeFound) {
        inputFormat = inputTypes[typeFound].format;
        views = inputTypes[typeFound].views;
    }
    if (!typeFound && format) {
        inputFormat = format;
        views = ['year', 'month', 'day', 'hours', 'minutes'];
    } else {
        inputFormat = inputTypes.default.format;
        views = inputTypes.default.views;
    }

    const handleDataChange = (date: Date | null) => {
        setSelectedDate(date);
        if (date !== null) {
            if (typeFound) {
                props.onChange(
                    moment(date).format(inputTypes[typeFound].format)
                );
            } else {
                props.onChange(moment(date).format());
            }
        }
    };

    const renderInput = (params: any) => (
        <TextField
            {...params}
            label={props.label}
            sx={{
                button: { marginRight: (theme) => theme.spacing(0.5) },
                caretColor: 'transparent',
            }}
            required={props.required}
        />
    );

    return (
        <LocalizationProvider dateAdapter={AdapterMoment}>
            <DateTimePicker
                inputFormat={inputFormat}
                value={selectedDate}
                onChange={handleDataChange}
                renderInput={renderInput}
                views={views}
                InputProps={{
                    onKeyDown: (event) => {
                        event.preventDefault();
                    },
                }}
            />
        </LocalizationProvider>
    );
};

export default DatePickerWidget;
