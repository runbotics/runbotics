import React, { FC, useMemo } from 'react';

import { TextField, Autocomplete } from '@mui/material';
import { WidgetProps } from '@rjsf/core';

import useProcessSearch from '#src-app/hooks/useProcessSearch';
import { useSelector } from '#src-app/store';

interface GlobalVariableOption {
    id: number;
    name: string;
}

const ProcessNameSuggestionWidget: FC<WidgetProps> = (props) => {
    const { page: processesPage } = useSelector((state) => state.process.all);
    const { handleSearch, search } = useProcessSearch();

    const {
        process: { name: processName },
    } = useSelector((state) => state.process.draft);

    const options = useMemo(
        () =>
            processesPage?.content
                ? processesPage.content
                    .filter((process) => process.name !== processName)
                    .map<GlobalVariableOption>((process) => ({ id: process.id, name: process.name }))
                : [],
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [processesPage],
    );

    const label = props.label ? `${props.label} ${props.required ? '*' : ''}` : '';

    const onChange = (event: React.ChangeEvent<HTMLInputElement>, newValue: GlobalVariableOption) => {
        props.onChange(newValue ? newValue.name : undefined);
    };

    const getValue = () => {
        const process = processesPage?.content.find((variable) => variable.name === props.value);
        return process ? { id: process.id, name: process.name } : null;
    };

    return (
        <Autocomplete
            value={getValue()}
            options={options}
            getOptionLabel={(option) => (option as GlobalVariableOption).name}
            onChange={onChange}
            renderInput={(params) => (
                <TextField
                    {...params}
                    variant="outlined"
                    label={label}
                    InputLabelProps={{ shrink: true }}
                    error={!!props.rawErrors}
                    onChange={handleSearch}
                    value={search}
                />
            )}
        />
    );
};

export default ProcessNameSuggestionWidget;
