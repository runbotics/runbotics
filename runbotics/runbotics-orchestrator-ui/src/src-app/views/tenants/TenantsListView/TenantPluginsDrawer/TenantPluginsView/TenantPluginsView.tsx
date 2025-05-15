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

import { useSelector } from '#src-app/store';
import { tenantsSelector } from '#src-app/store/slices/Tenants';
import {
    ExpiredDate,
    PluginActivateButton, PluginDrawerTitle, PluginExpDate,
    PluginsDrawer, TenantName,
} from '#src-app/views/tenants/TenantsListView/TenantPluginsDrawer/TenantPluginsView/TenantPluginsView.styles';

const plugins = [
    {
        id: 1,
        pluginName: 'Plugin name1',
        expDate: '04/01/2025'
    },
    {
        id: 2,
        pluginName: 'Plugin name2',
        expDate: '04/02/2025'
    },
    {
        id: 3,
        pluginName: 'Plugin name3',
        expDate: '05/15/2033'
    },
    {
        id: 4,
        pluginName: 'Plugin name4',
        expDate: '05/15/2034'
    },
];

interface TenantPluginsViewProps {
    open: boolean,
    onClose: () => void,
    openEditDrawer: (data?) => void,
}

const TenantPluginsView: VFC<TenantPluginsViewProps> = ({open, onClose, openEditDrawer}) => {
    const { tenantPlugins } = useSelector(tenantsSelector);
    
    console.log(tenantPlugins.data);
    const isExpiredOverTwoWeeks = (expDateStr?: string): boolean => {
        if (!expDateStr) return false;

        const [month, day, year] = expDateStr.split('/');
        const expDate = new Date(`${year}-${month}-${day}`);
        const today = new Date();
        const twoWeeksAgo = new Date(today);
        twoWeeksAgo.setDate(today.getDate() - 14);

        return expDate <= twoWeeksAgo;
    };

    return (
        <PluginsDrawer anchor="right" open={open} onClose={onClose}>
            <Stack direction="column">
                <Stack direction="row" sx={{justifyContent: 'space-between', alignItems: 'center'}}>
                    <PluginDrawerTitle>
                        Manage plugins for <TenantName>Raiffeisen</TenantName>
                    </PluginDrawerTitle>
                    <IconButton onClick={onClose}>
                        <CloseIcon />
                    </IconButton>
                </Stack>
                <Divider />
                <PluginActivateButton onClick={() => openEditDrawer()} direction="row" spacing={2} padding={2} sx={{alignItems: 'center'}}>
                    <AddIcon color='secondary'/> <span>Activate new plugin</span>
                </PluginActivateButton>
                <Divider />
                
                <Stack direction="column" spacing={2} padding={2}>
                    { tenantPlugins.loading && <CircularProgress /> }
                    { tenantPlugins.data ? (
                        tenantPlugins.data.map((plugin) => {
                            const isExpired = isExpiredOverTwoWeeks(plugin.expDate);

                            return (
                                <Stack
                                    direction="row"
                                    key={plugin.id}
                                    sx={{ justifyContent: 'space-between', alignItems: 'center' }}
                                >
                                    <Stack direction="column">
                                        <Typography variant="h5">{plugin.pluginName}</Typography>
                                        <PluginExpDate>
                                            Expiration date:{' '}
                                            {isExpired ? (
                                                <ExpiredDate>{plugin.expDate}</ExpiredDate>
                                            ) : (
                                                plugin.expDate
                                            )}
                                        </PluginExpDate>
                                    </Stack>
                                    {isExpired && (
                                        <Button onClick={() => openEditDrawer(plugin)}>Extend</Button>
                                    )}
                                </Stack>
                            );
                        })
                    ) : (
                        !tenantPlugins.loading && <span>Brak pluginów dla tego tenanta</span>
                    )}
                </Stack>
            </Stack>
        </PluginsDrawer>
    );
};
export default TenantPluginsView;
