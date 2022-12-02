import React, { useEffect, useImperativeHandle, useRef, useState } from 'react';

import 'bpmn-js/dist/assets/diagram-js.css';
import 'bpmn-js/dist/assets/bpmn-font/css/bpmn-embedded.css';
import propertiesPanelModule from 'bpmn-js-properties-panel';
import BpmnIoModeler from 'bpmn-js/lib/Modeler';
import BpmnViewer from 'bpmn-js/lib/Viewer';
import 'bpmn-js-properties-panel/dist/assets/bpmn-js-properties-panel.css';
import i18n from 'i18next';
import _ from 'lodash';
import Hotkeys from 'react-hot-keys';
import 'react-resizable/css/styles.css';
import { RunboticModdleDescriptor } from 'runbotics-common';


import InfoPanel from '#src-app/components/InfoPanel';

import ResizableDrawer from '#src-app/components/ResizableDrawer';

import If from '#src-app/components/utils/If';

import useNavigationLock from '#src-app/hooks/useNavigationLock';

import { translate } from '#src-app/hooks/useTranslations';

import useUpdateEffect from '#src-app/hooks/useUpdateEffect';

import BpmnFormProvider from '#src-app/providers/BpmnForm.provider';

import { useDispatch, useSelector } from '#src-app/store';

import { CommandStackInfo, processActions } from '#src-app/store/slices/Process';

import { ProcessBuildTab } from '#src-app/types/sidebar';

import {
    copy,
    ModelerContainer,
    ModelerImperativeHandle,
    ModelerProps,
    paste,
    Wrapper,
    ModelerArea,
    centerCanvas,
} from '.';
import ImportExportPanel from '../../ModelerPanels/ImportExportPanel';
import ModelerToolboxPanel from '../../ModelerPanels/ModelerToolboxPanel';
import RunSavePanel from '../../ModelerPanels/RunSavePanel';
import SidebarNavigationPanel from '../../SidebarNavigationPanel';
import ActionListPanel from '../ActionListPanel';
import { BPMNElement } from '../BPMN';
import internalBpmnActions from '../ConfigureActionPanel/Actions';
import ConfigureActionPanel from '../ConfigureActionPanel/ConfigureActionPanel';
import emptyBpmn from '../empty.bpmn';
import Clipboard from '../extensions/Clipboard';
import ZoomScrollModule from '../extensions/zoomscroll';
import modelerPalette from '../modeler-palette';
import BasicModelerModule from '../Modeler.module';
import { applyModelerElement } from '../utils';


const ELEMENTS_PROPERTIES_WHITELIST = ['bpmn:ServiceTask', 'bpmn:SequenceFlow', 'bpmn:SubProcess'];
const initialCommandStackInfo: CommandStackInfo = {
    commandStackIdx: -1,
    commandStackSize: 0,
};

