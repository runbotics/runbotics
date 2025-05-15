import React, { useEffect, VFC } from 'react';

import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { Button, Divider, IconButton, Stack, TextField } from '@mui/material';

import { DatePicker } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { Controller, useForm } from 'react-hook-form';

import {
    PluginDrawerTitle, PluginsDrawer,
} from '#src-app/views/tenants/TenantsListView/TenantPluginsDrawer/TenantPluginsView/TenantPluginsView.styles';

interface TenantPluginsEditProps {
    open: boolean,
    onClose: () => void,
    pluginData?: any,
}

interface PluginFormData {
    id: string;
    pluginName: string;
    expDate: Date | null;
    license: string;
}

const TenantPluginsEdit: VFC<TenantPluginsEditProps> = ({open, onClose, pluginData}) => {
    const { control, handleSubmit, reset } = useForm<PluginFormData>({
        defaultValues: {
            id: '',
            pluginName: '',
            expDate: null,
            license: '',
        },
    });
        
    const onSubmit = (data) => {
        console.log('Form data:', data);
        reset();
    };
    
    const onCloseDrawer = () => {
        reset();
        onClose();
    };

    useEffect(() => {
        if(pluginData) {
            reset(pluginData);
        }
    }, [pluginData, reset]);
    
    return (
        <PluginsDrawer
            anchor="right"
            open={open}
            onClose={onCloseDrawer}
            hideBackdrop
        >
            <Stack direction="column">
                <Stack
                    direction="row"
                    sx={{ alignItems: 'center' }}
                    paddingX={2}
                >
                    <IconButton onClick={onCloseDrawer}>
                        <ArrowBackIcon />
                    </IconButton>
                    <PluginDrawerTitle>Activate new plugin</PluginDrawerTitle>
                </Stack>
                <Divider />
                <Divider />
                <Stack direction="column" spacing={2} padding={2}>
                    <LocalizationProvider dateAdapter={AdapterDateFns}>
                        <form onSubmit={handleSubmit(onSubmit)}>
                            <Stack spacing={2}>
                                <Controller
                                    name="pluginName"
                                    control={control}
                                    rules={{
                                        required: 'To pole jest wymagane',
                                    }}
                                    render={({ field, fieldState }) => (
                                        <TextField
                                            {...field}
                                            label="Nazwa plugina"
                                            error={!!fieldState.error}
                                            helperText={
                                                fieldState.error?.message
                                            }
                                            fullWidth
                                        />
                                    )}
                                />
                                <Controller
                                    name="expDate"
                                    control={control}
                                    rules={{
                                        required: 'To pole jest wymagane',
                                    }}
                                    render={({ field, fieldState }) => (
                                        <DatePicker
                                            label="Data wygaśnięcia"
                                            value={field.value}
                                            onChange={field.onChange}
                                            renderInput={(params) => (
                                                <TextField
                                                    {...params}
                                                    error={!!fieldState.error}
                                                    helperText={
                                                        fieldState.error
                                                            ?.message
                                                    }
                                                    fullWidth
                                                />
                                            )}
                                        />
                                    )}
                                />
                                { !pluginData &&
                                    <Controller
                                        name="license"
                                        control={control}
                                        rules={{
                                            required: 'To pole jest wymagane',
                                        }}
                                        render={({ field, fieldState }) => (
                                            <TextField
                                                {...field}
                                                label="Licencja"
                                                error={!!fieldState.error}
                                                helperText={
                                                    fieldState.error?.message
                                                }
                                                fullWidth
                                            />
                                        )}
                                    />
                                }
                                <Button
                                    type="submit"
                                    variant="contained"
                                    fullWidth
                                >
                                    Submit
                                </Button>
                            </Stack>
                        </form>
                    </LocalizationProvider>
                </Stack>
            </Stack>
        </PluginsDrawer>
    );
};
export default TenantPluginsEdit;
