import React, { FC, memo, useEffect, useMemo, useRef, useState } from 'react';
import clsx from 'clsx';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import FilterAltOutlinedIcon from '@mui/icons-material/FilterAltOutlined';
import List from '@mui/material/List';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import _ from 'lodash';
import Highlighter from 'react-highlight-words';
import { useSelector } from 'src/store';
import useTranslations from 'src/hooks/useTranslations';
import { classes, Root, drawerWidth, ActionPanelToggler } from './ActionListPanel.styles';
import { ActionListPanelProps, FilterModalState, GroupProperties, ListPanelTab } from './ActionListPanel.types';
import useGroupReducer, { groupActions } from './useGroupsReducer';
import ListGroup, { Item } from '../ListGroup';
import internalBpmnActions from '../ConfigureActionPanel/Actions';
import { ActionToBPMNElement, TaskType } from '../ConfigureActionPanel/ActionToBPMNElement';
import { IBpmnAction, Runner } from '../ConfigureActionPanel/Actions/types';
import { useTemplatesGroups } from '../ConfigureActionPanel/useTemplatesGroups';
import useInternalActionsGroups from '../ConfigureActionPanel/useInternalActionsGroups';
import { internalTemplates } from '../ConfigureActionPanel/Templates';
import CustomTemplateHandler from '../ConfigureActionPanel/CustomTemplateHandler';
import customLoopHandler from '../ConfigureActionPanel/CustomLoopHandler';
import FilterModal from './FilterModal';
import i18n from 'src/translations/i18n';
import ActionSearch from './ActionSearch';
import { Badge, ListItem, ListItemText, Typography } from '@mui/material';
import If from 'src/components/utils/If';
import { TemplatesSchema } from '../ConfigureActionPanel/Template.types';

const filterModalInitialState: FilterModalState = {
    anchorElement: null,
    groupNames: [],
    actionName: null,
};

