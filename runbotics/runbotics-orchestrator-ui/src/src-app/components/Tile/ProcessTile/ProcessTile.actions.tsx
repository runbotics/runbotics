import React, { useState, VFC, useContext } from 'react';

import MoreVertIcon from '@mui/icons-material/MoreVert';
import { IconButton, Menu, MenuItem } from '@mui/material';

import { useSnackbar } from 'notistack';
import { FeatureKey, IProcess, Role } from 'runbotics-common';



import If from '#src-app/components/utils/If';
import useFeatureKey from '#src-app/hooks/useFeatureKey';
import { useProcessOwner } from '#src-app/hooks/useProcessOwner';
import useRole from '#src-app/hooks/useRole';
import useTranslations from '#src-app/hooks/useTranslations';
import { ProcessPageContext } from '#src-app/providers/ProcessPage.provider';
import { processActions } from '#src-app/store/slices/Process';


import DeleteProcess from '#src-app/views/process/DeleteProcess';
import EditProcessDialog from '#src-app/views/process/EditProcessDialog';

import { ProcessTileProps } from './ProcessTile.types';
import { useDispatch } from '../../../store';




const ProcessTileActions: VFC<ProcessTileProps> = ({ process }) => {
    const dispatch = useDispatch();
    const { enqueueSnackbar } = useSnackbar();
    const { translate } = useTranslations();
    const { page, pageSize } = useContext(ProcessPageContext);
    const [anchorEl, setAnchorEl] = React.useState<HTMLElement>(null);
    const [showDialog, setShowDialog] = useState(false);
    const hasEditProcessAccess = useFeatureKey([FeatureKey.PROCESS_EDIT_INFO]);
    const hasDeleteProcessAccess = useFeatureKey([FeatureKey.PROCESS_DELETE]);
    const isAdmin = useRole([Role.ROLE_ADMIN]);
    const isProcessOwner = useProcessOwner(process);
    const hasModifyProcessAccess = isAdmin || isProcessOwner;

    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleEdit = async (processToSave: IProcess) => {
        try {
            await dispatch(processActions.updateProcess(processToSave));
            setShowDialog(false);
            await dispatch(
                processActions.getProcessesPage({
                    page,
                    size: pageSize,
                }),
            );
            enqueueSnackbar(
                translate('Component.Tile.Process.Update.Success', { name: process.name }),
                { variant: 'success' })
            ;
        } catch (e) {
            enqueueSnackbar(
                translate('Component.Tile.Process.Update.Failed', { name: process.name }),
                { variant: 'error' },
            );
        }
    };

    return (
        <>
            <If condition={hasModifyProcessAccess && (hasEditProcessAccess || hasDeleteProcessAccess)}>
                <IconButton aria-label={translate('Component.Tile.Process.Settings.AriaLabel')} onClick={handleClick} >
                    <MoreVertIcon />
                </IconButton>
                <Menu id="simple-menu" anchorEl={anchorEl} keepMounted open={!!anchorEl} onClose={handleClose}>
                    <If condition={hasEditProcessAccess}>
                        <MenuItem onClick={() => {
                            setShowDialog(true);
                            handleClose();
                        }}>
                            {translate('Common.Edit')}
                        </MenuItem>
                    </If>
                    <If condition={hasDeleteProcessAccess}>
                        <DeleteProcess process={process} />
                    </If>
                </Menu>
            </If>
            <If condition={hasEditProcessAccess && showDialog}>
                <EditProcessDialog
                    open
                    onClose={() => setShowDialog(false)}
                    onAdd={handleEdit}
                    process={process}
                />
            </If>
        </>
    );
};

export default ProcessTileActions;
