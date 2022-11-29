import React, { FC } from 'react';

import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import { Collapse, Divider, ListItem, ListItemText, ListSubheader } from '@mui/material';
import styled from 'styled-components';


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
