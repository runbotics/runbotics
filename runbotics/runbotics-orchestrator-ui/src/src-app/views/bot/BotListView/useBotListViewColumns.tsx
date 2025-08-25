import DeleteIcon from '@mui/icons-material/Delete';
import { GridActionsCellItem, GridCellParams, GridEnrichedColDef, GridRowParams } from '@mui/x-data-grid';

import moment from 'moment';

import { BotStatus, IBot } from 'runbotics-common';

import Label from '#src-app/components/Label';
import useTranslations from '#src-app/hooks/useTranslations';
import { capitalizeFirstLetter } from '#src-app/utils/text';

interface BotListViewColumnsActions {
    onDelete: (globalVariable: IBot) => void;
}

const useBotListViewColumns = ({
    onDelete,
}: BotListViewColumnsActions): GridEnrichedColDef[] => {
    const { translate } = useTranslations();

    const getBotStatusColor = (status: BotStatus) => {
        if (status === BotStatus.CONNECTED) return 'success';
        if (status === BotStatus.DISCONNECTED) return 'error';
        return 'warning';
    };

    return [
        {
            field: 'installationId',
            headerName: translate('Bot.ListView.Results.Table.Header.InstallationId'),
            sortable: false,
            filterable: false,
            disableColumnMenu: true,
            flex: 0.3,
        },
        {
            field: 'user',
            headerName: translate('Bot.ListView.Results.Table.Header.User'),
            sortable: false,
            filterable: false,
            disableColumnMenu: true,
            flex: 0.4,
            renderCell: (params: GridCellParams) => params.row.user?.email
        },
        {
            field: 'status',
            headerName: translate('Bot.ListView.Results.Table.Header.Status'),
            sortable: false,
            filterable: false,
            disableColumnMenu: true,
            flex: 0.3,
            renderCell: (params: GridCellParams) => {
                const formattedStatus = capitalizeFirstLetter({
                    text: params.row.status,
                    lowerCaseRest: true,
                    delimiter: /_| /,
                });

                return (
                    <Label color={getBotStatusColor(params.row.status)}>
                        {/* @ts-ignore */}
                        {translate(`Bot.ListView.Results.Table.Status.${formattedStatus}`)}
                    </Label>
                );
            }
        },
        {
            field: 'collection',
            headerName: translate('Bot.ListView.Results.Table.Header.Collection'),
            sortable: false,
            filterable: false,
            disableColumnMenu: true,
            flex: 0.3,
            renderCell: (params: GridCellParams) =>
                params.row.collection?.name,
        },
        {
            field: 'system',
            headerName: translate('Bot.ListView.Results.Table.Header.System'),
            sortable: false,
            filterable: false,
            disableColumnMenu: true,
            flex: 0.2,
            renderCell: (params: GridCellParams) =>
                params.row.system?.name
                    ? capitalizeFirstLetter({ text: params.row.system?.name })
                    : '',
        },
        {
            field: 'version',
            headerName: translate('Bot.ListView.Results.Table.Header.Version'),
            sortable: false,
            filterable: false,
            disableColumnMenu: true,
            flex: 0.3,
        },
        {
            field: 'lastConnected',
            headerName: translate('Bot.ListView.Results.Table.Header.LastConnected'),
            sortable: false,
            filterable: false,
            disableColumnMenu: true,
            flex: 0.3,
            renderCell: (params: GridCellParams) =>
                moment(params.row.lastConnected).format('YYYY-MM-DD HH:mm'),
        },
        {
            field: 'actions',
            type: 'actions',
            flex: 0.1,
            sortable: false,
            filterable: false,
            disableColumnMenu: true,
            getActions: (params: GridRowParams<IBot>) => {
                const handleDeleteClick = () => {
                    onDelete(params.row);
                };

                return [
                    <GridActionsCellItem
                        label={translate('Bot.Actions.Delete.Title')}
                        onClick={handleDeleteClick}
                        icon={<DeleteIcon />}
                        showInMenu={true}
                        key="delete"
                        placeholder=""
                        onPointerEnterCapture={() => {}}
                        onPointerLeaveCapture={() => {}}
                    />,
                ];
            },
        },
    ];
};

export default useBotListViewColumns;