const ActionListPanel: FC<ActionListPanelProps> = memo((props) => {
    const internalActionsGroups = useInternalActionsGroups();
    const templatesGroups = useTemplatesGroups();
    const [currentTab, setCurrentTab] = useState<ListPanelTab>(ListPanelTab.ACTIONS);
    const [filterModal, setFilterModal] = useState<FilterModalState>(filterModalInitialState);
    const filterModalAnchorRef = useRef<Element>(null);
    const templatesGroupsList: GroupProperties[] = Object.entries(templatesGroups);
    const { byId, external } = useSelector((state) => state.action.bpmnActions);
    const [open, setOpen] = useState(true);
    const { translate } = useTranslations();

    const actionsGroupsList: GroupProperties[] = React.useMemo(() => {
        const externalActionsGroup = external.map((externalId) => byId[externalId]);
        const completeActionsGroups = {
            ...internalActionsGroups,
            external: {
                ...internalActionsGroups.external,
                items: [...externalActionsGroup],
            },
        };
        return Object.entries(completeActionsGroups);
    }, [external, i18n.language]);

    const groupsToFilter = React.useMemo(() => {
        if (currentTab === ListPanelTab.ACTIONS) {
            return actionsGroupsList;
        }
        return templatesGroupsList;
    }, [currentTab, templatesGroupsList, actionsGroupsList]);

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
        if (customLoopHandler[item.id]) {
            // Handler for loops - temporary solution, should be refactored/moved to templateHandler
            customLoopHandler[item.id](event, props);
        } else if (internalTemplates[item.id]) {
            CustomTemplateHandler(event, props, internalTemplates[item.id]);
        } else if (byId[item.id]) {
            // Handler for external actions
            handleAction(event, byId[item.id]);
        } else if (internalBpmnActions[item.id]) {
            handleAction(event, internalBpmnActions[item.id]);
        } else {
            throw new Error(translate('Process.Details.Modeler.ActionListPanel.Error'));
        }
    };

    const handleSearchPhrasechange = (value: string) => {
        dispatchGroupsOpenState(value.length ? groupActions.openAll() : groupActions.closeAll());

        setFilterModal((filterModal) => ({
            ...filterModal,
            actionName: value || null,
        }));
    };

    const handleDrawerAction = () => {
        setOpen((prevState) => !prevState);
    };

    const openFilterModal = () => {
        setFilterModal((prevState) => ({
            ...prevState,
            anchorElement: filterModalAnchorRef.current,
        }));
    };

    const onTabChange = (event: React.SyntheticEvent, newValue: ListPanelTab) => {
        setCurrentTab(newValue);
        setFilterModal(filterModalInitialState);
    };

    const filteredGroups: GroupProperties[] = useMemo(
        () =>
            groupsToFilter
                .map((group) => {
                    const [key, value] = group;
                    const { groupNames, actionName } = filterModal;

                    // filter group by name
                    if (groupNames.length && !groupNames.includes(value.label)) return;

                    // filter group's actions
                    const filteredItems = actionName
                        ? (value.items as IBpmnAction[]).filter(({ label }) =>
                              label.toLowerCase().includes(actionName.toLowerCase()),
                          )
                        : (value.items as TemplatesSchema[]);

                    // remove group if empty
                    if (!filteredItems.length) return;

                    return [key, { ...value, items: filteredItems }] as GroupProperties;
                })
                .filter((el) => el),
        [groupsToFilter, filterModal],
    );

    const [groupsOpenState, dispatchGroupsOpenState] = useGroupReducer(
        Object.fromEntries(filteredGroups.map(([_, { label }]) => [label, false])),
    );

    useEffect(() => {
        console.log(groupsOpenState);
    }, [groupsOpenState]);
    console.log(groupsOpenState);

    return (
        <Root>
            <ActionPanelToggler onClick={handleDrawerAction} open={open} drawerWidth={drawerWidth}>
                <IconButton>
                    <ChevronRightIcon fontSize="medium" />
                </IconButton>
            </ActionPanelToggler>
            <Drawer
                variant="permanent"
                anchor="left"
                open={open}
                className={clsx(classes.drawer, {
                    [classes.drawerOpen]: open,
                    [classes.drawerClose]: !open,
                })}
                classes={{
                    paper: clsx(classes.drawerPaper, {
                        [classes.drawerOpen]: open,
                        [classes.drawerClose]: !open,
                    }),
                }}
            >
                <Box height={`calc(100vh - ${props.offsetTop}px)`} display="flex" flexDirection="column">
                    <Tabs
                        scrollButtons="auto"
                        textColor="secondary"
                        value={currentTab}
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
                    <Box ref={filterModalAnchorRef} className={classes.filterModalAnchor}>
                        <ActionSearch
                            onSearchPhraseChange={handleSearchPhrasechange}
                            label={translate('Process.Details.Modeler.ActionListPanel.Search.Label')}
                        />
                        <Badge badgeContent={filterModal.groupNames.length} color="primary" overlap="circular" variant="dot">
                            <IconButton onClick={openFilterModal} className={classes.filterButton}>
                                <FilterAltOutlinedIcon />
                            </IconButton>
                        </Badge>
                    </Box>
                    <FilterModal
                        filterModalState={filterModal}
                        setFilterModalState={setFilterModal}
                        filterOptions={groupsToFilter}
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
                            {filteredGroups.map(([key, { label, items }]) => (
                                <ListGroup
                                    key={key}
                                    label={label}
                                    open={groupsOpenState[label]}
                                    onToggle={(open) => {
                                        dispatchGroupsOpenState(groupActions.updateGroup(label, open));
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
                                                        condition={Boolean(filterModal.actionName)}
                                                        else={
                                                            currentTab === ListPanelTab.TEMPLATES
                                                                ? item.name
                                                                : item.label
                                                        }
                                                    >
                                                        <Highlighter
                                                            searchWords={filterModal.actionName?.split(' ')}
                                                            textToHighlight={
                                                                currentTab === ListPanelTab.TEMPLATES
                                                                    ? item.name
                                                                    : item.label
                                                            }
                                                            highlightClassName={classes.highlight}
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

export default ActionListPanel;
