import React, { FC, useMemo, useState } from 'react';

import { TextField, Autocomplete } from '@mui/material';
import { WidgetProps, ObjectFieldTemplateProps } from '@rjsf/core';

import { IFormData } from '#src-app/Actions/types';
import useProcessSearch from '#src-app/hooks/useProcessSearch';
import { useSelector } from '#src-app/store';

interface GlobalVariableOption {
    id: number;
    name: string;
    title: string;
}

interface CustomWidgetProps extends WidgetProps {
    formData: IFormData;
}

const ProcessNameSuggestionWidget: FC<CustomWidgetProps> = (props) => {
    const { page: processesPage } = useSelector((state) => state.process.all);
    const { handleSearch, search } = useProcessSearch();

    console.log(processesPage);
    const {
        process: { name: processName, id: processId },
    } = useSelector((state) => state.process.draft);

    console.log(process);
    const options = useMemo(
        () =>
            processesPage?.content
                ? processesPage.content
                    .filter((process) => process.id !== processId)
                    .map<GlobalVariableOption>((process) => ({ id: process.id, name: process.name, title: `#${process.id} - ${process.name}`}))
                : [],
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [processesPage],
    );

    const label = props.label ? `${props.label} ${props.required ? '*' : ''}` : '';

    const onChange = (event: React.ChangeEvent<HTMLInputElement>, newValue: GlobalVariableOption) => {
        props.onChange(newValue ? newValue.title : undefined);
    };

    // const handleChange = (event: React.ChangeEvent<HTMLInputElement>, newValue: GlobalVariableOption) => {
    //     const updatedFormData = {
    //         ...props.formData,
    //         input: { processId: newValue.id },
    //         output: {
    //             variableName: undefined,
    //         },
    //     };
    //     props.onChange(updatedFormData);
    // };
    

    console.log(props);
    console.log(search);
    console.log(props.value);

    const getValue = () => {
        const process = processesPage?.content.find((variable) => variable.name === props.value);
        return process ? { id: process.id, name: process.name, title: `#${process.id} - ${process.name}` } : null;
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
                    onChange={handleSearch} //TODO
                    value={search}
                />
            )}
        />
    );
};

export default ProcessNameSuggestionWidget;
