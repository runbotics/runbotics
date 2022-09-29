import ListItem from '@mui/material/ListItem';
import styled from 'styled-components';
import ListItemText from '@mui/material/ListItemText';
import ExpandMore from '@mui/icons-material/ExpandMore';
import ExpandLess from '@mui/icons-material/ExpandLess';
import Collapse from '@mui/material/Collapse';
import Divider from '@mui/material/Divider';
import ListSubheader from '@mui/material/ListSubheader';
import List from '@mui/material/List';
import React, { FC, useEffect, useState } from 'react';

const PREFIX = 'ListGroup';

const classes = {
    nested: `${PREFIX}-nested`,
};

const Root = styled.div(({ theme }) => ({
    [`& .${classes.nested}`]: {
        paddingLeft: theme.spacing(4),
    },
}));

export interface Item {
    id: string;
    label: string;
    name?: string;
}

export interface ListGroupProps {
    label: string;
    open: boolean;
    onToggle: (open: boolean) => void;
}

const ListGroup: FC<ListGroupProps> = ({ label, open, onToggle, children }) => {
    const handleClick = () => {
        onToggle(!open);
    };

    return (
        <Root>
            <ListSubheader key={label} sx={{ padding: '0' }}>
                <ListItem button onClick={handleClick}>
                    <ListItemText primary={label} />
                    {open ? <ExpandLess /> : <ExpandMore />}
                </ListItem>
                <Divider />
            </ListSubheader>
            <Collapse in={open} timeout="auto" unmountOnExit>
                {children}
            </Collapse>
        </Root>
    );
};

export default ListGroup;
