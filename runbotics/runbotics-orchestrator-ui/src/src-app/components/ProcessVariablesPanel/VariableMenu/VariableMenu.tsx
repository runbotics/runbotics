import { FC } from 'react';

import { Menu } from '@mui/material';

import VariableCopy from './VariableCopy';
import { VariableMenuProps } from '../ProcessVariablesPanel.types';

const VariableMenu: FC<VariableMenuProps> = ({ anchorElement, handleMenuClose, menuId }) => {
    const isOpen = Boolean(menuId);

    if (!anchorElement) {
        return null;
    }

    return (
        <Menu
            key={menuId}
            onClose={handleMenuClose}
            id={menuId}
            anchorEl={anchorElement}
            open={isOpen}
        >
            <VariableCopy menuId={menuId} handleMenuClose={handleMenuClose}/>
        </Menu>
    );
};

export default VariableMenu;
