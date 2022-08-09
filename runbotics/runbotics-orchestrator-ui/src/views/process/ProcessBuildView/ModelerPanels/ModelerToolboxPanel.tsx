import React, { FC } from 'react';
import LocationSearchingIcon from '@mui/icons-material/LocationSearching';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import { IconButton } from '@mui/material';
import FloatingGroup from '../FloatingGroup';

interface ModelerToolboxPanelProps {
    onCenter: () => void;
    onZoomIn: () => void;
    onZoomOut: () => void;
}

const ModelerToolboxPanel: FC<ModelerToolboxPanelProps> = ({ onCenter, onZoomIn, onZoomOut }) => (
    <FloatingGroup horizontalPosition="right" verticalPosition="bottom" withSeparator>
        <IconButton onClick={onCenter}>
            <LocationSearchingIcon fontSize="small" />
        </IconButton>
        <IconButton onClick={onZoomIn}>
            <AddIcon fontSize="small" />
        </IconButton>
        <IconButton onClick={onZoomOut}>
            <RemoveIcon fontSize="small" />
        </IconButton>
    </FloatingGroup>
);

export default ModelerToolboxPanel;
