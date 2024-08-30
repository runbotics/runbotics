import React, { FC, useState } from 'react';

import MoreVertIcon from '@mui/icons-material/MoreVert';
import { Box, IconButton, Menu, MenuItem } from '@mui/material';

import useTranslations from '#src-app/hooks/useTranslations';


import { BasicCredentialsCollectionDto } from '#src-app/views/credentials/CredentialsCollection/CredentialsCollection.types';

import { CredentialCollectionDelete } from './CredentialCollectionDelete/CredentialCollectionDelete';

interface MenuItemsProps {
    collection: BasicCredentialsCollectionDto;
    setShowCollectionDialog(value: boolean): void;
}

const MenuItems: FC<MenuItemsProps> = ({ collection, setShowCollectionDialog }) => {
    const { translate } = useTranslations();
    const [anchorEl, setAnchorEl] = useState<HTMLElement>(null);

    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = (event: React.MouseEvent<HTMLElement>) => {
        event.stopPropagation();
        setAnchorEl(null);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleDialogOpen = (event: React.MouseEvent<HTMLElement>) => {
        setShowCollectionDialog(true);
        handleMenuClose(event);
    };

    return (
        <Box display="flex" justifyContent="flex-end" padding="0.5rem" paddingBottom="0">
            <IconButton
                onClick={e => {
                    e.stopPropagation();
                    handleClick(e);
                }}
            >
                <MoreVertIcon />
            </IconButton>
            <Menu
                id="credential-collection-actions-menu"
                anchorEl={anchorEl}
                open={!!anchorEl}
                onClose={handleMenuClose}
                MenuListProps={{
                    onClick: e => e.stopPropagation()
                }}
            >
                <MenuItem
                    onClick={e => {
                        e.stopPropagation();
                        handleDialogOpen(e);
                    }}
                >
                    {translate('Credentials.Collection.Tile.MenuItem.Edit')}
                </MenuItem>
                <CredentialCollectionDelete
                    id={collection.id}
                    name={collection.name}
                    credentials={collection.credentials}
                    handleClose={handleClose}
                />
            </Menu>
        </Box>     
    );
};

export default MenuItems;
