/* eslint-disable @typescript-eslint/no-shadow */
/* eslint-disable consistent-return */
import React, { FC, memo, useMemo, useState } from 'react';

import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import FilterAltOutlinedIcon from '@mui/icons-material/FilterAltOutlined';
import { Badge, Tab, Tabs, IconButton, Box, Drawer } from '@mui/material';
import clsx from 'clsx';
import _ from 'lodash';

import useInternalActionsGroups from '#src-app/hooks/useInternalActionsGroups';
import { useModelerContext } from '#src-app/hooks/useModelerContext';
import { useTemplatesGroups } from '#src-app/hooks/useTemplatesGroups';
import useTranslations from '#src-app/hooks/useTranslations';

import { useSelector } from '#src-app/store';

import i18n from '#src-app/translations/i18n';

import internalBpmnActions from '../../../../../Actions';
import { IBpmnAction, Runner } from '../../../../../Actions/types';
import { internalTemplates } from '../../../../../Templates';
import {
    ActionToBPMNElement,
    TaskType
} from '../ActionFormPanel/ActionToBPMNElement';
import CustomLoopHandler from '../ActionFormPanel/handlers/CustomLoopHandler';
import CustomTemplateHandler from '../ActionFormPanel/handlers/CustomTemplateHandler';
import { TemplatesSchema } from '../templates/Template.types';
import ActionList from './ActionList/ActionList';
import {
    classes,
    Root,
    ActionPanelToggler
} from './ActionListPanel.styles';
import {
    ActionListPanelProps,
    Filters as GroupFilters,
    GroupProperties,
    ListPanelTab
} from './ActionListPanel.types';
import ActionSearch from './ActionSearch';
import FilterModal from './FilterModal';
import { Item } from './ListGroup';
import useGroupReducer, { groupActions } from './useGroupsReducer';

const filterModalInitialState: GroupFilters = {
    groupNames: [],
    actionName: null,
    currentTab: ListPanelTab.ACTIONS
};

