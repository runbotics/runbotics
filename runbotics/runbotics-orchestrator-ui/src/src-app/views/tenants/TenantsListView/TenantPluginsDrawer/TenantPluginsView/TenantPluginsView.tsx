import React, { VFC } from 'react';

import AddIcon from '@mui/icons-material/Add';
import CloseIcon from '@mui/icons-material/Close';
import {
    Button,
    CircularProgress,
    Divider,
    IconButton,
    Stack,
    Typography,
} from '@mui/material';

import { Tenant } from 'runbotics-common/dist/model/api/tenant.model';

import useTranslations from '#src-app/hooks/useTranslations';
import { useSelector } from '#src-app/store';
import { tenantsSelector } from '#src-app/store/slices/Tenants';
import {
    PluginActivateButton, PluginBadge, PluginDate, PluginDrawerTitle,
    PluginExpDate,
    PluginsDrawer,
} from '#src-app/views/tenants/TenantsListView/TenantPluginsDrawer/TenantPluginsView/TenantPluginsView.styles';

import { isExpired, isExpiringSoon } from './utils';

interface TenantPluginsViewProps {
    open: boolean,
    onClose: () => void,
    openEditDrawer: (data?) => void,
    tenantData: Tenant;
}

const TenantPluginsView: VFC<TenantPluginsViewProps> = ({
    open,
    onClose,
    openEditDrawer,
    tenantData
}) => {
    const { plugins } = useSelector(tenantsSelector);
    const { translate } = useTranslations();

    const getBadgeText = (expired: boolean, expiringSoon: boolean) => {
        if (expired) return translate('Tenant.Plugins.View.Expiration.Date.Expired');
        if (expiringSoon) return translate('Tenant.Plugins.View.Expiration.Date.Expiring.Soon');
        return translate('Tenant.Plugins.View.Expiration.Date.Active');
    };


    const renderPlugin = (plugin) => {
        const expired = isExpired(plugin.expDate);
        const expiringSoon = isExpiringSoon(plugin.expDate);
        const displayDate = plugin.expDate?.slice(0, 10);
        const canExtend = !expired && expiringSoon;
        
        return (
            <Stack
                direction="row"
                key={plugin.id}
                sx={{
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    color: expired ? 'grey.500' : 'inherit'
                }}
            >
                <Stack direction="column">
                    <PluginBadge expired={expired} expiringSoon={expiringSoon}>
                        {getBadgeText(expired, expiringSoon)}
                    </PluginBadge>
                    <Typography
                        variant="h5"
                        style={{ color: expired ? 'grey.A400' : undefined }}
                    >
                        {plugin.pluginName}
                    </Typography>
                    {<PluginExpDate expired={expired}>
                        {translate('Tenant.Plugins.View.Expiration.Date')}
                        <PluginDate expired={expired} expiringSoon={expiringSoon}>
                            {displayDate}
                        </PluginDate>
                    </PluginExpDate>}
                </Stack>
                {canExtend && (
                    <Button onClick={() => openEditDrawer(plugin)}>{translate('Tenant.Plugins.View.Extend')}</Button>
                )}
            </Stack>
        );
    };

    return (
        <PluginsDrawer anchor="right" open={open} onClose={onClose}>
            <Stack direction="column">
                <Stack direction="row" sx={{ justifyContent: 'space-between', alignItems: 'center' }}>
                    <PluginDrawerTitle>
                        {translate('Tenant.Plugins.View.Title')}{tenantData?.name}
                    </PluginDrawerTitle>
                    <IconButton onClick={onClose}>
                        <CloseIcon />
                    </IconButton>
                </Stack>
                <Divider />
                <PluginActivateButton
                    onClick={() => openEditDrawer()}
                    direction="row"
                    spacing={2}
                    padding={2}
                    sx={{ alignItems: 'center' }}
                >
                    <AddIcon color='secondary' /> <span>{translate('Tenant.Plugins.View.AddNew')}</span>
                </PluginActivateButton>
                <Divider />
                <Stack direction="column" spacing={2} padding={2}>
                    {plugins.all.loading && <CircularProgress />}
                    {plugins.all.data && plugins.all.data.length > 0 ? (
                        plugins.all.data.map(renderPlugin)
                    ) : (
                        !plugins.all.loading && <span>{translate('Tenant.Plugins.View.Empty.List')}</span>
                    )}
                </Stack>
            </Stack>
        </PluginsDrawer>
    );
};

export default TenantPluginsView;
