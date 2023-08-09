import React, { FC, useMemo, useEffect, useRef, useState } from 'react';

import { TextField, Autocomplete } from '@mui/material';
import { WidgetProps } from '@rjsf/core';

import { BotSystem } from 'runbotics-common';

import useTranslations from '#src-app/hooks/useTranslations';
import { useDispatch, useSelector } from '#src-app/store';
import { processActions } from '#src-app/store/slices/Process';

const ProcessNameSuggestionWidget: FC<WidgetProps> = (props) => {
    const dispatch = useDispatch();
    const { byId: processes } = useSelector((state) => state.process.all);
    const [customError, setCustomError] = useState('');
    const [value, setValue] = useState(props.value);
    const { translate } = useTranslations();

    useEffect(() => {
        dispatch(processActions.getProcesses());
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const {
        process: { id: processId, system: { name: rootProcessSystem } },
    } = useSelector((state) => state.process.draft);

    const isProcessSystemCompatible = (processSystem: string): boolean => (
        rootProcessSystem === processSystem ||
        rootProcessSystem === BotSystem.ANY ||
        processSystem === BotSystem.ANY
    );

    const options = useMemo(
        () =>
            processes
                ? Object.values(processes)
                    .filter((process) => (process.id !== processId && isProcessSystemCompatible(process.system.name)))
                    .map<number>((process) => process.id)
                : [],
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [processes],
    );

    const label = props.label ? `${props.label} ${props.required ? '*' : ''}` : '';

    const onChange = (event: React.ChangeEvent<HTMLInputElement>, newValue: number) => {
        props.onChange(newValue ? newValue : undefined);
        setValue(newValue);
    };

    const getLabel = (option: number | string) => {
        const process = Object.values(processes).find((variable) => variable.id === option);
        return process ? `#${process.id} - ${process.name}` : '';
    };

    useEffect(() => {
        options.includes(value)
            ? setCustomError('')
            : setCustomError(translate('Process.Details.Modeler.Actions.General.StartProcess.Error.IncompatibleProcessSystem'));
    }, [options, value]);

    return (
        <Autocomplete
            value={value ?? null}
            options={options}
            getOptionLabel={(option) => getLabel(option)}
            onChange={onChange}
            renderInput={(params) => (
                <TextField
                    {...params}
                    variant="outlined"
                    label={label}
                    InputLabelProps={{ shrink: true }}
                    error={!!props.rawErrors || !!customError}
                    helperText={!props.rawErrors && customError}
                />
            )}
        />
    );
};

export default ProcessNameSuggestionWidget;
