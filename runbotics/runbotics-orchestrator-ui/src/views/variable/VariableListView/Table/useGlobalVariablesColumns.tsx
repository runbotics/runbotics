import {
    GridActionsCellItem,
    GridCellParams,
    GridValueFormatterParams,
    GridEnrichedColDef,
    GridRowParams,
} from '@mui/x-data-grid';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import moment from 'moment';
import { IGlobalVariable } from 'src/types/model/global-variable.model';
import { IUser } from 'src/types/model/user.model';
import useTranslations from 'src/hooks/useTranslations';

interface ColumnsActions {
    onDelete: (globalVariable: IGlobalVariable) => void;
    onEdit: (globalVariable: IGlobalVariable) => void;
    hasEditVariableAccess: boolean;
    hasDeleteVariableAccess: boolean;
}

const useGlobalVariablesColumns = ({
    onEdit,
    onDelete,
    hasEditVariableAccess,
    hasDeleteVariableAccess,
}: ColumnsActions): GridEnrichedColDef[] => {
    const { translate } = useTranslations();

    return [
        {
            field: 'name',
            headerName: translate('Variables.ListView.Table.Header.Name'),
            flex: 0.8,
        },
        {
            field: 'description',
            headerName: translate('Variables.ListView.Table.Header.Description'),
            flex: 1,
        },
        {
            field: 'type',
            headerName: translate('Variables.ListView.Table.Header.Type'),
            flex: 0.5,
        },
        {
            field: 'lastModified',
            headerName: translate('Variables.ListView.Table.Header.LastModified'),
            flex: 0.5,
            valueFormatter: (params: GridValueFormatterParams) =>
                moment(params.value as string).format('YYYY-MM-DD HH:mm'),
        },
        {
            field: 'modifiedBy',
            headerName: translate('Variables.ListView.Table.Header.ModifiedBy'),
            flex: 0.6,
            renderCell: (params: GridCellParams) => {
                const user = params.row.user as IUser;
                return user.login;
            },
        },
        {
            field: 'actions',
            type: 'actions',
            getActions: (params: GridRowParams<IGlobalVariable>) => {
                const handleEditClick = () => {
                    if (onEdit) {
                        onEdit(params.row);
                    }
                };
                const handleDeleteClick = () => {
                    if (onDelete) {
                        onDelete(params.row);
                    }
                };
                return [
                    <GridActionsCellItem
                        icon={<EditIcon />}
                        label={translate('Variables.ListView.Table.Actions.Edit')}
                        onClick={handleEditClick}
                        showInMenu={hasEditVariableAccess}
                    />,
                    <GridActionsCellItem
                        label={translate('Variables.ListView.Table.Actions.Delete')}
                        icon={<DeleteIcon />}
                        onClick={handleDeleteClick}
                        showInMenu={hasDeleteVariableAccess}
                    />,
                ];
            },
        },
    ];
};

export default useGlobalVariablesColumns;
