import { FC } from 'react';

import { Menu } from '@mui/material';

import { VariableMenuProps, VariableCopyMenu } from '../VariablesPanel';

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
            <VariableCopyMenu menuId={menuId} handleMenuClose={handleMenuClose}/>
        </Menu>
    );
};

export default VariableMenu;
