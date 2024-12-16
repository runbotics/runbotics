import React, { FC, useEffect, useMemo } from 'react';

import { TextField, Autocomplete } from '@mui/material';
import { WidgetProps } from '@rjsf/core';
import { useDispatch, useSelector } from 'react-redux';

import { globalVariableActions, globalVariableSelector } from '#src-app/store/slices/GlobalVariable';

interface GlobalVariableOption {
    id: number;
    name: string;
}

const GlobalVariableSelectWidget: FC<WidgetProps> = (props) => {
    const dispatch = useDispatch();
    const { globalVariables } = useSelector(globalVariableSelector);

    const options = useMemo(() => globalVariables
        .map<GlobalVariableOption>((variable) => ({
            id: variable.id,
            name: variable.name,
        })), [globalVariables]);

    const label = props.label
        ? `${props.label} ${props.required ? '*' : ''}`
        : '';

    const onChange = (event: any, newValue: GlobalVariableOption) => {
        props.onChange(newValue ? newValue.id.toString() : undefined);
    };

    const getValue = () => {
        const globalVariable = globalVariables.find(
            (variable) => variable.id.toString() === props.value
        );
        return globalVariable
            ? { id: globalVariable.id, name: globalVariable.name }
            : undefined;
    };

    useEffect(() => {
        dispatch(globalVariableActions.getGlobalVariables());
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <Autocomplete
            value={getValue()}
            disabled={props.disabled}
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
                />
            )}
        />
    );
};

export default GlobalVariableSelectWidget;
