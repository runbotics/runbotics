import React, { useEffect, useImperativeHandle, useState } from 'react';

import 'bpmn-js/dist/assets/diagram-js.css';
import 'bpmn-js/dist/assets/bpmn-font/css/bpmn-embedded.css';
import BpmnIoModeler from 'bpmn-js/lib/Modeler';
import 'bpmn-js-properties-panel/dist/assets/bpmn-js-properties-panel.css';
import i18n from 'i18next';
import { If, Show } from 'multi-condition';
import { useRouter } from 'next/router';
import Hotkeys from 'react-hot-keys';
import { ActionCredentialType, isProcessInstanceActive } from 'runbotics-common';

import 'react-resizable/css/styles.css';
import InfoPanel from '#src-app/components/InfoPanel';
import VariablesPanel from '#src-app/components/ProcessVariablesPanel/VariablesPanel';
import ResizableDrawer from '#src-app/components/ResizableDrawer';
import useModelerListener, {
    isModelerSync,
} from '#src-app/hooks/useModelerListener';
import useNavigationLock from '#src-app/hooks/useNavigationLock';
import useTranslations from '#src-app/hooks/useTranslations';
import useUpdateEffect from '#src-app/hooks/useUpdateEffect';
import ModelerProvider from '#src-app/providers/ModelerProvider';
import { useDispatch, useSelector } from '#src-app/store';
import {
    CommandStackInfo,
    processActions,
    processSelector,
} from '#src-app/store/slices/Process';
import { processInstanceSelector } from '#src-app/store/slices/ProcessInstance';
import { ProcessBuildTab } from '#src-app/types/sidebar';
import { CLICKABLE_ITEM } from '#src-app/utils/Mixpanel/types';
import { identifyPageByUrl, recordItemClick } from '#src-app/utils/Mixpanel/utils';

import {
    centerCanvas,
    ModelerArea,
    ModelerContainer,
    ModelerImperativeHandle,
    ModelerProps,
    initializeBpmnDiagram,
    Wrapper,
} from '.';
import { getBpmnModelerConfig } from './BpmnModeler.config';
import ImportExportPanel from '../../ModelerPanels/ImportExportPanel';
import ModelerToolboxPanel from '../../ModelerPanels/ModelerToolboxPanel';
import RunSavePanel from '../../ModelerPanels/RunSavePanel';
import SidebarNavigationPanel from '../../SidebarNavigationPanel';
import ActionFormPanel from '../ActionFormPanel';
import ActionListPanel from '../ActionListPanel';
import emptyBpmn from '../extensions/config/empty.bpmn';

const initialCommandStackInfo: CommandStackInfo = {
    commandStackIdx: -1,
    commandStackSize: 0,
};

