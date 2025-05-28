import { useSnackbar } from 'notistack';

import { License } from 'runbotics-common';

import { useDispatch } from '#src-app/store';

import { createTenantPlugin, fetchTenantPlugins, updateTenantPlugin } from '#src-app/store/slices/Tenants/Tenants.thunks';

export const useTenantPluginForm = (tenantId: string, translate: (key: string) => string, onCloseDrawer: () => void) => {
    const dispatch = useDispatch();

    const { enqueueSnackbar } = useSnackbar();

    const submit = async (data: License) => {
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
        
            dispatch(fetchTenantPlugins(tenantId));
            onCloseDrawer();
        }
        catch (error) {
            enqueueSnackbar(translate(error.errorKey), {
                variant: 'error',
            });
            onCloseDrawer();
        }
    };

    return {submit};
};
