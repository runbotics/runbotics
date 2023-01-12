import React, { FC } from 'react';

import { List, ListItem, ListItemText, Typography } from '@mui/material';

import clsx from 'clsx';

import HighlightText from '#src-app/components/HighlightText';
import If from '#src-app/components/utils/If';
import { translate } from '#src-app/hooks/useTranslations';


import ListGroup, { Item } from '../../ListGroup';
import { classes } from '../ActionListPanel.styles';
import { groupActions } from '../useGroupsReducer';


import { ActionListProps } from './ActionList.types';

const ActionList: FC<ActionListProps> = ({
    groups,
    openGroupsState,
    dispatchGroups,
    handleItemClick,
    filters,
}) => (
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
                        {items.map((item: Item) => (
                            <ListItem
                                key={item.id}
                                button
                                className={classes.nested}
                                onClick={(event) =>
                                    handleItemClick(event, item)
                                }
                            >
                                <ListItemText>
                                    <If
                                        condition={Boolean(
                                            filters.actionName
                                        )}
                                        else={item.label}
                                    >
                                        <HighlightText
                                            text={item.label}
                                            matchingText={
                                                filters.actionName
                                            }
                                            matchClassName={
                                                classes.highlight
                                            }
                                        />
                                    </If>
                                </ListItemText>
                            </ListItem>
                        ))}
                    </List>
                </ListGroup>
            ))}
        </If>
    </List>
);

export default ActionList;
