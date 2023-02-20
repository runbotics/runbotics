
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import {
    Menu, MenuItem, ListItemText, ListItemIcon
} from '@mui/material';
import { useSnackbar } from 'notistack';

import { VariableTag } from './VariablesPanel/VariablesPanel';

import { translate } from '#src-app/hooks/useTranslations';


const MenuCopy = ({name, anchorEl, handleMenuClose, menuId, tag}) => {
    const { enqueueSnackbar } = useSnackbar();
    const hashName = `#{${name}}`;

    const dollarName = tag === VariableTag.ActionOutput ? `\${environment.output.${name}}` : `\${environment.variables.${name}}`;

    const itemsToCopy = [hashName, dollarName];
    
    const open = menuId === name;

    const handleCopy = (variableName: string) => {
        try {
            navigator.clipboard.writeText(variableName);

            enqueueSnackbar(
                translate(
                    'Process.Modeler.VariablesPanel.Copy.Message.Success',
                ),
                { variant: 'success' },
            );
        } catch {
            enqueueSnackbar(
                translate(
                    'Process.Modeler.VariablesPanel.Copy.Message.Error'
                ),
                { variant: 'error' },
            );
        }

        handleMenuClose();
    };

    const copyMenuJSX = itemsToCopy.map(item => (
        <MenuItem key={item} onClick={() => handleCopy(item)}>
            <ListItemText>{item}</ListItemText>
            <ListItemIcon sx={{marginLeft: '1rem'}}>
                <ContentCopyIcon/>
            </ListItemIcon>
        </MenuItem>)
    );

    return (
        <Menu 
            onClose={handleMenuClose}
            id={name}
            anchorEl={anchorEl}
            open={open}>
            {copyMenuJSX}
        </Menu>
    );

};


export default MenuCopy;
