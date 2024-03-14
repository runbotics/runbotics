import { FC } from 'react';

import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import { MenuItem, ListItemText, ListItemIcon } from '@mui/material';

import { useSnackbar } from 'notistack';

import { translate } from '#src-app/hooks/useTranslations';

import { VariableCopyProps } from '../VariablesPanel';

const VariableCopy: FC<VariableCopyProps> = ({ menuId, handleMenuClose }) => {
    const { enqueueSnackbar } = useSnackbar();
    const hashName = `#${menuId}`;

    const handleCopy = (variableName: string) => {
        navigator.clipboard.writeText(variableName);

        enqueueSnackbar(
            translate('Process.Modeler.VariablesPanel.Copy.Message.Success'),
            { variant: 'success' }
        );

        handleMenuClose();
    };

    return (
        <MenuItem key={hashName} onClick={() => handleCopy(hashName)}>
            <ListItemIcon sx={{ marginRight: '1rem' }}>
                <ContentCopyIcon />
            </ListItemIcon>
            <ListItemText>{hashName}</ListItemText>
        </MenuItem>
    );
};

export default VariableCopy;
