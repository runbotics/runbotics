import React, { FC, useMemo, useEffect, useState } from 'react';

import { TextField, Autocomplete, Button } from '@mui/material';
import { WidgetProps } from '@rjsf/core';

import { useRouter } from 'next/router';
import { BotSystemType } from 'runbotics-common';

import If from '#src-app/components/utils/If';
import useTranslations from '#src-app/hooks/useTranslations';
import { useDispatch, useSelector } from '#src-app/store';
import { processActions } from '#src-app/store/slices/Process';

interface ProcessOption {
    id: number;
    disabled: boolean;
}

const ProcessNameSuggestionWidget: FC<WidgetProps> = (props) => {
    const router = useRouter();
    const dispatch = useDispatch();
    const { byId: processes } = useSelector((state) => state.process.all);
    const [customError, setCustomError] = useState('');
    const [value, setValue] = useState<ProcessOption>({ id: props.value, disabled: false });
    const { translate } = useTranslations();

    useEffect(() => {
        dispatch(processActions.getSimplifiedProcesses());
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const {
        process: {
            id: processId,
            system: {
                name: parentProcessSystem,
            }
        },
    } = useSelector((state) => state.process.draft);

    const isProcessDisabled = (processSystem: string): boolean => (
        !(parentProcessSystem === processSystem || processSystem === BotSystemType.ANY)
    );

    const options: ProcessOption[] = useMemo(
        () =>
            processes
                ? Object
                    .values(processes)
                    .reduce((acc, process) =>
                        process.id !== processId
                            ? [
                                ...acc,
                                {
                                    id: process.id,
                                    disabled: isProcessDisabled(process.system.name),
                                }
                            ]
                            : acc, [])
                : [],
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [processes],
    );

    const label = props.label ? `${props.label} ${props.required ? '*' : ''}` : '';

    const onChange = (event: React.ChangeEvent<HTMLInputElement>, newValue: ProcessOption) => {
        props.onChange(newValue ? newValue.id : undefined);
        setValue(newValue);
    };

    const getLabel = (option: number) => {
        const process = Object.values(processes).find((variable) => variable.id === option);
        return process ? `#${process.id} - ${process.name}` : '';
    };

    const handleRedirect = () => {
        router.push(`/app/processes/${props.value}/build`);
    };

    useEffect(() => {
        const selectedProcess = value && options.find(option => option.id === value.id);
        selectedProcess && selectedProcess.disabled
            ? setCustomError(translate('Process.Details.Modeler.Actions.General.StartProcess.Error.IncompatibleProcessSystem'))
            : setCustomError('');
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [options, value]);

    return (
        <>
            <Autocomplete
                value={value ?? null}
                options={options}
                getOptionLabel={(option: ProcessOption) => getLabel(option.id)}
                getOptionDisabled={(option: ProcessOption) => option.disabled}
                isOptionEqualToValue={(option, valueOption) => option.id === valueOption.id}
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
            <If
                condition={Boolean(value?.id)}
            >
                <Button
                    color='secondary'
                    variant='contained'
                    sx={{ marginTop: '15px' }}
                    onClick={handleRedirect}
                >
                    {translate('Process.Details.Modeler.Actions.General.StartProcess.ProcessInput.LinkToProcess')}
                </Button>

            </If>
        </>
    );
};

export default ProcessNameSuggestionWidget;
