import React, { FC } from 'react';

import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { Collapse, ListItemButton } from '@mui/material';
import RouterLink from 'next/link';

import If from '#src-app/components/utils/If';

import { StyledListItem, StyledListItemText, StyledListItemIcon, getLinkButtonSx } from './NavbarItem.styles';
import { NavbarItemProps } from './NavbarItem.types';


const NavbarItem: FC<NavbarItemProps> = ({
    children,
    className,
    depth,
    href,
    icon: Icon,
    info: Info,
    title,
    mobile,
    open,
    ...rest
}) => {
    if (children)
    { return (
        <StyledListItem className={className} key={title} disablePadding {...rest}>
            <ListItemButton sx={getLinkButtonSx(depth, open)}>
                <If condition={Icon}>
                    <StyledListItemIcon>
                        <Icon size="20" />
                    </StyledListItemIcon>
                </If>
                <StyledListItemText primary={title} />
                <StyledListItemIcon>{open ? <ExpandLessIcon /> : <ExpandMoreIcon />}</StyledListItemIcon>
            </ListItemButton>
            <Collapse in={open}>{children}</Collapse>
        </StyledListItem>
    ); }

    return (
        <StyledListItem className={className} key={title} disablePadding {...rest}>
            <RouterLink href={href} passHref is="span" legacyBehavior>
                <ListItemButton className={`depth-${depth}`} sx={getLinkButtonSx(depth, open)} selected={open}>
                    <StyledListItemIcon>
                        <Icon size="20" />
                    </StyledListItemIcon>
                    <StyledListItemText primary={title} />
                    {!mobile && !!Info && <Info />}
                </ListItemButton>
            </RouterLink>
        </StyledListItem>
    );
};

export default NavbarItem;
