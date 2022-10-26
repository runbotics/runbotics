import React, { useRef, useState, memo, FC } from 'react';
import styled from 'styled-components';
import { ListItemIcon, ListItemText, Tooltip, IconButton, Menu, MenuItem } from '@mui/material';
import MoreIcon from '@mui/icons-material/MoreVert';
import GetAppIcon from '@mui/icons-material/GetApp';
import FileCopyIcon from '@mui/icons-material/FileCopy';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import ArchiveIcon from '@mui/icons-material/ArchiveOutlined';
import useTranslations from 'src/hooks/useTranslations';

const PREFIX = 'GenericMoreButton';

const classes = {
    menu: `${PREFIX}-menu`,
};

const Root = styled.div(() => ({
    [`& .${classes.menu}`]: {
        width: 256,
        maxWidth: '100%',
    },
}));

const GenericMoreButton: FC = (props) => {
    const moreRef = useRef<any>(null);
    const [openMenu, setOpenMenu] = useState<boolean>(false);
    const { translate } = useTranslations();

    const handleMenuOpen = (): void => {
        setOpenMenu(true);
    };

    const handleMenuClose = (): void => {
        setOpenMenu(false);
    };

    return (
        <Root>
            <Tooltip title={translate('Component.GenericMoreOptions.MoreOptions')}>
                <IconButton onClick={handleMenuOpen} ref={moreRef} {...props}>
                    <MoreIcon fontSize="small" />
                </IconButton>
            </Tooltip>
            <Menu
                anchorEl={moreRef.current}
                anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'left',
                }}
                onClose={handleMenuClose}
                open={openMenu}
                PaperProps={{ className: classes.menu }}
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'left',
                }}
            >
                <MenuItem>
                    <ListItemIcon>
                        <GetAppIcon />
                    </ListItemIcon>
                    <ListItemText primary="Import" />
                </MenuItem>
                <MenuItem>
                    <ListItemIcon>
                        <FileCopyIcon />
                    </ListItemIcon>
                    <ListItemText primary="Copy" />
                </MenuItem>
                <MenuItem>
                    <ListItemIcon>
                        <PictureAsPdfIcon />
                    </ListItemIcon>
                    <ListItemText primary="Export" />
                </MenuItem>
                <MenuItem>
                    <ListItemIcon>
                        <ArchiveIcon />
                    </ListItemIcon>
                    <ListItemText primary="Archive" />
                </MenuItem>
            </Menu>
        </Root>
    );
};

export default memo(GenericMoreButton);
