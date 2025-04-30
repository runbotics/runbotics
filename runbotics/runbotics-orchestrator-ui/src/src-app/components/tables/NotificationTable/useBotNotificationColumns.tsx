import DeleteIcon from '@mui/icons-material/Delete';
import {
    GridActionsCellItem,
    GridEnrichedColDef,
    GridRowParams,
    GridValueFormatterParams,
} from '@mui/x-data-grid';

import moment from 'moment';

import useTranslations from '#src-app/hooks/useTranslations';

import { BotNotificationRow } from './NotificationTableComponent.types';
import { SubscriberBotTableFields } from './NotificationTableComponent.utils';

interface ColumnsActions {
    onDelete: (botSubscriber: BotNotificationRow) => Promise<void>;
}

const useBotNotificationColumns = ({
    onDelete,
}: ColumnsActions): (GridEnrichedColDef & {
    field: SubscriberBotTableFields;
})[] => {
    const { translate } = useTranslations();

    return [
        {
            field: 'userEmail',
            headerName: translate('Bot.Edit.Table.Columns.User'),
            flex: 0.4,
        },
        {
            field: 'subscribedAt',
            headerName: translate('Bot.Edit.Table.Columns.SubscribedAt'),
            flex: 0.4,
            valueFormatter: (params: GridValueFormatterParams) =>
                moment(params.value as string).format('YYYY-MM-DD HH:mm'),
        },
        {
            field: 'actions',
            headerName: translate('Bot.Edit.Table.Columns.Actions'),
            type: 'actions',
            flex: 0.2,
            getActions: (params: GridRowParams<any>) => {
                const handleDeleteClick = () => {
                    if (onDelete) onDelete(params.row);
                };

                return [
                    <GridActionsCellItem
                        label={translate(
                            'Bot.Edit.Table.Columns.Actions.Delete'
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

export default useBotNotificationColumns;
