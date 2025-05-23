import React, { useEffect, VFC } from 'react';

import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { Button, Divider, IconButton, Stack, TextField } from '@mui/material';

import { DatePicker } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { useSnackbar } from 'notistack';
import { Controller, useForm } from 'react-hook-form';

import { Tenant } from 'runbotics-common';

import useTranslations from '#src-app/hooks/useTranslations';
import { useDispatch } from '#src-app/store';
import { createTenantPlugin, fetchTenantPlugins, updateTenantPlugin } from '#src-app/store/slices/Tenants/Tenants.thunks';
import {
    PluginDrawerTitle, PluginsDrawer,
} from '#src-app/views/tenants/TenantsListView/TenantPluginsDrawer/TenantPluginsView/TenantPluginsView.styles';

interface TenantPluginsEditProps {
    open: boolean,
    onClose: () => void,
    pluginData?: any,
    tenantData: Tenant
}

export interface PluginFormData {
    id?: string;
    pluginName: string;
    expDate: Date | null;
    licenseKey: string;
    license: string;
    tenantId: string;
}

// eslint-disable-next-line max-lines-per-function
const TenantPluginsEdit: VFC<TenantPluginsEditProps> = ({open, onClose, pluginData, tenantData}) => {
    const dispatch = useDispatch();
    const { translate } = useTranslations();
    const { enqueueSnackbar } = useSnackbar();
    const { control, handleSubmit, reset } = useForm<PluginFormData>({
        defaultValues: {
            pluginName: pluginData?.pluginName || '',
            tenantId: tenantData?.id || '',
            licenseKey: pluginData?.licenseKey || '',
            license: pluginData?.license || '',
            expDate: pluginData?.expDate ?? null,
            id: pluginData?.id,
        },
    });
    
    const onSubmit = async (data) => {
        const formattedDate = new Date(data.expDate);
        const formattedData = {
            ...data,
            expDate: formattedDate.toISOString().split('T')[0],
        };

        try{
            if(data.id) {
                await dispatch(updateTenantPlugin(formattedData)).unwrap();
                enqueueSnackbar(translate('Tenants.List.Edit.Form.Event.Success'), {
                    variant: 'success',
                });
            }
            else {
                await dispatch(createTenantPlugin(formattedData)).unwrap();
                enqueueSnackbar(translate('Tenants.List.Edit.Form.Event.Success'), {
                    variant: 'success',
                });
            }

            dispatch(fetchTenantPlugins(tenantData.id));
            onCloseDrawer();
        }
        catch (error) {
            enqueueSnackbar(translate(error.errorKey), {
                variant: 'error',
            });
            onCloseDrawer();
        }
    };
    
    const onCloseDrawer = () => {
        reset();
        onClose();
    };

    useEffect(() => {
        reset({
            pluginName: pluginData?.pluginName || '',
            tenantId: tenantData?.id || '',
            licenseKey: pluginData?.licenseKey || '',
            license: pluginData?.license || '',
            expDate: pluginData?.expDate ?? null,
            id: pluginData?.id,
        });
    }, [pluginData, tenantData, reset]);
    
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
                    {pluginData?.id ? (<PluginDrawerTitle>{translate('Tenant.Plugins.edit.editTitle') +  pluginData.pluginName}</PluginDrawerTitle>) : (<PluginDrawerTitle>{translate('Tenant.Plugins.edit.createTitle')}</PluginDrawerTitle>)}
                </Stack>
                <Divider />
                <Divider />
                <Stack direction="column" spacing={2} padding={2}>
                    <LocalizationProvider dateAdapter={AdapterDateFns}>
                        <form onSubmit={handleSubmit(onSubmit)}>
                            <Stack spacing={2}>
                                {!pluginData?.id && <Controller
                                    name="pluginName"
                                    control={control}
                                    rules={{
                                        required: translate('Tenant.Plugins.edit.required'),
                                    }}
                                    render={({ field, fieldState }) => (
                                        <TextField
                                            {...field}
                                            label={translate('Tenant.Plugins.edit.pluginName')}
                                            error={!!fieldState.error}
                                            helperText={
                                                fieldState.error?.message
                                            }
                                            fullWidth
                                        />
                                    )}
                                />}
                                <Controller
                                    name="expDate"
                                    control={control}
                                    rules={{
                                        required: translate('Tenant.Plugins.edit.required'),
                                    }}
                                    render={({ field, fieldState }) => (
                                        <DatePicker
                                            label={translate('Tenant.Plugins.edit.expDate')}
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
                                <Controller
                                    name="license"
                                    control={control}
                                    rules={{
                                        required: translate('Tenant.Plugins.edit.required'),
                                    }}
                                    render={({ field, fieldState }) => (
                                        <TextField
                                            {...field}
                                            label={translate('Tenant.Plugins.edit.license')}
                                            error={!!fieldState.error}
                                            helperText={
                                                fieldState.error?.message
                                            }
                                            fullWidth
                                        />
                                    )}
                                />
                                <Controller
                                    name="licenseKey"
                                    control={control}
                                    rules={{
                                        required: translate('Tenant.Plugins.edit.required'),
                                    }}
                                    render={({ field, fieldState }) => (
                                        <TextField
                                            {...field}
                                            label={translate('Tenant.Plugins.edit.licenseKey')}
                                            error={!!fieldState.error}
                                            helperText={
                                                fieldState.error?.message
                                            }
                                            fullWidth
                                        />
                                    )}
                                />
                                <Button
                                    type="submit"
                                    variant="contained"
                                    fullWidth
                                >
                                    {translate('Tenant.Plugins.edit.Submit')}
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
