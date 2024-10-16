import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import {
    GridActionsCellItem,
    GridCellParams,
    GridValueFormatterParams,
    GridEnrichedColDef,
    GridRowParams,
} from '@mui/x-data-grid';
import moment from 'moment';

import { Role } from 'runbotics-common';

import { useOwner } from '#src-app/hooks/useOwner';
import useRole from '#src-app/hooks/useRole';
import useTranslations from '#src-app/hooks/useTranslations';
import { IGlobalVariable } from '#src-app/types/model/global-variable.model';
import { IUser, UserDTO } from '#src-app/types/model/user.model';

interface ColumnsActions {
    onDelete: (globalVariable: IGlobalVariable) => void;
    onEdit: (globalVariable: IGlobalVariable) => void;
    hasEditVariableAccess: boolean;
    hasDeleteVariableAccess: boolean;
    globalVariables: IGlobalVariable[];
}

const useGlobalVariablesColumns = ({
    onEdit,
    onDelete,
    hasEditVariableAccess,
    hasDeleteVariableAccess,
    globalVariables,
}: ColumnsActions): GridEnrichedColDef[] => {
    const { translate } = useTranslations();
    const isGlobalVariableOwner = useOwner();
    const isTenantAdmin = useRole([Role.ROLE_TENANT_ADMIN]);
    const isActionsColumnHidden = globalVariables.every(({ creator }) =>
        !(isTenantAdmin || isGlobalVariableOwner(creator.id))
    );

    return [
        {
            field: 'name',
            headerName: translate('Variables.ListView.Table.Header.Name'),
            flex: 0.6,
        },
        {
            field: 'description',
            headerName: translate('Variables.ListView.Table.Header.Description'),
            flex: 1,
        },
        {
            field: 'type',
            headerName: translate('Variables.ListView.Table.Header.Type'),
            flex: 0.4,
        },
        {
            field: 'lastModified',
            headerName: translate('Variables.ListView.Table.Header.LastModified'),
            flex: 0.5,
            valueFormatter: (params: GridValueFormatterParams) =>
                moment(params.value as string).format('YYYY-MM-DD HH:mm'),
        },
        {
            field: 'createdBy',
            headerName: translate('Variables.ListView.Table.Header.CreatedBy'),
            flex: 0.8,
            renderCell: (params: GridCellParams) => {
                const creator = params.row.creator as UserDTO;
                return creator?.login ?? '';
            },
        },
        {
            field: 'modifiedBy',
            headerName: translate('Variables.ListView.Table.Header.ModifiedBy'),
            flex: 0.8,
            renderCell: (params: GridCellParams) => {
                const user = params.row.user as IUser;
                return user?.login ?? '';
            },
        },
        {
            field: 'actions',
            type: 'actions',
            flex: 0.1,
            hide: isActionsColumnHidden,
            getActions: (params: GridRowParams<IGlobalVariable>) => {
                const creator = params.row.creator as UserDTO;

                const handleEditClick = () => {
                    if (onEdit) onEdit(params.row);
                };
                const handleDeleteClick = () => {
                    if (onDelete) onDelete(params.row);
                };
                const gridActions = [
                    <GridActionsCellItem
                        icon={<EditIcon />}
                        label={translate('Variables.ListView.Table.Actions.Edit')}
                        onClick={handleEditClick}
                        showInMenu={hasEditVariableAccess}
                        key="edit"
                    />,
                    <GridActionsCellItem
                        label={translate('Variables.ListView.Table.Actions.Delete')}
                        icon={<DeleteIcon />}
                        onClick={handleDeleteClick}
                        showInMenu={hasDeleteVariableAccess}
                        key="delete"
                    />,
                ];
                return (isTenantAdmin || isGlobalVariableOwner(creator.id)) ? gridActions : [];
            },
        },
    ];
};

export default useGlobalVariablesColumns;