const BpmnModeler = React.forwardRef<ModelerImperativeHandle, ModelerProps>(
    // eslint-disable-next-line max-lines-per-function
    ({ readOnly, definition, offsetTop, onSave, onImport, onExport, process }, ref) => {
        const dispatch = useDispatch();
        const [modeler, setModeler] = useState<BpmnIoModeler>(null);
        const [selectedElement, setSelectedElement] = useState<BPMNElement>(null);
        const [commandStack, setCommandStack] = useState<CommandStackInfo>(initialCommandStackInfo);
        const [imported, setImported] = useState(false);
        const [currentTab, setCurrentTab] = useState<ProcessBuildTab | null>(null);
        const modelerRef = useRef<BpmnIoModeler>(modeler);
        const externalBpmnActions = useSelector((state) => state.action.bpmnActions.byId);
        const appliedActivities = useSelector((state) => state.process.modeler.appliedActivities);
        const { isSaveDisabled } = useSelector((state) => state.process.modeler);

        useNavigationLock(!isSaveDisabled, translate('Process.Modeler.LoseModelerChangesContent'));
        //TODO - add a CUSTOM warning when the user tries to leave the page without saving
        const [prevLanguage, setPrevLanguage] = useState<string>(null);

        useEffect(() => {
            modelerRef.current = modeler;
        }, [modeler, offsetTop]);

        useEffect(() => {
            if (prevLanguage !== i18n.language && modeler) modeler._container.remove();

            setPrevLanguage(i18n.language);

            if (!offsetTop) return;
            let bpmnModeler: BpmnViewer | BpmnIoModeler;

            if (!readOnly) {
                const clipboard = new Clipboard();

                bpmnModeler = new BpmnIoModeler({
                    container: '#bpmn-modeler',
                    additionalModules: [
                        modelerPalette,
                        propertiesPanelModule,
                        BasicModelerModule,
                        { clipboard: ['value', clipboard] },
                        ZoomScrollModule,
                    ],
                    moddleExtensions: {
                        camunda: RunboticModdleDescriptor,
                    },
                    keyboard: {
                        bindTo: window,
                    },
                    width: '100%',
                    height: `calc(100vh - ${offsetTop}px)`,
                });
            } else {
                bpmnModeler = new BpmnViewer({
                    container: '#bpmn-modeler',
                });
            }

            const eventBus = bpmnModeler.get('eventBus');

            eventBus.on('commandStack.changed', () => {
                const { _stackIdx, _stack } = bpmnModeler.get('commandStack');

                setCommandStack({
                    commandStackIdx: _stackIdx,
                    commandStackSize: _stack.length,
                });

            });

            eventBus.on('commandStack.shape.delete.preExecute', () => {
                setSelectedElement(null);
            });

            eventBus.on('commandStack.connection.delete.preExecute', () => {
                setSelectedElement(null);
            });

            eventBus.on('commandStack.elements.create.postExecuted', (event: any) => {
                if (event.context.elements.length === 1) {
                    const element = event.context.elements[0];
                    setSelectedElement(element);
                    const externalAction = _.cloneDeep(externalBpmnActions[element?.businessObject.actionId]);
                    const action = externalAction ?? internalBpmnActions[element?.businessObject.actionId];
                    applyModelerElement({ modeler: bpmnModeler, element, action });
                    if (element.id.includes('Activity')) dispatch(processActions.addAppliedAction(element.id));
                }
                if (event.context.elements.length > 1)
                { event.context.elements.forEach((element) => {
                    const externalAction = _.cloneDeep(externalBpmnActions[element?.businessObject.actionId]);
                    const action = externalAction ?? internalBpmnActions[element?.businessObject.actionId];
                    applyModelerElement({ modeler: bpmnModeler, element, action });
                    if (element.id.includes('Activity')) dispatch(processActions.addAppliedAction(element.id));
                }); }
            });

            eventBus.on('element.click', (event: any) => {
                if (ELEMENTS_PROPERTIES_WHITELIST.includes(event.element.type)) {
                    setSelectedElement(event.element);
                } else {
                    setCurrentTab(null);
                    setSelectedElement(null);
                }
            });

            eventBus.on('connection.removed', () => {
                setCurrentTab(null);
            });

            eventBus.on('shape.removed', (event: any) => {
                setCurrentTab(null);
                dispatch(processActions.removeAppliedAction(event.element.id));
            });

            setModeler(bpmnModeler);

            // eslint-disable-next-line react-hooks/exhaustive-deps
        }, [readOnly, offsetTop, i18n.language]);

        useEffect(() => {
            if (!modeler) return;
            const { _elements } = modeler.get('elementRegistry');
            const modelerActivities = Object.keys(_elements).filter((elm) => elm.split('_')[0] === 'Activity');

            const isModelerInSync = _.isEqual(_.sortBy(modelerActivities), _.sortBy(appliedActivities));

            if (imported || (isModelerInSync && commandStack.commandStackIdx >= 0) ){
                dispatch(processActions.setSaveDisabled(false));
            }else {
                dispatch(processActions.setSaveDisabled(true));
            }
            // eslint-disable-next-line react-hooks/exhaustive-deps
        }, [appliedActivities, modeler, commandStack, imported]);

        useImperativeHandle(
            ref,
            () => ({
                export: async () => {
                    const result = await modelerRef.current.saveXML({ format: true });
                    const { xml } = result;
                    return xml;
                },
            }),
            [],
        );

        const openBpmnDiagram = async (xml: any) => {
            if (!modeler) return;
            try {
                await modeler.importXML(xml);
                const elementRegistry = modeler.get('elementRegistry');
                const elementIds = Object.keys(elementRegistry._elements);
                const activityIds = elementIds.filter((elm) => elm.split('_')[0] === 'Activity');
                dispatch(processActions.setSaveDisabled(true));
                dispatch(processActions.setAppliedActions(activityIds));
                const canvas = modeler.get('canvas');
                canvas.zoom('fit-viewport', 'auto');
            } catch (error) {
                // eslint-disable-next-line no-console
                if (error) console.log('fail import xml');
            }
        };

        useUpdateEffect(() => {
            if (currentTab !== ProcessBuildTab.CONFIGURE_ACTION) setSelectedElement(null);
        }, [currentTab]);

        useUpdateEffect(() => {
            if (selectedElement) setCurrentTab(ProcessBuildTab.CONFIGURE_ACTION);
        }, [selectedElement]);

        useEffect(() => {
            if (modeler) openBpmnDiagram(definition ?? emptyBpmn);
            // eslint-disable-next-line react-hooks/exhaustive-deps
        }, [modeler, definition]);

        const onCopy = () => {
            copy(modeler, selectedElement.id);
        };

        const onPaste = () => {
            paste(modeler, selectedElement.id);
        };

        const onCenter = () => {
            centerCanvas(modeler);
        };

        const onZoom = (step: number) => {
            modeler?.get('zoomScroll').stepZoom(step);
        };

        const canRedo = commandStack.commandStackIdx + 1 === commandStack.commandStackSize;

        const canUndo = !(commandStack.commandStackIdx + 1 > 0);

        const onUndo = () => {
            modeler?.get('commandStack')?.undo();
        };

        const onRedo = () => {
            modeler?.get('commandStack')?.redo();
        };

        return (
            <Hotkeys keyName="command+c,ctrl+c" disabled={selectedElement === null} onKeyDown={onCopy}>
                <Hotkeys keyName="command+b,ctrl+b" disabled={selectedElement === null} onKeyDown={onPaste}>
                    <Wrapper offsetTop={offsetTop}>
                        <ActionListPanel modeler={modeler} offsetTop={offsetTop} />
                        <ModelerArea>
                            <ModelerContainer id="bpmn-modeler" />
                            <RunSavePanel
                                process={process}
                                onSave={() => {
                                    onSave();
                                    setCommandStack(initialCommandStackInfo);
                                    setImported(false);
                                }}
                                onRunClick={() => setCurrentTab(ProcessBuildTab.RUN_INFO)}
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
                            {/* TODO <RouteLeavingGuard when={!isSaveDisabled} navigate={(path) => history.push(path)} /> */}
                            <SidebarNavigationPanel
                                selectedTab={currentTab}
                                onTabToggle={(tabIndex) => setCurrentTab(tabIndex)}
                            />
                        </ModelerArea>
                        <ResizableDrawer open={currentTab !== null}>
                            <If condition={currentTab === ProcessBuildTab.CONFIGURE_ACTION}>
                                <BpmnFormProvider
                                    element={selectedElement}
                                    modeler={modeler}
                                    process={process}
                                    commandStack={commandStack}
                                >
                                    <ConfigureActionPanel />
                                </BpmnFormProvider>
                            </If>

                            <If condition={currentTab === ProcessBuildTab.RUN_INFO}>
                                <InfoPanel />
                            </If>
                        </ResizableDrawer>
                    </Wrapper>
                </Hotkeys>
            </Hotkeys>
        );
    },
);
BpmnModeler.displayName = 'BpmnModeler';
export default BpmnModeler;
