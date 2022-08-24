import React, {
    FC, memo, useEffect, useRef, useState,
} from 'react';
import clsx from 'clsx';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import FilterAltOutlinedIcon from '@mui/icons-material/FilterAltOutlined';
import List from '@mui/material/List';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import TextField from '@mui/material/TextField';
import _ from 'lodash';
import Autocomplete from '@mui/material/Autocomplete';
import { useSelector } from 'src/store';
import useTranslations from 'src/hooks/useTranslations';
import If from 'src/components/utils/If';
import {
    classes, Root, drawerWidth, ActionPanelToggler,
} from './ActionListPanel.styles';
import { ActionListPanelProps, FilterModalState, ListPanelTab } from './ActionListPanel.types';
import ListGroup, { Item } from '../ListGroup';
import internalBpmnActions from '../ConfigureActionPanel/Actions';
import { ActionToBPMNElement, TaskType } from '../ConfigureActionPanel/ActionToBPMNElement';
import { IBpmnAction, Runner } from '../ConfigureActionPanel/Actions/types';
import { defaultActionGroups, defaultTemplatesGroups } from '../ConfigureActionPanel/DefaultGroups';
import { internalTemplates } from '../ConfigureActionPanel/Templates';
import CustomTemplateHandler from '../ConfigureActionPanel/CustomTemplateHandler';
import customLoopHandler from '../ConfigureActionPanel/CustomLoopHandler';
import FilterModal from './FilterModal';

const filterModalInitialState: FilterModalState = {
    anchorElement: null,
    filters: [],
};

const ActionListPanel: FC<ActionListPanelProps> = memo((props) => {
    const [actionGroups, setActionGroups] = useState(defaultActionGroups);
    const [currentTab, setCurrentTab] = useState<ListPanelTab>(ListPanelTab.ACTIONS);
    const [filterModal, setFilterModal] = useState<FilterModalState>(filterModalInitialState);
    const filterModalAnchorRef = useRef<Element>(null);
    const templateGroupsList = Object.entries(defaultTemplatesGroups);
    const { byId, external } = useSelector((state) => state.action.bpmnActions);

    const [open, setOpen] = useState(true);
    const { translate } = useTranslations();
    const actionGroupsList = React.useMemo(() => Object.entries(actionGroups), [actionGroups]);
    const actionSearchValues = React.useMemo(
        () => actionGroupsList.flatMap((element) => element[1].items),
        [actionGroupsList],
    );
    const templatesSearchValues = React.useMemo(
        () => templateGroupsList.flatMap((element) => element[1].items),
        [actionGroupsList],
    );

    const isFiltered = React.useMemo(() => filterModal.filters.length > 0, [filterModal.filters]);

    const actionsToFilter = React.useMemo(() => {
        if (currentTab === ListPanelTab.ACTIONS) {
            return actionGroupsList;
        }
        return templateGroupsList;
    }, [currentTab]);

    const updateActionGroups = React.useCallback(() => {
        if (external.length > 0) {
            const newActionsGroups = { ...actionGroups };
            newActionsGroups.external.items = external.map((externalId) => byId[externalId]);
            setActionGroups(newActionsGroups);
        }
    }, [external, byId]);

    useEffect(() => {
        updateActionGroups();
    }, [updateActionGroups]);

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

    const filteredActions = actionsToFilter.map(([key, value]) => {
        if (filterModal.filters.includes(value?.label)) {
            return <ListGroup key={key} group={value} items={value.items} onItemClick={handleItemClick} />;
        }
    });

    const actionsList = currentTab === ListPanelTab.ACTIONS
        ? actionGroupsList.map(([key, value]) => (
                  <ListGroup key={key} group={value} items={value.items} onItemClick={handleItemClick} />
        ))
        : templateGroupsList.map(([key, value]) => (
                  <ListGroup key={key} group={value} items={value.items} isTemplate onItemClick={handleItemClick} />
        ));

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
                    <Box display="flex" ref={filterModalAnchorRef}>
                        <Autocomplete
                            multiple={false}
                            disabled={false}
                            options={currentTab === ListPanelTab.ACTIONS ? actionSearchValues : templatesSearchValues}
                            getOptionLabel={(action) => (currentTab === ListPanelTab.ACTIONS ? action.label : action.name)}
                            isOptionEqualToValue={(action, value) => value.label === action.label}
                            className={classes.autocomplete}
                            onChange={handleItemClick}
                            size="small"
                            sx={{ width: 'calc(100% - 40px)' }}
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    label={translate('Process.Details.Modeler.ActionListPanel.Search.Label')}
                                    variant="outlined"
                                />
                            )}
                        />
                        <IconButton onClick={openFilterModal}>
                            <FilterAltOutlinedIcon />
                        </IconButton>
                    </Box>
                    <FilterModal
                        filterModalState={filterModal}
                        setFilterModalState={setFilterModal}
                        filterOptions={actionsToFilter}
                    />
                    <List className={clsx(classes.list)}>
                        <If condition={!isFiltered} else={filteredActions}>
                            {actionsList}
                        </If>
                    </List>
                </Box>
            </Drawer>
        </Root>
    );
});

export default ActionListPanel;
