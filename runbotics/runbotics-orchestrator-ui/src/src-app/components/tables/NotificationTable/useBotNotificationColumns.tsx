import DeleteIcon from '@mui/icons-material/Delete';
import {
    GridActionsCellItem,
    GridEnrichedColDef,
    GridRowParams,
    GridValueFormatterParams,
} from '@mui/x-data-grid';

import moment from 'moment';

import useTranslations from '#src-app/hooks/useTranslations';

import { BotNotificationRow, BotNotificationTableFields } from './NotificationTableComponent.types';
interface ColumnsActions {
    onDelete: (botSubscriber: BotNotificationRow) => Promise<void>;
}

const useBotNotificationColumns = ({
    onDelete,
}: ColumnsActions): (GridEnrichedColDef & {
    field: BotNotificationTableFields;
})[] => {
    const { translate } = useTranslations();

    return [
        {
            field: BotNotificationTableFields.USER_EMAIL,
            headerName: translate('Bot.Edit.Table.Columns.User'),
            flex: 0.4,
        },
        {
            field: BotNotificationTableFields.SUBSCRIBED_AT,
            headerName: translate('Bot.Edit.Table.Columns.SubscribedAt'),
            flex: 0.4,
            valueFormatter: (params: GridValueFormatterParams) =>
                moment(params.value as string).format('YYYY-MM-DD HH:mm'),
        },
        {
            field: BotNotificationTableFields.ACTIONS,
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
