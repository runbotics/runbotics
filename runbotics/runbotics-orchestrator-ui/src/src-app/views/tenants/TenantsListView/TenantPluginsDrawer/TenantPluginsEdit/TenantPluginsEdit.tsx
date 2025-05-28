import React, { useEffect, VFC } from 'react';

import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { Divider, IconButton, Stack } from '@mui/material';

import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { useForm } from 'react-hook-form';

import { Tenant } from 'runbotics-common';

import useTranslations from '#src-app/hooks/useTranslations';
import {
    PluginDrawerTitle, PluginsDrawer,
} from '#src-app/views/tenants/TenantsListView/TenantPluginsDrawer/TenantPluginsView/TenantPluginsView.styles';

import TenantPluginForm from './TenantPluginsForm';
import { useTenantPluginForm } from './useTenantPluginForm';

interface TenantPluginsEditProps {
    open: boolean,
    onClose: () => void,
    pluginData?: any,
    tenantData: Tenant
}

export interface PluginFormData {
    id?: string;
    pluginName: string;
    expDate: Date | null | string;
    licenseKey: string;
    license: string;
    tenantId: string;
}

const TenantPluginsEdit: VFC<TenantPluginsEditProps> = ({open, onClose, pluginData, tenantData}) => {
    const { translate } = useTranslations();
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
    
    const onCloseDrawer = () => {
        reset();
        onClose();
    };

    const { submit } = useTenantPluginForm(tenantData?.id, translate, onCloseDrawer);

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
                    {pluginData?.id
                        ? <PluginDrawerTitle>{translate('Tenant.Plugins.edit.editTitle') +  pluginData.pluginName}</PluginDrawerTitle> 
                        : <PluginDrawerTitle>{translate('Tenant.Plugins.edit.createTitle')}</PluginDrawerTitle>
                    }
                </Stack>
                <Divider />
                <Divider />
                <Stack direction="column" spacing={2} padding={2}>
                    <LocalizationProvider dateAdapter={AdapterDateFns}>
                        <TenantPluginForm 
                            control={control}
                            handleSubmit={handleSubmit}
                            onSubmit={submit}
                            translate={translate}
                            isEdit={!!pluginData?.id}
                        />
                    </LocalizationProvider>
                </Stack>
            </Stack>
        </PluginsDrawer>
    );
};
export default TenantPluginsEdit;
