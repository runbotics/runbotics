import React, { FC, useMemo, useEffect } from 'react';

import { TextField, Autocomplete } from '@mui/material';
import { WidgetProps } from '@rjsf/core';

import { IFormData } from '#src-app/Actions/types';
import { useDispatch, useSelector } from '#src-app/store';
import { processActions } from '#src-app/store/slices/Process';

interface GlobalVariableOption {
    id: number;
    title: string;
}

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
                    .map<GlobalVariableOption>((process) => ({ id: process.id, title: `#${process.id} - ${process.name}`}))
                : [],
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [processes],
    );

    const label = props.label ? `${props.label} ${props.required ? '*' : ''}` : '';

    const onChange = (event: React.ChangeEvent<HTMLInputElement>, newValue: GlobalVariableOption) => {
        props.onChange(newValue ? newValue.title : undefined);
    };

    const getValue = () => {
        const process = Object.values(processes).find((variable) => `#${variable.id} - ${variable.name}` === props.value);
        return process ? { id: process.id, title: `#${process.id} - ${process.name}` } : null;
    };

    return (
        <Autocomplete
            value={getValue()}
            options={options}
            getOptionLabel={(option) => (option as GlobalVariableOption).title}
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
