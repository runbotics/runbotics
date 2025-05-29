import DeleteIcon from '@mui/icons-material/Delete';
import {
    GridActionsCellItem,
    GridEnrichedColDef,
    GridRowParams,
    GridValueFormatterParams,
} from '@mui/x-data-grid';

import moment from 'moment';

import useTranslations from '#src-app/hooks/useTranslations';

import { NotificationRow, NotificationTableFields } from './NotificationTableComponent.types';
interface ColumnsActions {
    onDelete: (botSubscriber: NotificationRow) => Promise<void>;
}

const useBotNotificationColumns = ({
    onDelete,
}: ColumnsActions): (GridEnrichedColDef & {
    field: NotificationTableFields;
})[] => {
    const { translate } = useTranslations();

    return [
        {
            field: NotificationTableFields.EMAIL,
            headerName: translate('Bot.Edit.Table.Columns.Email'),
            flex: 0.4,
        },
        {
            field: NotificationTableFields.SUBSCRIBED_AT,
            headerName: translate('Bot.Edit.Table.Columns.SubscribedAt'),
            flex: 0.4,
            valueFormatter: (params: GridValueFormatterParams) =>
                moment(params.value as string).format('YYYY-MM-DD HH:mm'),
        },
        {
            field: NotificationTableFields.ACTIONS,
            headerName: translate('Bot.Edit.Table.Columns.Actions'),
            type: 'actions',
            flex: 0.2,
            getActions: (params: GridRowParams<any>) => {
                const handleDeleteClick = () => {
                    if (onDelete) onDelete(params.row);
                };

                return [
                    <GridActionsCellItem
                        label={translate('Bot.Edit.Table.Columns.Actions.Delete')}
                        icon={<DeleteIcon />}
                        onClick={handleDeleteClick}
                        key="delete"
                    />,
                ];
            },
        },
    ];
};

export default useBotNotificationColumns;
