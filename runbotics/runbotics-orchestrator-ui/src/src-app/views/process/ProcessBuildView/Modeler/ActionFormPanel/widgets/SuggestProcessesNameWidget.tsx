import React, { FC, useMemo, useEffect } from 'react';

import { TextField, Autocomplete } from '@mui/material';
import { WidgetProps } from '@rjsf/core';

import { IFormData } from '#src-app/Actions/types';
import { useDispatch, useSelector } from '#src-app/store';
import { processActions } from '#src-app/store/slices/Process';

interface CustomWidgetProps extends WidgetProps {
    formData: IFormData;
}

const ProcessNameSuggestionWidget: FC<CustomWidgetProps> = (props) => {
    const dispatch = useDispatch();
    const { byId: processes } = useSelector((state) => state.process.all);

    useEffect(() => {
        dispatch(processActions.getProcesses());
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const {
        process: { id: processId },
    } = useSelector((state) => state.process.draft);

    const options = useMemo(
        () =>
            processes
                ? Object.values(processes)
                    .filter((process) => process.id !== processId)
                    .map<Number>((process) => process.id)
                : [],
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [processes],
    );

    const label = props.label ? `${props.label} ${props.required ? '*' : ''}` : '';

    const onChange = (event: React.ChangeEvent<HTMLInputElement>, newValue: Number) => {
        props.onChange(newValue ? newValue : undefined);
    };

    const getLabel = (option: Number) => {
        const process = Object.values(processes).find((variable) => variable.id === option);
        return process ? `#${process.id} - ${process.name}` : '';
    };

    return (
        <Autocomplete
            value={props.value ?? null}
            options={options}
            getOptionLabel={(option) => getLabel(option)}
            onChange={onChange}
            renderInput={(params) => (
                <TextField
                    {...params}
                    variant="outlined"
                    label={label}
                    InputLabelProps={{ shrink: true }}
                    error={!!props.rawErrors}
                />
            )} 
        />
    );
};

export default ProcessNameSuggestionWidget;
