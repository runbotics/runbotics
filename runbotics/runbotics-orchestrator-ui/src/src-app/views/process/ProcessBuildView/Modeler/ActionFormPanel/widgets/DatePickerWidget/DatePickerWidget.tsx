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
} as const;

const checkFormat = (format: any) => {
    if (!format || typeof format !== 'string') {
        return {
            inputFormat: inputTypes.date.format,
            views: inputTypes.date.views,
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

const DatePickerWidget: FC<WidgetProps> = ({ uiSchema, onChange, label, required }) => {
    const [selectedDate, setSelectedDate] = useState<Date | null>(null);
    const format = uiSchema['ui:options']?.format;
    const { inputFormat, views } = checkFormat(format);

    const handleDateChange = (date: Date | null) => {
        setSelectedDate(date);
        if (date !== null) {
            onChange(moment(date).format(inputFormat));
        }
    };

    const renderInput = (params: any) => (
        <TextField
            {...params}
            label={label}
            required={required}
            color={selectedDate && required === null ? 'error' : 'primary'}
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
                error={required && selectedDate === null}
            />
        </LocalizationProvider>
    );
};

export default DatePickerWidget;
