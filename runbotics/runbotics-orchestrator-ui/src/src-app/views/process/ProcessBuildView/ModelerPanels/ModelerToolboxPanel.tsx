import React, { FC } from 'react';

import AddIcon from '@mui/icons-material/Add';
import LocationSearchingIcon from '@mui/icons-material/LocationSearching';
import RedoIcon from '@mui/icons-material/Redo';
import RemoveIcon from '@mui/icons-material/Remove';
import UndoIcon from '@mui/icons-material/Undo';
import { IconButton, Tooltip } from '@mui/material';


import { translate } from '#src-app/hooks/useTranslations';

import FloatingGroup from '../FloatingGroup';



interface ModelerToolboxPanelProps {
    onCenter: () => void;
    onZoomIn: () => void;
    onZoomOut: () => void;
    onUndo: () => void;
    onRedo: () => void;
    canUndo: boolean;
    canRedo: boolean;
}

const ModelerToolboxPanel: FC<ModelerToolboxPanelProps> = ({
    onCenter,
    onZoomIn,
    onZoomOut,
    onRedo,
    onUndo,
    canRedo,
    canUndo,
}) => (
    <FloatingGroup horizontalPosition="right" verticalPosition="bottom" withSeparator>
        <Tooltip title={translate('Process.MainView.Tooltip.Undo')}>
            <IconButton onClick={onUndo} disabled={canUndo}>
                <UndoIcon fontSize="small" />
            </IconButton>
        </Tooltip>
        <Tooltip title={translate('Process.MainView.Tooltip.Redo')}>
            <IconButton onClick={onRedo} disabled={canRedo}>
                <RedoIcon fontSize="small" />
            </IconButton>
        </Tooltip>
        <Tooltip title={translate('Process.MainView.Tooltip.Center')}>
            <IconButton onClick={onCenter}>
                <LocationSearchingIcon fontSize="small" />
            </IconButton>
        </Tooltip>
        <Tooltip title={translate('Process.MainView.Tooltip.ZoomIn')}>
            <IconButton onClick={onZoomIn}>
                <AddIcon fontSize="small" />
            </IconButton>
        </Tooltip>
        <Tooltip title={translate('Process.MainView.Tooltip.ZoomOut')}>
            <IconButton onClick={onZoomOut}>
                <RemoveIcon fontSize="small" />
            </IconButton>
        </Tooltip>
    </FloatingGroup>
);

export default ModelerToolboxPanel;
