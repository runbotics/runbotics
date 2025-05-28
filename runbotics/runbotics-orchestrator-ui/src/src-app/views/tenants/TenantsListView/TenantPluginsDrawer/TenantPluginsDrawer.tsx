import { useState, VFC } from 'react';

import { License, Tenant } from 'runbotics-common';

import TenantPluginsEdit
    from '#src-app/views/tenants/TenantsListView/TenantPluginsDrawer/TenantPluginsEdit/TenantPluginsEdit';
import TenantPluginsView
    from '#src-app/views/tenants/TenantsListView/TenantPluginsDrawer/TenantPluginsView/TenantPluginsView';

interface TenantPluginsDrawerProps {
    open: boolean,
    onClose: () => void,
    tenantData: Tenant | undefined;
}

const TenantPluginsDrawer: VFC<TenantPluginsDrawerProps> = ({open, onClose, tenantData}) => {
    const [isEditDrawerOpen, setEditDrawerOpen] = useState(false);
    const [pluginData, setPluginData] = useState<License>();
    
    const openEditDrawer = (data?: License) => {
        setPluginData(
            {
                ...data,
                tenantId: tenantData.id,
            }
        );
        setEditDrawerOpen(true);
    };

    const closeEditDrawer = () => {
        setEditDrawerOpen(false);
        setPluginData(null);
    };
    
    return (
        <>
            <TenantPluginsView open={open} onClose={onClose} openEditDrawer={openEditDrawer} tenantData={tenantData}/>
            <TenantPluginsEdit
                open={isEditDrawerOpen}
                onClose={closeEditDrawer}
                pluginData={pluginData}
                tenantData={tenantData}
            />
        </>
    ); 
};

export default TenantPluginsDrawer;