// eslint-disable-next-line max-lines-per-function
const ActionListPanel: FC<ActionListPanelProps> = memo(props => {
    const { modeler } = useModelerContext();
    const [filters, setFilters] = useState<GroupFilters>(
        filterModalInitialState
    );
    const [openDrawer, setOpenDrawer] = useState(true);
    const [filterModalEl, setFilterModalEl] =
        useState<HTMLButtonElement | null>(null);

    const { byId, external } = useSelector(state => state.action.bpmnActions);
    const internalActionsGroups = useInternalActionsGroups();
    const templatesGroups = useTemplatesGroups();
    const { translate } = useTranslations();

    const actionGroups: GroupProperties[] = useMemo(() => {
        const externalActionsGroup = external.map(
            externalId => byId[externalId]
        );
        const completeActionsGroups = {
            ...internalActionsGroups,
            external: {
                ...internalActionsGroups.external,
                items: [...externalActionsGroup]
            }
        };

        const getGroupList = (
            group: object,
            isTemplate: boolean
        ): GroupProperties[] =>
            Object.entries(group).map(([key, { items, label }]) => ({
                key,
                items,
                label,
                isTemplate
            }));

        // prettier-ignore
        return [
            ...getGroupList(completeActionsGroups, false), 
            ...getGroupList(templatesGroups, true)
        ];
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [external, i18n.language, templatesGroups]);

    const [openGroupsState, dispatchGroups] = useGroupReducer(
        Object.fromEntries(actionGroups.map(({ key }) => [key, false]))
    );

    const handleAction = (event, action: IBpmnAction) => {
        const actionToBPMNElement = ActionToBPMNElement.from(modeler);

        let shape;
        switch (action.runner) {
            case Runner.BROWSER_BACKGROUND_SCRIPT:
            case Runner.BROWSER_FRONTEND_SCRIPT:
            case Runner.DESKTOP_SCRIPT:
                shape = actionToBPMNElement.createElement(
                    TaskType.ServiceTask,
                    _.cloneDeep(action)
                );
                break;
            case Runner.NO_RUNNER:
                shape = actionToBPMNElement.createElement(
                    TaskType.Task,
                    _.cloneDeep(action)
                );
                break;
            default:
                break;
        }

        modeler.get('create').start(event, shape);
    };

    // eslint-disable-next-line complexity
    const handleItemClick = (event, item: Item) => {
        if (!item) return;
        if (CustomLoopHandler[item.id]) {
            // Handler for loops - temporary solution, should be refactored/moved to templateHandler
            CustomLoopHandler[item.id](event, modeler);
        } else if (internalTemplates[item.id]) {
            CustomTemplateHandler(event, modeler, internalTemplates[item.id]);
        } else if (byId[item.id]) {
            // Handler for external actions
            handleAction(event, byId[item.id]);
        } else if (internalBpmnActions[item.id]) {
            handleAction(event, internalBpmnActions[item.id]);
        } else {
            throw new Error(
                translate('Process.Details.Modeler.ActionListPanel.Error')
            );
        }
    };

    const handleSearchPhrasechange = (value: string) => {
        dispatchGroups(
            value.length ? groupActions.openAll() : groupActions.closeAll()
        );

        setFilters(filters => ({
            ...filters,
            actionName: value || null
        }));
    };

    const handleDrawerAction = () => {
        setOpenDrawer(prevState => !prevState);
    };

    const onTabChange = (
        _event: React.SyntheticEvent,
        newValue: ListPanelTab
    ) => {
        setFilters(filters => ({
            ...filters,
            groupNames: [],
            currentTab: newValue
        }));
    };

    const currentTabGroups: GroupProperties[] = useMemo(
        () =>
            actionGroups.filter(
                ({ isTemplate }) =>
                    isTemplate ===
                    (filters.currentTab === ListPanelTab.TEMPLATES)
            ),
        [actionGroups, filters]
    );

    const filteredGroups: GroupProperties[] = useMemo(
        () =>
            currentTabGroups
                .map(group => {
                    const { label, items } = group;
                    const { groupNames, actionName } = filters;

                    // filter group by name
                    // eslint-disable-next-line array-callback-return
                    if (groupNames.length && !groupNames.includes(label)) {
                        return null;
                    }

                    const filteredItems = actionName
                        ? // TODO: Merge IBpmnAction and TemplatesSchema into single interface
                        (items as IBpmnAction[]).filter(({ label }) =>
                            label
                                .toLowerCase()
                                .includes(actionName.toLowerCase())
                        )
                        : (items as TemplatesSchema[]);

                    // eslint-disable-next-line array-callback-return
                    if (!filteredItems.length) return;

                    return { ...group, items: filteredItems };
                })
                .filter(el => el),
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [actionGroups, filters]
    );

    return (
        <Root open={openDrawer}>
            <ActionPanelToggler
                onClick={handleDrawerAction}
                open={openDrawer}
            >
                <IconButton>
                    <ChevronRightIcon
                        fontSize="medium"
                        className={clsx(classes.drawerIcon)}
                    />
                </IconButton>
            </ActionPanelToggler>
            <Drawer
                variant="persistent"
                anchor="left"
                open={openDrawer}
                className={classes.drawer}
                classes={{
                    paper: clsx(classes.drawerPaper)
                }}
            >
                <Box
                    height={`calc(100vh - ${props.offsetTop}px)`}
                    display="flex"
                    flexDirection="column">
                    <Tabs
                        scrollButtons="auto"
                        textColor="secondary"
                        value={filters.currentTab}
                        className={clsx(classes.tabs)}
                        onChange={onTabChange}
                        variant="fullWidth">
                        <Tab
                            label={translate(
                                'Process.Details.Modeler.ActionListPanel.Tabs.Actions.Label'
                            )}
                            value={ListPanelTab.ACTIONS}
                        />
                        <Tab
                            label={translate(
                                'Process.Details.Modeler.ActionListPanel.Tabs.Templates.Label'
                            )}
                            value={ListPanelTab.TEMPLATES}
                        />
                    </Tabs>
                    <Box className={classes.filterModalAnchor}>
                        <ActionSearch
                            onSearchPhraseChange={handleSearchPhrasechange}
                            label={translate(
                                'Process.Details.Modeler.ActionListPanel.Search.Label'
                            )}
                        />
                        <Badge
                            badgeContent={filters.groupNames.length}
                            color="primary"
                            overlap="circular"
                            variant="dot">
                            <IconButton
                                onClick={e => setFilterModalEl(e.currentTarget)}
                                className={classes.filterButton}>
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
                    <ActionList
                        groups={filteredGroups}
                        dispatchGroups={dispatchGroups}
                        handleItemClick={handleItemClick}
                        openGroupsState={openGroupsState}
                        filters={filters}
                    />
                </Box>
            </Drawer>
        </Root>
    );
});

ActionListPanel.displayName = 'ActionListPanel';
export default ActionListPanel;
