import React, { FC } from 'react';

import {
    List,
    ListItemButton,
    ListItemText,
    Tooltip,
    Typography,
} from '@mui/material';

import clsx from 'clsx';

import { ACTION_GROUP, AllActionIds, BotSystemType, FeatureKey, Role } from 'runbotics-common';

import HighlightText from '#src-app/components/HighlightText';
import If from '#src-app/components/utils/If';
import useFeatureKey from '#src-app/hooks/useFeatureKey';
import useRole from '#src-app/hooks/useRole';
import useTranslations from '#src-app/hooks/useTranslations';
import { useSelector } from '#src-app/store';

import {
    ActionListProps,
    ADVANCED_ACTION_GROUP_IDS,
    ADVANCED_ACTION_IDS,
} from './ActionList.types';
import { classes } from '../ActionListPanel.styles';
import ListGroup, { Item } from '../ListGroup';
import { groupActions } from '../useGroupsReducer';


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
    const isGuest = useRole([Role.ROLE_GUEST]);
    const { process } = useSelector((state) => state.process.draft);
    const { translate } = useTranslations();
    const hasAdvancedActionsAccess = useFeatureKey([
        FeatureKey.PROCESS_ACTIONS_LIST_ADVANCED,
    ]);
    const actionSystemCheck = (actionSystem: string) =>
        process?.system?.name &&
        process.system.name !== BotSystemType.ANY &&
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

    const getTranslationMessage = () => isGuest
        ? translate('Process.Details.Modeler.ActionListPanel.NotAvailableForGuests')
        : translate('Process.Details.Modeler.ActionListPanel.NotAvailable');

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
                {groups.map(({ key, label, items }) => {
                    const isGroupDisabled =
                        !hasAdvancedActionsAccess &&
                        ADVANCED_ACTION_GROUP_IDS.includes(key as ACTION_GROUP);
                    return (
                        <Tooltip
                            key={key}
                            title={isGroupDisabled ? getTranslationMessage() : ''}
                        >
                            <div>
                                <ListGroup
                                    key={key}
                                    label={label}
                                    open={openGroupsState[key]}
                                    onToggle={(open) => {
                                        dispatchGroups(
                                            groupActions.updateGroup(key, open)
                                        );
                                    }}
                                    disabled={isGroupDisabled}
                                >
                                    <List component="div" disablePadding>
                                        {items.map((item: Item) => {
                                            const itemId = item.id as AllActionIds;

                                            const isActionIncompatible =
                                                item.system &&
                                                actionSystemCheck(item.system);
                                            const isActionDisabled =
                                                !hasAdvancedActionsAccess &&
                                                (isGroupDisabled ||
                                                     ADVANCED_ACTION_IDS.includes(
                                                         itemId
                                                     ));

                                            let title = '';

                                            if (
                                                isActionIncompatible &&
                                                !isActionDisabled
                                            ) {
                                                title = translate(
                                                    'Action.List.Item.Disabled.Tooltip',
                                                    {
                                                        system: item.system,
                                                    }
                                                );
                                            }

                                            if (
                                                isActionDisabled &&
                                                !isGroupDisabled
                                            ) {
                                                title = getTranslationMessage();
                                            }

                                            return (
                                                <Tooltip
                                                    key={item.id}
                                                    title={title}
                                                >
                                                    <div>
                                                        <ListItem
                                                            item={item}
                                                            disabled={
                                                                isActionIncompatible ||
                                                                isActionDisabled
                                                            }
                                                        />
                                                    </div>
                                                </Tooltip>
                                            );
                                        })}
                                    </List>
                                </ListGroup>
                            </div>
                        </Tooltip>
                    );
                })}
            </If>
        </List>
    );
};

export default ActionList;