const BpmnModeler = React.forwardRef<ModelerImperativeHandle, ModelerProps>(
    // eslint-disable-next-line max-lines-per-function
    ({ definition, offsetTop, onSave, onImport, onExport, process }, ref) => {
        const dispatch = useDispatch();
        const { translate } = useTranslations();
        const [modeler, setModeler] = useState<BpmnIoModeler>(null);
        const modelerRef = React.useRef<BpmnIoModeler>(null);
        const [currentTab, setCurrentTab] = useState<ProcessBuildTab | null>(
            null
        );
        const [prevLanguage, setPrevLanguage] = useState<string>(null);
        const { loadedPlugins } = useSelector((state) => state.plugin);
        const { draft: { credentials: processCredentials } } = useSelector(processSelector);
        const _coveredCredentialTypes: ActionCredentialType[] = processCredentials.map(pc => pc?.credential?.template?.name);
        const { modelerListener, validateUnknownElement } = useModelerListener({
            setCurrentTab,
        });
        const { pathname } = useRouter();

        const processState = useSelector((state) => state.process.modeler);
        const {
            isSaveDisabled,
            selectedElement,
            commandStack,
            appliedActivities,
            errors,
            imported,
            customValidationErrors,
            activeDrag,
        } = processState;

        useNavigationLock(
            !isSaveDisabled,
            translate('Process.Modeler.LoseModelerChangesContent')
        );

        const processInstances = useSelector(processInstanceSelector);
        const { processInstance } = processInstances.active;

        useEffect(() => {
            if (processInstance && isProcessInstanceActive(processInstance.status)) {
                setCurrentTab(ProcessBuildTab.RUN_INFO);
            }
        }, [processInstance]);

        useEffect(() => {
            if (prevLanguage !== i18n.language && modeler) {
                modeler?._container.remove();
            }

            setPrevLanguage(i18n.language);

            if (!offsetTop) return undefined;

            const bpmnModeler: BpmnIoModeler = new BpmnIoModeler(
                getBpmnModelerConfig(offsetTop)
            );

            const eventBus = bpmnModeler.get('eventBus');

            const listeners = modelerListener(bpmnModeler);

            for (const listenerKey in listeners) {
                eventBus.on(listenerKey, listeners[listenerKey]);
            }

            setModeler(bpmnModeler);

            return () => {
                for (const listenerKey in listeners) {
                    eventBus.off(listenerKey, listeners[listenerKey]);
                }
            };
            // eslint-disable-next-line react-hooks/exhaustive-deps
        }, [offsetTop, i18n.language]);

        useEffect(() => {
            dispatch(processActions.getProcessCredentials({ resourceId: process?.id }));
            // eslint-disable-next-line react-hooks/exhaustive-deps
        }, []);

        useEffect(() => {
            dispatch(processActions.clearErrors());
            // eslint-disable-next-line react-hooks/exhaustive-deps
        }, [processCredentials, i18n.language]);

        useEffect(() => {
            dispatch(
                processActions.setSaveDisabled(
                    !isModelerSync({
                        appliedActivities,
                        modeler,
                        commandStack,
                        errors,
                        customValidationErrors,
                        imported,
                        activeDrag
                    })
                )
            );
            // eslint-disable-next-line react-hooks/exhaustive-deps
        }, [
            appliedActivities,
            modeler,
            commandStack.commandStackIdx,
            commandStack.commandStackSize,
            imported,
            selectedElement,
            customValidationErrors,
            errors,
        ]);

        useImperativeHandle(
            ref,
            () => ({
                export: async () => {
                    const result = await modelerRef.current.saveXML({
                        format: true,
                    });
                    const { xml } = result;
                    return xml;
                },
            }),
            []
        );

        useUpdateEffect(() => {
            if (currentTab !== ProcessBuildTab.CONFIGURE_ACTION) {
                dispatch(processActions.resetSelection());
            }
        }, [currentTab]);

        useUpdateEffect(() => {
            if (selectedElement) {
                setCurrentTab(ProcessBuildTab.CONFIGURE_ACTION);
            }
        }, [selectedElement]);

        useEffect(() => {
            if (modeler) {
                initializeBpmnDiagram(modeler, definition ?? emptyBpmn).then(
                    (modelerActivities) => {
                        dispatch(processActions.setSaveDisabled(true));
                        dispatch(
                            processActions.setAppliedActions(modelerActivities)
                        );
                    }
                );
            }
            // eslint-disable-next-line react-hooks/exhaustive-deps
        }, [loadedPlugins, modeler, definition, process]);

        useEffect(() => {
            modelerRef.current = modeler;
        }, [modeler, offsetTop]);

        const handleSave = () => {
            debugger;
            recordItemClick({ itemName: CLICKABLE_ITEM.SAVE_BUTTON, sourcePage: identifyPageByUrl(pathname) });
            if (isSaveDisabled) return;
            onSave(modeler);
            dispatch(processActions.setCommandStack(initialCommandStackInfo));
            dispatch(processActions.setImported(false));
        };

        const onCenter = () => {
            centerCanvas(modeler);
        };

        const onZoom = (step: number) => {
            modeler?.get('zoomScroll').stepZoom(step);
        };

        const canRedo =
            commandStack.commandStackIdx + 1 === commandStack.commandStackSize;

        const canUndo = !(commandStack.commandStackIdx + 1 > 0);

        const onUndo = () => {
            modeler?.get('commandStack')?.undo();
        };

        const onRedo = () => {
            modeler.get('commandStack')?.redo();
        };

        const saveKeys = 'Command+s,Control+s';

        return (
            <Hotkeys
                keyName={saveKeys}
                onKeyDown={(_, e) => {
                    e.preventDefault();
                    handleSave();
                }}
            >
                <ModelerProvider modeler={modeler}>
                    <Wrapper offsetTop={offsetTop}>
                        <ActionListPanel offsetTop={offsetTop} />
                        <ModelerArea>
                            <ModelerContainer id="bpmn-modeler" />
                            <RunSavePanel
                                process={process}
                                onSave={handleSave}
                                onRunClick={() =>
                                    setCurrentTab(ProcessBuildTab.RUN_INFO)
                                }
                            />
                            <ImportExportPanel
                                onExport={onExport}
                                onImport={(e, additionalInfo) => {
                                    onImport(e, additionalInfo);
                                    setTimeout(() => {
                                        const { _elements } =
                                        modeler.get('elementRegistry');
                                        validateUnknownElement(
                                            _elements,
                                            modeler
                                        );
                                        dispatch(processActions.setImported(true));
                                    }, 200);
                                }}
                            />
                            <ModelerToolboxPanel
                                onCenter={onCenter}
                                onZoomIn={() => onZoom(1)}
                                onZoomOut={() => onZoom(-1)}
                                onUndo={onUndo}
                                onRedo={onRedo}
                                canUndo={canUndo}
                                canRedo={canRedo}
                            />
                            <SidebarNavigationPanel
                                selectedTab={currentTab}
                                onTabToggle={(tabIndex) =>
                                    setCurrentTab(tabIndex)
                                }
                            />
                        </ModelerArea>
                        <ResizableDrawer open={currentTab !== null}>
                            <Show>
                                <If condition={currentTab === ProcessBuildTab.CONFIGURE_ACTION}>
                                    <ActionFormPanel />
                                </If>
                                <If condition={currentTab === ProcessBuildTab.RUN_INFO}>
                                    <InfoPanel />
                                </If>
                                <If condition={currentTab === ProcessBuildTab.PROCESS_VARIABLES}>
                                    <VariablesPanel />
                                </If>
                            </Show>
                        </ResizableDrawer>
                    </Wrapper>
                </ModelerProvider>
            </Hotkeys>
        );
    }
);
BpmnModeler.displayName = 'BpmnModeler';
export default BpmnModeler;
