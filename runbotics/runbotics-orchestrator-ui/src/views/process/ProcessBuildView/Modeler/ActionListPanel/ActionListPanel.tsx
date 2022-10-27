/* eslint-disable @typescript-eslint/no-shadow */
/* eslint-disable consistent-return */
import React, { FC, memo, useMemo, useState } from 'react';

import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import FilterAltOutlinedIcon from '@mui/icons-material/FilterAltOutlined';
import { Badge, ListItem, ListItemText, Typography, Tab, Tabs, IconButton, Box, Drawer, List } from '@mui/material';
import clsx from 'clsx';
import _ from 'lodash';

import HighlightText from 'src/components/HighlightText';
import If from 'src/components/utils/If';
import useTranslations from 'src/hooks/useTranslations';
import { useSelector } from 'src/store';
import i18n from 'src/translations/i18n';

import internalBpmnActions from '../ConfigureActionPanel/Actions';
import { IBpmnAction, Runner } from '../ConfigureActionPanel/Actions/types';
import { ActionToBPMNElement, TaskType } from '../ConfigureActionPanel/ActionToBPMNElement';
import customLoopHandler from '../ConfigureActionPanel/CustomLoopHandler';
import CustomTemplateHandler from '../ConfigureActionPanel/CustomTemplateHandler';
import { TemplatesSchema } from '../ConfigureActionPanel/Template.types';
import { internalTemplates } from '../ConfigureActionPanel/Templates';
import useInternalActionsGroups from '../ConfigureActionPanel/useInternalActionsGroups';
import { useTemplatesGroups } from '../ConfigureActionPanel/useTemplatesGroups';
import ListGroup, { Item } from '../ListGroup';
import { classes, Root, drawerWidth, ActionPanelToggler } from './ActionListPanel.styles';
import { ActionListPanelProps, Filters as GroupFilters, GroupProperties, ListPanelTab } from './ActionListPanel.types';
import ActionSearch from './ActionSearch';
import FilterModal from './FilterModal';
import useGroupReducer, { groupActions } from './useGroupsReducer';

const filterModalInitialState: GroupFilters = {
    groupNames: [],
    actionName: null,
    currentTab: ListPanelTab.ACTIONS,
};

