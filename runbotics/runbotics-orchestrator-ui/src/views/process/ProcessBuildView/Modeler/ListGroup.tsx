import ListItem from '@mui/material/ListItem';
import styled from 'styled-components';
import ListItemText from '@mui/material/ListItemText';
import ExpandMore from '@mui/icons-material/ExpandMore';
import ExpandLess from '@mui/icons-material/ExpandLess';
import Collapse from '@mui/material/Collapse';
import Divider from '@mui/material/Divider';
import ListSubheader from '@mui/material/ListSubheader';
import List from '@mui/material/List';
import React, { FC, useState } from 'react';

const PREFIX = 'ListGroup';

const classes = {
    nested: `${PREFIX}-nested`,
};

const Root = styled.div(({ theme }) => ({
    [`& .${classes.nested}`]: {
        paddingLeft: theme.spacing(4),
    },
}));

export interface Group {
    label: string;
}

export interface Item {
    id: string;
    label: string;
    name?: string;
}

export interface ListGroupProps {
    group: Group;
    items: Item[];
    isTemplate?: boolean;
    onItemClick: (event: any, item: Item) => void;
}

const ListGroup: FC<ListGroupProps> = ({
    group, items, isTemplate, ...rest
}) => {
    const [open, setOpen] = useState(false);
    const handleClick = () => {
        setOpen(!open);
    };

    return (
        <Root>
            <ListSubheader key={group.label} sx={{ padding: '0' }}>
                <ListItem button onClick={handleClick}>
                    <ListItemText primary={group.label} />
                    {open ? <ExpandLess /> : <ExpandMore />}
                </ListItem>
                <Divider />
            </ListSubheader>
            <Collapse in={open} timeout="auto" unmountOnExit>
                <List component="div" disablePadding>
                    {items.map((item) => (
                        <ListItem
                            key={item.id}
                            button
                            className={classes.nested}
                            onClick={(event) => rest.onItemClick(event, item)}
                        >
                            <ListItemText primary={isTemplate ? item.name : item.label} />
                        </ListItem>
                    ))}
                </List>
            </Collapse>
        </Root>
    );
};

export default ListGroup;
