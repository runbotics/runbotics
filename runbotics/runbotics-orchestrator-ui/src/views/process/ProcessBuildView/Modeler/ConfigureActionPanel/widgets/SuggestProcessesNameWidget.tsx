import React, { FC, useMemo } from 'react';
import { WidgetProps } from '@rjsf/core';
import Autocomplete from '@mui/material/Autocomplete';
import { TextField } from '@mui/material';
import useProcessSearch from 'src/hooks/useProcessSearch';
import { useSelector } from 'src/store';

interface GlobalVariableOption {
    id: number;
    name: string;
}

const ProcessNameSuggestionWidget: FC<WidgetProps> = (props) => {
    const { page: processesPage } = useSelector((state) => state.process.all);
    const { handleSearch, search } = useProcessSearch();

    const options = useMemo(() => (processesPage?.content ? processesPage.content
        .map<GlobalVariableOption>((variable) => ({ id: variable.id, name: variable.name })) : []), [processesPage]);

    const label = props.label ? `${props.label} ${props.required ? '*' : ''}` : '';

    const onChange = (event: React.ChangeEvent<HTMLInputElement>, newValue: GlobalVariableOption) => {
        props.onChange(newValue ? newValue.name : undefined);
    };

    const getValue = () => {
        const process = processesPage?.content.find((variable) => variable.name === props.value);
        return process
            ? { id: process.id, name: process.name }
            : null;
    };

    return (
        <Autocomplete
            value={getValue()}
            options={options}
            getOptionLabel={(option) => option.name}
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
