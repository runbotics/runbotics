import React, { FC, useState } from 'react';

import MoreVertIcon from '@mui/icons-material/MoreVert';
import { Box, IconButton, Menu, MenuItem } from '@mui/material';

import If from '#src-app/components/utils/If';
import useTranslations from '#src-app/hooks/useTranslations';

interface MenuItemsProps {
    itemId: string;
    handleOpenEditDialog(id: string): void;
    handleOpenDeleteDialog(id: string): void;
}

const MenuItems: FC<MenuItemsProps> = ({ itemId, handleOpenEditDialog, handleOpenDeleteDialog }) => {
    const { translate } = useTranslations();
    const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const handleMenuClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setIsMenuOpen(true);
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = (event: React.MouseEvent<HTMLElement>) => {
        event.stopPropagation();
        setIsMenuOpen(false);
        setAnchorEl(null);
    };

    return (
        <Box display="flex" justifyContent="flex-end" padding="0.8rem">
            <IconButton
                onClick={e => {
                    e.stopPropagation();
                    handleMenuClick(e);
                }}
            >
                <MoreVertIcon />
            </IconButton>
            <If condition={isMenuOpen}>
                <Menu
                    id="credential-collection-actions-menu"
                    anchorEl={anchorEl}
                    open={true}
                    onClose={handleMenuClose}
                    onClick={e => e.stopPropagation()}
                >
                    <MenuItem
                        onClick={e => {
                            handleOpenEditDialog(itemId);
                            handleMenuClose(e);
                        }}
                    >
                        {translate('Credentials.Collection.Tile.MenuItem.Edit')}
                    </MenuItem>
                    <MenuItem
                        onClick={e => {
                            e.stopPropagation();
                            handleOpenDeleteDialog(itemId);
                            handleMenuClose(e);
                        }}
                    >
                        {translate('Process.Collection.Tile.MenuItem.Delete')}
                    </MenuItem>
                </Menu>
            </If>
        </Box>
    );
};

export default MenuItems;
