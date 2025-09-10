/* eslint-disable @typescript-eslint/no-shadow */
/* eslint-disable consistent-return */
import React, { FC, memo, useEffect, useMemo, useState } from 'react';

import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import FilterAltOutlinedIcon from '@mui/icons-material/FilterAltOutlined';
import { Badge, Box, Drawer, IconButton, Tab, Tabs } from '@mui/material';
import clsx from 'clsx';
import _ from 'lodash';

import { FeatureKey } from 'runbotics-common';

import If from '#src-app/components/utils/If';
import useFeatureKey from '#src-app/hooks/useFeatureKey';
import useInternalActionsGroups from '#src-app/hooks/useInternalActionsGroups';
import { useModelerContext } from '#src-app/hooks/useModelerContext';
import { useTemplatesGroups } from '#src-app/hooks/useTemplatesGroups';
import useTranslations from '#src-app/hooks/useTranslations';

import { useDispatch, useSelector } from '#src-app/store';

import { processActions } from '#src-app/store/slices/Process';
import i18n from '#src-app/translations/i18n';

import ActionList from './ActionList/ActionList';
import { ActionPanelToggler, classes, Root } from './ActionListPanel.styles';
import { ActionListPanelProps, Filters as GroupFilters, GroupProperties, ListPanelTab } from './ActionListPanel.types';
import ActionSearch from './ActionSearch';
import FilterModal from './FilterModal';
import { Item } from './ListGroup';
import useGroupReducer, { groupActions } from './useGroupsReducer';
import internalBpmnActions from '../../../../../Actions';
import { IBpmnAction, Runner } from '../../../../../Actions/types';
import { internalTemplates } from '../../../../../Templates';
import { ActionToBPMNElement, TaskType } from '../ActionFormPanel/ActionToBPMNElement';
import CustomLoopHandler from '../ActionFormPanel/handlers/CustomLoopHandler';
import CustomTemplateHandler from '../ActionFormPanel/handlers/CustomTemplateHandler';
import { TemplatesSchema } from '../templates/Template.types';

const filterModalInitialState: GroupFilters = {
    groupNames: [],
    actionName: null,
    currentTab: ListPanelTab.ACTIONS,
};

