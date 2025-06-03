import EditIcon from '@mui/icons-material/Edit';
import WidgetsOutlinedIcon from '@mui/icons-material/WidgetsOutlined';
import { Link, IconButton, Stack } from '@mui/material';
import { GridColDef, GridValueFormatterParams } from '@mui/x-data-grid';
import { BasicUserDto } from 'runbotics-common';

import useTranslations from '#src-app/hooks/useTranslations';
import { formatDate } from '#src-app/utils/dateFormat';

import { TenantField } from '../../TenantsBrowseView/TenantsBrowseView.utils';

const useTenantsListColumns = (pageSize, openTenantEditDialog, openTenantPluginDrawer): GridColDef[] => {
    const { translate } = useTranslations();
    return [
        {
            field: TenantField.NAME,
            headerName: translate('Tenants.List.Table.Columns.Name'),
            filterable: false,
            flex: 0.6,
            renderCell: (params) => (
                <Link
                    href={`users/pending?page=0&pageSize=${pageSize}&tenantId=${params.row.id}`}
                    style={{ textDecoration: 'none' }}
                >
                    {params.value}
                </Link>
            )
        },
        {
            field: TenantField.CREATED_BY,
            headerName: translate('Tenants.List.Table.Columns.CreatedBy'),
            filterable: false,
            flex: 0.6,
            valueFormatter: (params: GridValueFormatterParams<BasicUserDto>) => params.value.email
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
        },
        {
            field: TenantField.PLUGINS,
            headerName: translate('Tenants.List.Table.Columns.Plugins'),
            filterable: false,
            flex: 0.5,
            renderCell: (params) => (
                <Stack 
                    onClick={() => openTenantPluginDrawer(params.row)}
                    direction='row' 
                    spacing={1} 
                    useFlexGap
                >
                    <WidgetsOutlinedIcon style={{ fontSize: '22px' }}/>
                    <span>{ params.value }{translate('Tenants.List.Table.Columns.Plugins.Count')}</span>
                </Stack>
            )
        },
        {
            field: TenantField.EDIT,
            headerName: translate('Tenants.List.Table.Columns.Edit'),
            filterable: false,
            flex: 0.2,
            renderCell: (params) => (
                <IconButton onClick={() => openTenantEditDialog(params.row)} size="small">
                    <EditIcon style={{ fontSize: '22px' }} />
                </IconButton>
            )
        }
    ];
};

export default useTenantsListColumns;
