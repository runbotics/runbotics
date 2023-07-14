import React, { FC } from 'react';

import {
    List,
    ListItemButton,
    ListItemText,
    Tooltip,
    Typography,
} from '@mui/material';

import clsx from 'clsx';

import { BotSystem, FeatureKey } from 'runbotics-common';

import HighlightText from '#src-app/components/HighlightText';
import If from '#src-app/components/utils/If';
import useFeatureKey from '#src-app/hooks/useFeatureKey';
import useTranslations from '#src-app/hooks/useTranslations';
import { useSelector } from '#src-app/store';

import { classes } from '../ActionListPanel.styles';
import ListGroup, { Item } from '../ListGroup';
import { groupActions } from '../useGroupsReducer';

import {
    ActionListProps,
    ADVANCED_ACTION_GROUP_IDS,
    ADVANCED_ACTION_IDS,
} from './ActionList.types';

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
    const hasAdvancedActionsAccess = useFeatureKey([
        FeatureKey.PROCESS_ACTIONS_LIST_ADVANCED,
    ]);
    const actionSystemCheck = (actionSystem: string) =>
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

    const ListContent = ({items}) => (
        <List component="div" disablePadding>
            {items.map((item: Item) => {
                const isActionIncompatible =
            item.system &&
            actionSystemCheck(item.system);
                return isActionIncompatible ? (
                    <Tooltip
                        key={item.id}
                        title={translate(
                            'Action.List.Item.Disabled.Tooltip',
                            { system: item.system }
                        )}
                    >
                        <div>
                            <ListItem item={item} disabled />
                        </div>
                    </Tooltip>
                ) : (
                    <ListItem
                        key={item.id}
                        item={item}
                        disabled={
                            !hasAdvancedActionsAccess &&
                    ADVANCED_ACTION_IDS.includes(
                        item.id
                    )
                        }
                    />
                );
            })}
        </List>);

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
                        disabled={
                            !hasAdvancedActionsAccess &&
                            ADVANCED_ACTION_GROUP_IDS.includes(key)
                        }
                    >

                        <ListContent items={items}/>

                    </ListGroup>
                ))}
            </If>
        </List>
    );
};

export default ActionList;
