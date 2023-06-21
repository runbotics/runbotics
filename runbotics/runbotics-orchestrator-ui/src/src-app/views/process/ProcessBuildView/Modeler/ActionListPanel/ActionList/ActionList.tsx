import React, { FC } from 'react';

import {
    List,
    ListItemButton,
    ListItemText,
    Tooltip,
    Typography,
} from '@mui/material';

import clsx from 'clsx';

import { BotSystem } from 'runbotics-common';

import HighlightText from '#src-app/components/HighlightText';
import If from '#src-app/components/utils/If';
import useTranslations from '#src-app/hooks/useTranslations';
import { useSelector } from '#src-app/store';

import { classes } from '../ActionListPanel.styles';
import ListGroup, { Item } from '../ListGroup';
import { groupActions } from '../useGroupsReducer';

import { ActionListProps } from './ActionList.types';

interface ListItemProps {
    item: Item;
    disabled?: boolean;
}

const ActionList: FC<ActionListProps> = ({
    groups,
    openGroupsState,
    dispatchGroups,
    handleItemClick,
    filters,
}) => {
    const { process } = useSelector((state) => state.process.draft);
    const { translate } = useTranslations();
    const disabledCondition = (actionSystem: string) =>
        process?.system?.name &&
        process.system.name !== BotSystem.ANY &&
        actionSystem.toUpperCase() !== process.system.name;

    const ListItem = ({ item, disabled }: ListItemProps) => (
        <ListItemButton
            key={item.id}
            className={classes.nested}
            onClick={(event) => handleItemClick(event, item)}
            disabled={disabled}
        >
            <ListItemText>
                <If condition={Boolean(filters.actionName)} else={item.label}>
                    <HighlightText
                        text={item.label}
                        matchingText={filters.actionName}
                        matchClassName={classes.highlight}
                    />
                </If>
            </ListItemText>
        </ListItemButton>
    );

    return (
        <List className={clsx(classes.list)}>
            <If
                condition={Boolean(groups.length)}
                else={
                    <Typography color="gray" align="center" sx={{ pt: 1 }}>
                        {translate(
                            'Process.Details.Modeler.ActionListPanel.NoResults'
                        )}
                    </Typography>
                }
            >
                {groups.map(({ key, label, items }) => (
                    <ListGroup
                        key={key}
                        label={label}
                        open={openGroupsState[key]}
                        onToggle={(open) => {
                            dispatchGroups(groupActions.updateGroup(key, open));
                        }}
                    >
                        <List component="div" disablePadding>
                            {items.map((item: Item) => {
                                const isDisabled = item.system && disabledCondition(item.system);
                                return isDisabled ? (
                                    <Tooltip
                                        key={item.id}
                                        title={translate(
                                            'Action.List.Item.Disabled.Tooltip',
                                            { system: item.system }
                                        )}
                                    >
                                        <div>
                                            <ListItem
                                                item={item}
                                                disabled
                                            />
                                        </div>
                                    </Tooltip>
                                ) : (
                                    <ListItem key={item.id} item={item} />
                                );
                            })}
                        </List>
                    </ListGroup>
                ))}
            </If>
        </List>
    );
};

export default ActionList;
