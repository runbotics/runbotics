import { VFC } from 'react';

import { Dialog } from '@mui/material';
import { Tenant } from 'runbotics-common';

export interface PluginDialogProps {
    isVisible: boolean;
    tenantData: Tenant | null;
    onClose?: () => void;
}

export const PluginDialog: VFC<PluginDialogProps> = ({ isVisible, tenantData, onClose }) => (
    <Dialog open={isVisible} onClose={onClose} />
);
