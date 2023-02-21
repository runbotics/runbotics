import React, { useEffect, useImperativeHandle, useState } from 'react';

import 'bpmn-js/dist/assets/diagram-js.css';
import 'bpmn-js/dist/assets/bpmn-font/css/bpmn-embedded.css';
import BpmnIoModeler from 'bpmn-js/lib/Modeler';
import 'bpmn-js-properties-panel/dist/assets/bpmn-js-properties-panel.css';
import i18n from 'i18next';
import Hotkeys from 'react-hot-keys';
import 'react-resizable/css/styles.css';

import InfoPanel from '#src-app/components/InfoPanel';
import ResizableDrawer from '#src-app/components/ResizableDrawer';
import If from '#src-app/components/utils/If';
import { isModelerInSync } from '#src-app/hooks/useModelerListeners';
import useModelerListeners from '#src-app/hooks/useModelerListeners/useModelerListeners';
import useNavigationLock from '#src-app/hooks/useNavigationLock';
import useTranslations from '#src-app/hooks/useTranslations';
import useUpdateEffect from '#src-app/hooks/useUpdateEffect';
import ModelerProvider from '#src-app/providers/ModelerProvider';
import { useDispatch, useSelector } from '#src-app/store';

import {
    CommandStackInfo,
    processActions,
} from '#src-app/store/slices/Process';

import { ProcessBuildTab } from '#src-app/types/sidebar';

import {
    centerCanvas,
    ModelerArea,
    ModelerContainer,
    ModelerImperativeHandle,
    ModelerProps,
    initializeBpmnDiagram,
    Wrapper,
} from '.';
import ImportExportPanel from '../../ModelerPanels/ImportExportPanel';
import ModelerToolboxPanel from '../../ModelerPanels/ModelerToolboxPanel';
import RunSavePanel from '../../ModelerPanels/RunSavePanel';
import SidebarNavigationPanel from '../../SidebarNavigationPanel';
import ActionFormPanel from '../ActionFormPanel';
import ActionListPanel from '../ActionListPanel';
import emptyBpmn from '../extensions/config/empty.bpmn';

import { getBpmnModelerConfig } from './BpmnModeler.config';

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
        const [imported, setImported] = useState(false);
        const [currentTab, setCurrentTab] = useState<ProcessBuildTab | null>(
            null
        );
        const [prevLanguage, setPrevLanguage] = useState<string>(null);
        const { modelerListeners } = useModelerListeners({ setCurrentTab });

        const {
            isSaveDisabled,
            selectedElement,
            commandStack,
            appliedActivities,
            errors,
        } = useSelector((state) => state.process.modeler);

        // eslint-disable-next-line complexity

        useNavigationLock(
            !isSaveDisabled,
            translate('Process.Modeler.LoseModelerChangesContent')
        );

        useEffect(() => {
            if (prevLanguage !== i18n.language && modeler) {
                modeler?._container.remove();
            }

            setPrevLanguage(i18n.language);

            if (!offsetTop) return;

            const bpmnModeler: BpmnIoModeler = new BpmnIoModeler(
                getBpmnModelerConfig(offsetTop)
            );

            const eventBus = bpmnModeler.get('eventBus');

            const listeners = modelerListeners(bpmnModeler);

            for (const listenerKey in listeners) {
                eventBus.on(listenerKey, listeners[listenerKey]);
            }

            setModeler(bpmnModeler);
            // eslint-disable-next-line react-hooks/exhaustive-deps
        }, [offsetTop, i18n.language]);

        useEffect(() => {
            dispatch(
                processActions.setSaveDisabled(
                    !isModelerInSync({
                        appliedActivities,
                        modeler,
                        commandStack,
                        errors,
                        imported,
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
        }, [modeler, definition]);

        useEffect(() => {
            modelerRef.current = modeler;
        }, [modeler, offsetTop]);

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

        return (
            <Hotkeys
                keyName="Command+s,Control+s"
                onKeyDown={(_, e) => {
                    e.preventDefault();
                    if (isSaveDisabled) return;
                    onSave();
                    dispatch(
                        processActions.setCommandStack(initialCommandStackInfo)
                    );
                    setImported(false);
                }}
            >
                <ModelerProvider modeler={modeler}>
                    <Wrapper offsetTop={offsetTop}>
                        <ActionListPanel offsetTop={offsetTop} />
                        <ModelerArea>
                            <ModelerContainer id="bpmn-modeler" />
                            <RunSavePanel
                                process={process}
                                onSave={() => {
                                    onSave();
                                    dispatch(
                                        processActions.setCommandStack(
                                            initialCommandStackInfo
                                        )
                                    );
                                    setImported(false);
                                }}
                                onRunClick={() =>
                                    setCurrentTab(ProcessBuildTab.RUN_INFO)
                                }
                            />
                            <ImportExportPanel
                                onExport={onExport}
                                onImport={(e) => {
                                    onImport(e);
                                    setImported(true);
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
                            <If
                                condition={
                                    currentTab ===
                                    ProcessBuildTab.CONFIGURE_ACTION
                                }
                            >
                                <ActionFormPanel />
                            </If>
                            <If
                                condition={
                                    currentTab === ProcessBuildTab.RUN_INFO
                                }
                            >
                                <InfoPanel />
                            </If>
                        </ResizableDrawer>
                    </Wrapper>
                </ModelerProvider>
            </Hotkeys>
        );
    }
);
BpmnModeler.displayName = 'BpmnModeler';
export default BpmnModeler;
