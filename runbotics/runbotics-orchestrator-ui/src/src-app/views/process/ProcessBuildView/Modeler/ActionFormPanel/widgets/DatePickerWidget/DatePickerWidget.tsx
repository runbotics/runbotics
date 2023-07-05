import React, { FC, useState } from 'react';

import { TextField } from '@mui/material';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { CalendarOrClockPickerView } from '@mui/x-date-pickers/internals/models';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { WidgetProps } from '@rjsf/core';

const DatePickerWidget: FC<WidgetProps> = (props) => {
    const [selectedDate, setSelectedDate] = useState<Date | null>(null);
    const format: string = props.uiSchema['ui:options']?.format as string;
    let inputFormat = '';
    let views: CalendarOrClockPickerView[] = [];

    const handleDataChange = (date: Date | null) => {
        setSelectedDate(date);
        props.onChange(date.toISOString());
    };

    const renderInput = (params: any) => (
        <TextField
            {...params}
            sx={{ button: { marginRight: (theme) => theme.spacing(0.5) } }}
        />
    );

    switch (format) {
        case 'date':
            inputFormat = 'yyyy-MM-dd';
            views = ['year', 'month', 'day'];
            break;
        case 'date-time':
            inputFormat = 'yyyy-MM-dd HH:mm';
            views = ['year', 'month', 'day', 'hours', 'minutes'];
            break;
        case 'time':
            inputFormat = 'HH:mm';
            views = ['hours', 'minutes'];
            break;
        default:
            inputFormat = format ?? 'yyyy-MM-dd';
            views = ['year', 'month', 'day', 'hours', 'minutes'];
            break;
    }

    return (
        <LocalizationProvider dateAdapter={AdapterDateFns}>
            <DateTimePicker
                label={props.required ? `${props.label} *` : props.label}
                inputFormat={inputFormat}
                value={selectedDate}
                onChange={handleDataChange}
                renderInput={renderInput}
                views={views}
                InputProps={{ readOnly: true }}
            />
        </LocalizationProvider>
    );
};

export default DatePickerWidget;
