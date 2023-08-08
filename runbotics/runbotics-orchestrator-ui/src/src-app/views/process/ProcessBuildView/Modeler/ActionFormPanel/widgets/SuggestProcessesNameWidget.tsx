import React, { FC, useMemo, useEffect, useRef } from 'react';

import { TextField, Autocomplete } from '@mui/material';
import { WidgetProps } from '@rjsf/core';

import { BotSystem } from 'runbotics-common';

import useTranslations from '#src-app/hooks/useTranslations';
import { useDispatch, useSelector } from '#src-app/store';
import { processActions } from '#src-app/store/slices/Process';

const ProcessNameSuggestionWidget: FC<WidgetProps> = (props) => {
    const dispatch = useDispatch();
    const { byId: processes } = useSelector((state) => state.process.all);
    const { translate } = useTranslations();
    const customError = useRef('');

    useEffect(() => {
        dispatch(processActions.getProcesses());
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    
    const {
        process: { id: processId, system: { name: rootProcessSystem } },
    } = useSelector((state) => state.process.draft);
    
    const verifyProcessSystem = (processSystem: string): boolean => (
        rootProcessSystem === processSystem || 
        rootProcessSystem === BotSystem.ANY || 
        processSystem === BotSystem.ANY
    );

    const options = useMemo(
        () =>
            processes
                ? Object.values(processes)
                    .filter((process) => (process.id !== processId && verifyProcessSystem(process.system.name)))
                    .map<number>((process) => process.id)
                : [],
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [processes],
    );

    const label = props.label ? `${props.label} ${props.required ? '*' : ''}` : '';

    const onChange = (event: React.ChangeEvent<HTMLInputElement>, newValue: number) => {
        props.onChange(newValue ? newValue : undefined);
    };

    const getLabel = (option: number | string) => {
        const process = Object.values(processes).find((variable) => variable.id === option);
        return process ? `#${process.id} - ${process.name}` : '';
    };

    const getValue = (value: number) => {
        if (options.includes(value)) {
            customError.current = '';
            return value;
        }
        customError.current = translate('Process.BuildView.Modeler.Widgets.FieldTemplate.IsARequiredProperty');
        return null;
    };

    return (
        <Autocomplete
            value={getValue(props.value)}
            options={options}
            getOptionLabel={(option) => getLabel(option)}
            onChange={onChange}
            renderInput={(params) => (
                <TextField
                    {...params}
                    variant="outlined"
                    label={label}
                    InputLabelProps={{ shrink: true }}
                    error={!!props.rawErrors || !!customError.current}
                    helperText={customError.current}
                />
            )} 
        />
    );
};

export default ProcessNameSuggestionWidget;
