import { GridColDef, GridValueFormatterParams } from '@mui/x-data-grid';
import { UserDTO } from 'runbotics-common';

import useTranslations from '#src-app/hooks/useTranslations';
import { formatDate } from '#src-app/utils/dateFormat';

import { TenantField } from '../../TenantsBrowseView/TenantsBrowseView.utils';

const useTenantsListColumns = (): GridColDef[] => {
    const { translate } = useTranslations();

    return [
        {
            field: TenantField.NAME,
            headerName: translate('Tenants.List.Table.Columns.Name'),
            filterable: false,
            flex: 0.6
        },
        {
            field: TenantField.CREATED_BY,
            headerName: translate('Tenants.List.Table.Columns.CreatedBy'),
            filterable: false,
            flex: 0.6,
            valueFormatter: (params: GridValueFormatterParams<UserDTO>) => params.value.login
        },
        {
            field: TenantField.CREATED_DATE,
            headerName: translate('Tenants.List.Table.Columns.CreatedDate'),
            filterable: false,
            flex: 0.5,
            valueFormatter: (params: GridValueFormatterParams) => formatDate(params.value)
        },
        {
            field: TenantField.UPDATED_DATE,
            headerName: translate('Tenants.List.Table.Columns.UpdatedDate'),
            filterable: false,
            flex: 0.5,
            valueFormatter: (params: GridValueFormatterParams) => formatDate(params.value)
        },
        {
            field: TenantField.LAST_MODIFIED_BY,
            headerName: translate('Tenants.List.Table.Columns.LastModifiedBy'),
            filterable: false,
            flex: 0.5
        }
    ];
};

export default useTenantsListColumns;