// eslint-disable-next-line max-lines-per-function
const ActionListPanel: FC<ActionListPanelProps> = memo((props) => {
    const dispatch = useDispatch();
    const { modeler } = useModelerContext();
    const [filters, setFilters] = useState<GroupFilters>(
        filterModalInitialState
    );
    const [openDrawer, setOpenDrawer] = useState(true);
    const [filterModalEl, setFilterModalEl] =
        useState<HTMLButtonElement | null>(null);

    const { byId, external } = useSelector((state) => state.action.bpmnActions);
    const {
        pluginBpmnActions,
        pluginBpmnActionsMap,
        pluginActionsGroupLabelMap,
    } = useSelector((state) => state.plugin);
    const internalActionsGroups = useInternalActionsGroups();
    const templatesGroups = useTemplatesGroups();
    const { translate } = useTranslations();
    const hasActionListAccess = useFeatureKey(
        [
            FeatureKey.PROCESS_ACTIONS_LIST,
            FeatureKey.PROCESS_ACTIONS_LIST_ADVANCED,
        ],
        { oneOf: true }
    );
    const hasTemplateListAccess = useFeatureKey([
        FeatureKey.PROCESS_TEMPLATES_LIST,
    ]);
    const [isBlacklistLoaded, setIsBlacklistLoaded] = useState(false);

    useEffect(() => {
        dispatch(processActions.getBlacklistedActions())
            .unwrap()
            .then((result) => {
                dispatch(
                    processActions.setProcessBlacklistActions({
                        actionIds: result.actionIds,
                        actionGroups: result.actionGroups,
                    })
                );
                setIsBlacklistLoaded(true);
            })
            .catch((e) => setIsBlacklistLoaded(true));
    }, []);

    const actionGroups: GroupProperties[] = useMemo(() => {
        const externalActionsGroup = external.map(
            (externalId) => byId[externalId]
        );
        const builtinActionsGroups: Record<
            string,
            { items: IBpmnAction[]; label: string }
        > = {
            ...internalActionsGroups,
            external: {
                ...internalActionsGroups.external,
                items: [...externalActionsGroup],
            },
        };

        let completeActionsGroups = { ...builtinActionsGroups };
        for (const [pluginKey, actions] of pluginBpmnActionsMap.entries()) {
            const actionGroupName = pluginKey.split('.')[1];
            const actionGroupContent = completeActionsGroups[actionGroupName];

            completeActionsGroups = {
                ...completeActionsGroups,
                [actionGroupName]: {
                    label:
                        actionGroupContent?.label ??
                        pluginActionsGroupLabelMap.get(pluginKey)(translate),
                    items: actionGroupContent
                        ? [
                            ...actionGroupContent.items,
                            ...Object.values(actions),
                        ]
                        : Object.values(actions),
                },
            };
        }

        const getGroupList = (
            group: object,
            isTemplate: boolean
        ): GroupProperties[] =>
            Object.entries(group).map(([key, { items, label }]) => ({
                key,
                items,
                label,
                isTemplate,
            }));

        // prettier-ignore
        return [
            ...getGroupList(completeActionsGroups, false),
            ...getGroupList(templatesGroups, true),
        ];
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [external, i18n.language, templatesGroups, pluginBpmnActionsMap]);

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

    const handleItemClick = (event, item: Item) => {
        if (!item) return;
        if (CustomLoopHandler[item.id]) {
            // Handler for loops - temporary solution, should be refactored/moved to templateHandler
            CustomLoopHandler[item.id](event, modeler);
        } else if (internalTemplates[item.id]) {
            CustomTemplateHandler(event, modeler, internalTemplates[item.id]);
        } else if (pluginBpmnActions[item.id]) {
            handleAction(event, pluginBpmnActions[item.id]);
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

    const handleSearchPhraseChange = (value: string) => {
        dispatchGroups(
            value.length ? groupActions.openAll() : groupActions.closeAll()
        );

        setFilters((filters) => ({
            ...filters,
            actionName: value || null,
        }));
    };

    const handleDrawerAction = () => {
        setOpenDrawer((prevState) => !prevState);
    };

    const onTabChange = (
        _event: React.SyntheticEvent,
        newValue: ListPanelTab
    ) => {
        setFilters((filters) => ({
            ...filters,
            groupNames: [],
            currentTab: newValue,
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
    ).sort((groupA, groupB) => groupA.label.localeCompare(groupB.label));

    const filteredGroups: GroupProperties[] = useMemo(
        () =>
            currentTabGroups
                .map((group) => {
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

                    const sortedItems = filteredItems.sort((a, b) =>
                        a.label.localeCompare(b.label)
                    );

                    return { ...group, items: sortedItems };
                })
                .filter(Boolean),
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [actionGroups, filters]
    );

    const tabs = [
        {
            name: ListPanelTab.ACTIONS,
            label: translate(
                'Process.Details.Modeler.ActionListPanel.Tabs.Actions.Label'
            ),
            accessible: hasActionListAccess,
        },
        {
            name: ListPanelTab.TEMPLATES,
            label: translate(
                'Process.Details.Modeler.ActionListPanel.Tabs.Templates.Label'
            ),
            accessible: hasTemplateListAccess,
        },
    ].filter((tab) => tab.accessible);

    return (
        <Root open={openDrawer}>
            <ActionPanelToggler onClick={handleDrawerAction} open={openDrawer}>
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
                    paper: clsx(classes.drawerPaper),
                }}
            >
                <Box
                    height={`calc(100vh - ${props.offsetTop}px)`}
                    display="flex"
                    flexDirection="column"
                >
                    <If condition={tabs.length > 1}>
                        <Tabs
                            scrollButtons="auto"
                            textColor="secondary"
                            value={filters.currentTab}
                            className={clsx(classes.tabs)}
                            onChange={onTabChange}
                            variant="fullWidth"
                        >
                            {tabs.map((tab) => (
                                <Tab
                                    key={tab.name}
                                    label={tab.label}
                                    value={tab.name}
                                />
                            ))}
                        </Tabs>
                    </If>
                    <Box className={classes.filterModalAnchor}>
                        <ActionSearch
                            onSearchPhraseChange={handleSearchPhraseChange}
                            label={translate(
                                'Process.Details.Modeler.ActionListPanel.Search.Label'
                            )}
                        />
                        <Badge
                            badgeContent={filters.groupNames.length}
                            color="primary"
                            overlap="circular"
                            variant="dot"
                        >
                            <IconButton
                                onClick={(e) =>
                                    setFilterModalEl(e.currentTarget)
                                }
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
                    <If condition={isBlacklistLoaded}>
                        <ActionList
                            groups={filteredGroups}
                            dispatchGroups={dispatchGroups}
                            handleItemClick={handleItemClick}
                            openGroupsState={openGroupsState}
                            filters={filters}
                        />
                    </If>
                </Box>
            </Drawer>
        </Root>
    );
});

ActionListPanel.displayName = 'ActionListPanel';
export default ActionListPanel;
