import { IconButton, Menu, MenuItem } from '@mui/material';
import React, { useState, VFC, useContext } from 'react';
import { processActions } from 'src/store/slices/Process';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import DeleteProcess from 'src/views/process/DeleteProcess';
import EditProcessDialog from 'src/views/process/EditProcessDialog';
import { FeatureKey, IProcess } from 'runbotics-common';
import { useSnackbar } from 'notistack';
import { ProcessPageContext } from 'src/providers/ProcessPage.provider';
import useTranslations from 'src/hooks/useTranslations';
import useFeatureKey from 'src/hooks/useFeatureKey';
import If from 'src/components/utils/If';
import { ProcessTileProps } from './ProcessTile.types';
import { useDispatch } from '../../../store';

const ProcessTileActions: VFC<ProcessTileProps> = ({ process }) => {
    const dispatch = useDispatch();
    const { enqueueSnackbar } = useSnackbar();
    const { translate } = useTranslations();
    const { page, pageSize } = useContext(ProcessPageContext);
    const [anchorEl, setAnchorEl] = React.useState<HTMLElement>(null);
    const [showDialog, setShowDialog] = useState(false);
    const hasAccessToEditProcess = useFeatureKey([FeatureKey.PROCESS_EDIT_INFO]);
    const hasAccessToDeleteProcess = useFeatureKey([FeatureKey.PROCESS_DELETE]);

    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleEdit = async (processToSave: IProcess) => {
        try {
            await dispatch(processActions.saveProcess(processToSave));
            setShowDialog(false);
            await dispatch(
                processActions.getProcessesPage({
                    page,
                    size: pageSize,
                }),
            );
        } catch (e) {
            enqueueSnackbar(
                translate('Component.Tile.Process.Update.Failed', { name: process.name }),
                { variant: 'error' },
            );
        }
    };

    return (
        <>
            <IconButton aria-label={translate('Component.Tile.Process.Settings.AriaLabel')} onClick={handleClick}>
                <MoreVertIcon />
            </IconButton>
            <Menu id="simple-menu" anchorEl={anchorEl} keepMounted open={!!anchorEl} onClose={handleClose}>
                <If condition={hasAccessToEditProcess}>
                    <MenuItem onClick={() => setShowDialog(true)}>{translate('Common.Edit')}</MenuItem>
                </If>
                <If condition={hasAccessToDeleteProcess}>
                    <DeleteProcess process={process} />
                </If>
            </Menu>
            <If condition={hasAccessToEditProcess}>
                <EditProcessDialog
                    open={showDialog}
                    onClose={() => setShowDialog(false)}
                    onAdd={handleEdit}
                    process={process}
                />
            </If>
        </>
    );
};

export default ProcessTileActions;
