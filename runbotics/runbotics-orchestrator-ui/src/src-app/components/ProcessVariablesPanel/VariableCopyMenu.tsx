import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import { Menu, MenuItem, ListItemText, ListItemIcon } from '@mui/material';
import { useSnackbar } from 'notistack';

import { translate } from '#src-app/hooks/useTranslations';

import { VariableTag } from './VariablesPanel/VariablesPanel';

const VariableCopyMenu = ({ anchorElement, handleMenuClose, menuId, tag }) => {
    const { enqueueSnackbar } = useSnackbar();
    const hashName = `#{${menuId}}`;

    const dollarName =
        tag === VariableTag.ACTION_OUTPUT
            ? `\${environment.output.${menuId}}`
            : `\${environment.variables.${menuId}}`;

    const itemsToCopy = [hashName, dollarName];

    const isOpen = Boolean(menuId);

    const handleCopy = (variableName: string) => {
        navigator.clipboard.writeText(variableName);

        enqueueSnackbar(
            translate('Process.Modeler.VariablesPanel.Copy.Message.Success'),
            { variant: 'success' }
        );

        handleMenuClose();
    };

    if (!anchorElement) {
        return null;
    }

    const menuItems = itemsToCopy.map((item) => (
        <MenuItem key={item} onClick={() => handleCopy(item)}>
            <ListItemIcon sx={{ marginRight: '1rem' }}>
                <ContentCopyIcon />
            </ListItemIcon>
            <ListItemText>{item}</ListItemText>
        </MenuItem>
    ));

    return (
        <Menu
            key={menuId}
            onClose={handleMenuClose}
            id={menuId}
            anchorEl={anchorElement}
            open={isOpen}
        >
            {menuItems}
        </Menu>
    );
};

export default VariableCopyMenu;