const ActionListPanel: FC<ActionListPanelProps> = memo((props) => {
    const [filters, setFilters] = useState<GroupFilters>(filterModalInitialState);
    const [openDrawer, setOpenDrawer] = useState(true);
    const [filterModalEl, setFilterModalEl] = useState<HTMLButtonElement | null>(null);

    const { byId, external } = useSelector((state) => state.action.bpmnActions);
    const internalActionsGroups = useInternalActionsGroups();
    const templatesGroups = useTemplatesGroups();
    const { translate } = useTranslations();

    const actionGroups: GroupProperties[] = useMemo(() => {
        const externalActionsGroup = external.map((externalId) => byId[externalId]);
        const completeActionsGroups = {
            ...internalActionsGroups,
            external: {
                ...internalActionsGroups.external,
                items: [...externalActionsGroup],
            },
        };

        const getGroupList = (group: object, isTemplate: boolean): GroupProperties[] =>
            Object.entries(group).map(([key, { items, label }]) => ({
                key,
                items,
                label,
                isTemplate,
            }));

        // prettier-ignore
        return [
            ...getGroupList(completeActionsGroups, false), 
            ...getGroupList(templatesGroups, true)
        ];
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [external, i18n.language, templatesGroups]);

    const [groupsOpenState, dispatchGroups] = useGroupReducer(
        Object.fromEntries(actionGroups.map(({ key }) => [key, false])),
    );

    const handleAction = (event, action: IBpmnAction) => {
        const actionToBPMNElement = ActionToBPMNElement.from(props.modeler);

        let shape;
        switch (action.runner) {
            case Runner.BROWSER_BACKGROUND_SCRIPT:
            case Runner.BROWSER_FRONTEND_SCRIPT:
            case Runner.DESKTOP_SCRIPT:
                shape = actionToBPMNElement.createElement(TaskType.ServiceTask, _.cloneDeep(action));
                break;
            case Runner.NO_RUNNER:
                shape = actionToBPMNElement.createElement(TaskType.Task, _.cloneDeep(action));
                break;
            default:
                break;
        }

        props.modeler.get('create').start(event, shape);
    };

    const handleItemClick = (event, item: Item) => {
        if (!item) return;
        if (customLoopHandler[item.id])
            // Handler for loops - temporary solution, should be refactored/moved to templateHandler
            customLoopHandler[item.id](event, props);
        else if (internalTemplates[item.id]) CustomTemplateHandler(event, props, internalTemplates[item.id]);
        else if (byId[item.id])
            // Handler for external actions
            handleAction(event, byId[item.id]);
        else if (internalBpmnActions[item.id]) handleAction(event, internalBpmnActions[item.id]);
        else throw new Error(translate('Process.Details.Modeler.ActionListPanel.Error'));
    };

    const handleSearchPhrasechange = (value: string) => {
        dispatchGroups(value.length ? groupActions.openAll() : groupActions.closeAll());

        setFilters((filters) => ({
            ...filters,
            actionName: value || null,
        }));
    };

    const handleDrawerAction = () => {
        setOpenDrawer((prevState) => !prevState);
    };

    const onTabChange = (_event: React.SyntheticEvent, newValue: ListPanelTab) => {
        setFilters((filters) => ({
            ...filters,
            groupNames: [],
            currentTab: newValue,
        }));
    };

    const currentTabGroups: GroupProperties[] = useMemo(
        () => actionGroups.filter(({ isTemplate }) => isTemplate === (filters.currentTab === ListPanelTab.TEMPLATES)),
        [actionGroups, filters],
    );

    const filteredGroups: GroupProperties[] = useMemo(
        () =>
            currentTabGroups
                .map((group) => {
                    const { label, items, isTemplate } = group;
                    const { groupNames, actionName } = filters;

                    // filter group by name
                    // eslint-disable-next-line array-callback-return
                    if (groupNames.length && !groupNames.includes(label)) return;

                    // filter group's items
                    const filteredItems = actionName
                        ? // TODO: Merge IBpmnAction and TemplatesSchema into single interface
                        (items as (IBpmnAction & TemplatesSchema)[]).filter(({ label, name }) =>
                            (isTemplate ? name : label).toLowerCase().includes(actionName.toLowerCase()),
                        )
                        : (items as TemplatesSchema[]);

                    // remove group if empty
                    // eslint-disable-next-line array-callback-return
                    if (!filteredItems.length) return;

                    return { ...group, items: filteredItems };
                })
                .filter((el) => el),
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [actionGroups, filters],
    );

    return (
        <Root>
            <ActionPanelToggler onClick={handleDrawerAction} open={openDrawer} drawerWidth={drawerWidth}>
                <IconButton>
                    <ChevronRightIcon fontSize="medium" />
                </IconButton>
            </ActionPanelToggler>
            <Drawer
                variant="permanent"
                anchor="left"
                open={openDrawer}
                className={clsx(classes.drawer, {
                    [classes.drawerOpen]: openDrawer,
                    [classes.drawerClose]: !openDrawer,
                })}
                classes={{
                    paper: clsx(classes.drawerPaper, {
                        [classes.drawerOpen]: openDrawer,
                        [classes.drawerClose]: !openDrawer,
                    }),
                }}
            >
                <Box height={`calc(100vh - ${props.offsetTop}px)`} display="flex" flexDirection="column">
                    <Tabs
                        scrollButtons="auto"
                        textColor="secondary"
                        value={filters.currentTab}
                        className={clsx(classes.tabs)}
                        onChange={onTabChange}
                        variant="fullWidth"
                    >
                        <Tab
                            label={translate('Process.Details.Modeler.ActionListPanel.Tabs.Actions.Label')}
                            value={ListPanelTab.ACTIONS}
                        />
                        <Tab
                            label={translate('Process.Details.Modeler.ActionListPanel.Tabs.Templates.Label')}
                            value={ListPanelTab.TEMPLATES}
                        />
                    </Tabs>
                    <Box className={classes.filterModalAnchor}>
                        <ActionSearch
                            onSearchPhraseChange={handleSearchPhrasechange}
                            label={translate('Process.Details.Modeler.ActionListPanel.Search.Label')}
                        />
                        <Badge
                            badgeContent={filters.groupNames.length}
                            color="primary"
                            overlap="circular"
                            variant="dot"
                        >
                            <IconButton
                                onClick={(e) => setFilterModalEl(e.currentTarget)}
                                className={classes.filterButton}
                            >
                                <FilterAltOutlinedIcon />
                            </IconButton>
                        </Badge>
                    </Box>
                    <FilterModal
                        anchorElement={filterModalEl}
                        onClose={() => setFilterModalEl(null)}
                        activeFilters={filters}
                        setFilters={setFilters}
                        filterOptions={currentTabGroups}
                    />
                    <List className={clsx(classes.list)}>
                        <If
                            condition={Boolean(filteredGroups.length)}
                            else={
                                <Typography color="gray" align="center" sx={{ pt: 1 }}>
                                    {translate('Process.Details.Modeler.ActionListPanel.NoResults')}
                                </Typography>
                            }
                        >
                            {filteredGroups.map(({ key, label, items }) => (
                                <ListGroup
                                    key={key}
                                    label={label}
                                    open={groupsOpenState[key]}
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
                                                onClick={(event) => handleItemClick(event, item)}
                                            >
                                                <ListItemText>
                                                    <If
                                                        condition={Boolean(filters.actionName)}
                                                        else={
                                                            filters.currentTab === ListPanelTab.TEMPLATES
                                                                ? item.name
                                                                : item.label
                                                        }
                                                    >
                                                        <HighlightText
                                                            text={
                                                                filters.currentTab === ListPanelTab.TEMPLATES
                                                                    ? item.name
                                                                    : item.label
                                                            }
                                                            matchingText={filters.actionName}
                                                            matchClassName={classes.highlight}
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
                </Box>
            </Drawer>
        </Root>
    );
});

ActionListPanel.displayName = 'ActionListPanel';
export default ActionListPanel;
