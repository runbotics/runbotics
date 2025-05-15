import { useState, VFC } from 'react';

import TenantPluginsEdit
    from '#src-app/views/tenants/TenantsListView/TenantPluginsDrawer/TenantPluginsEdit/TenantPluginsEdit';
import TenantPluginsView
    from '#src-app/views/tenants/TenantsListView/TenantPluginsDrawer/TenantPluginsView/TenantPluginsView';

interface TenantPluginsDrawerProps {
    open: boolean,
    onClose: () => void,
}

const TenantPluginsDrawer: VFC<TenantPluginsDrawerProps> = ({open, onClose}) => {
    const [isEditDrawerOpen, setIsEditDrawerOpen] = useState(false);
    const [pluginData, setPluginData] = useState({
        id: '',
        pluginName: '',
        expDate: ''
    });
    
    const openEditDrawer = (data?) => {
        setPluginData(data);
        setIsEditDrawerOpen(true);
        
    };

    const closeEditDrawer = () => {
        setIsEditDrawerOpen(false);
        setPluginData({
            id: '',
            pluginName: '',
            expDate: ''
        });
    };
    
    return (
        <>
            <TenantPluginsView open={open} onClose={onClose} openEditDrawer={openEditDrawer} />
            <TenantPluginsEdit
                open={isEditDrawerOpen}
                onClose={closeEditDrawer}
                pluginData={pluginData}
            />
        </>
    ); 
};

export default TenantPluginsDrawer;
