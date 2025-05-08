import DeleteIcon from '@mui/icons-material/Delete';
import {
    GridActionsCellItem,
    GridEnrichedColDef,
    GridRowParams,
    GridValueFormatterParams,
} from '@mui/x-data-grid';

import moment from 'moment';

import useTranslations from '#src-app/hooks/useTranslations';

import { ProcessNotificationRow, ProcessNotificationTableFields } from './NotificationTableComponent.types';

interface ColumnsActions {
    onDelete: (processSubscriber: ProcessNotificationRow) => Promise<void>;
}

const useProcessNotificationColumns = ({
    onDelete,
}: ColumnsActions): (GridEnrichedColDef & {
    field: ProcessNotificationTableFields;
})[] => {
    const { translate } = useTranslations();

    return [
        {
            field: ProcessNotificationTableFields.USER_EMAIL,
            headerName: translate('Process.Edit.Table.Columns.User'),
            flex: 0.4,
        },
        {
            field: ProcessNotificationTableFields.CUSTOM_EMAIL,
            headerName: translate('Process.Edit.Table.Columns.Email'),
            flex: 0.4,
            valueFormatter: (params: GridValueFormatterParams) =>
                params.value
                    ? params.value
                    : translate('Process.Edit.Table.EmailSameAsUser'),
        },
        {
            field: ProcessNotificationTableFields.SUBSCRIBED_AT,
            headerName: translate('Process.Edit.Table.Columns.SubscribedAt'),
            flex: 0.4,
            valueFormatter: (params: GridValueFormatterParams) =>
                moment(params.value as string).format('YYYY-MM-DD HH:mm'),
        },
        {
            field: ProcessNotificationTableFields.ACTIONS,
            headerName: translate('Process.Edit.Table.Columns.Actions'),
            type: 'actions',
            flex: 0.2,
            getActions: (params: GridRowParams<any>) => {
                const handleDeleteClick = () => {
                    if (onDelete) onDelete(params.row);
                };

                return [
                    <GridActionsCellItem
                        label={translate(
                            'Process.Edit.Table.Columns.Actions.Delete'
                        )}
                        icon={<DeleteIcon />}
                        onClick={handleDeleteClick}
                        key="delete"
                    />,
                ];
            },
        },
    ];
};

export default useProcessNotificationColumns;
