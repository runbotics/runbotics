import React, { useEffect, useImperativeHandle, useRef, useState } from 'react';
import 'bpmn-js/dist/assets/diagram-js.css';
import 'bpmn-js/dist/assets/bpmn-font/css/bpmn-embedded.css';
import BpmnIoModeler from 'bpmn-js/lib/Modeler';
import BpmnViewer from 'bpmn-js/lib/Viewer';
import propertiesPanelModule from 'bpmn-js-properties-panel';
import 'bpmn-js-properties-panel/dist/assets/bpmn-js-properties-panel.css';
import Hotkeys from 'react-hot-keys';
import 'react-resizable/css/styles.css';
import { RunboticModdleDescriptor } from 'runbotics-common';
import useAsyncEffect from 'src/hooks/useAsyncEffect';
import { useDispatch, useSelector } from 'src/store';
import { CommandStackInfo, processActions } from 'src/store/slices/Process';
import { ProcessBuildTab } from 'src/types/sidebar';
import InfoPanel from 'src/components/InfoPanel';
import useUpdateEffect from 'src/hooks/useUpdateEffect';
import BpmnFormProvider from 'src/providers/BpmnForm.provider';
import _ from 'lodash';
import emptyBpmn from '../empty.bpmn';
import BasicModelerModule from '../Modeler.module';
import ActionListPanel from '../ActionListPanel';
import ConfigureActionPanel from '../ConfigureActionPanel/ConfigureActionPanel';
import Clipboard from '../extensions/Clipboard';
import ZoomScrollModule from '../extensions/zoomscroll';
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
import { BPMNElement } from '../BPMN';
import internalBpmnActions from '../ConfigureActionPanel/Actions';
import { applyModelerElement } from '../utils';
import ImportExportPanel from '../../ModelerPanels/ImportExportPanel';
import RunSavePanel from '../../ModelerPanels/RunSavePanel';
import ModelerToolboxPanel from '../../ModelerPanels/ModelerToolboxPanel';
import LeavePromt from './LeavePromt';
import ResizableDrawer from 'src/components/ResizableDrawer';
import PanelNavigation from '../../PanelNavigation';
import modelerPalette from '../modeler-palette';

const ELEMENTS_PROPERTIES_WHITELIST = ['bpmn:ServiceTask', 'bpmn:SequenceFlow', 'bpmn:SubProcess'];
const initialCommandStackInfo: CommandStackInfo = {
    commandStackIdx: -1,
    commandStackSize: 0,
};

const BpmnModeler = React.forwardRef<ModelerImperativeHandle, ModelerProps>(
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

        useEffect(() => {
            modelerRef.current = modeler;
        }, [modeler, offsetTop]);

        useEffect(() => {
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

            eventBus.on('commandStack.changed', (e) => {
                const { _stackIdx, _stack } = bpmnModeler.get('commandStack');
                const isLastIndex = parseInt(_stackIdx) >= 0;

                setCommandStack({
                    commandStackIdx: _stackIdx,
                    commandStackSize: _stack.length,
                });

                if (isLastIndex || imported) {
                    dispatch(processActions.setSaveDisabled(false));
                } else {
                    dispatch(processActions.setSaveDisabled(true));
                }
            });

            eventBus.on('commandStack.shape.delete.preExecute', (e) => {
                setSelectedElement(null);
            });

            eventBus.on('commandStack.connection.delete.preExecute', (e) => {
                setSelectedElement(null);
            });

            eventBus.on('commandStack.elements.create.postExecuted', (event: any) => {
                if (event.context.elements.length === 1) {
                    const element = event.context.elements[0];
                    setSelectedElement(element);
                    const externalAction = _.cloneDeep(externalBpmnActions[element?.businessObject.actionId]);
                    const action = externalAction ?? internalBpmnActions[element?.businessObject.actionId];
                    applyModelerElement({ modeler: bpmnModeler, element, action });
                    if (element.id.includes('Activity')) {
                        dispatch(processActions.addAppliedAction(element.id));
                    }
                }
                if (event.context.elements.length > 1) {
                    event.context.elements.forEach((element) => {
                        const externalAction = _.cloneDeep(externalBpmnActions[element?.businessObject.actionId]);
                        const action = externalAction ?? internalBpmnActions[element?.businessObject.actionId];
                        applyModelerElement({ modeler: bpmnModeler, element, action });
                        if (element.id.includes('Activity')) {
                            dispatch(processActions.addAppliedAction(element.id));
                        }
                    });
                }
            });

            eventBus.on('element.click', (event: any) => {
                if (ELEMENTS_PROPERTIES_WHITELIST.includes(event.element.type)) {
                    setSelectedElement(event.element);
                } else {
                    setCurrentTab(null);
                    setSelectedElement(null);
                }
            });

            eventBus.on('connection.removed', (event: any) => {
                setCurrentTab(ProcessBuildTab.CONFIGURE_ACTION);
            });

            eventBus.on('shape.removed', (event: any) => {
                setCurrentTab(ProcessBuildTab.CONFIGURE_ACTION);
                dispatch(processActions.removeAppliedAction(event.element.id));
            });

            setModeler(bpmnModeler);
        }, [readOnly, offsetTop]);

        useEffect(() => {
            if (!modeler) return;
            const { _elements } = modeler.get('elementRegistry');
            const { _stackIdx } = modeler.get('commandStack');
            const modelerActivities = Object.keys(_elements).filter((elm) => elm.split('_')[0] === 'Activity');

            const isModelerInSync = _.isEqual(_.sortBy(modelerActivities), _.sortBy(appliedActivities));
            if ((isModelerInSync && parseInt(_stackIdx) > 0) || imported) {
                dispatch(processActions.setSaveDisabled(false));
            } else {
                dispatch(processActions.setSaveDisabled(true));
            }
        }, [appliedActivities, modeler]);

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
                if (!imported) {
                    dispatch(processActions.clearModelerState());
                    dispatch(processActions.setAppliedActions(activityIds));
                } else {
                    dispatch(processActions.setAppliedActions(activityIds));
                    setImported(false);
                }

                const canvas = modeler.get('canvas');
                canvas.zoom('fit-viewport', 'auto');
            } catch (error) {
                if (error) {
                    console.log('fail import xml');
                }
            }
        };

        useUpdateEffect(() => {
            if (currentTab !== ProcessBuildTab.CONFIGURE_ACTION) {
                setSelectedElement(null);
            }
        }, [currentTab]);

        useUpdateEffect(() => {
            if (selectedElement) {
                setCurrentTab(ProcessBuildTab.CONFIGURE_ACTION);
            }
        }, [selectedElement]);

        useAsyncEffect(async () => {
            if (modeler) {
                await openBpmnDiagram(definition ?? emptyBpmn);
            }
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
            <Hotkeys keyName="command+c,ctrl+c" disabled={selectedElement == null} onKeyDown={onCopy}>
                <Hotkeys keyName="command+b,ctrl+b" disabled={selectedElement == null} onKeyDown={onPaste}>
                    <Wrapper offsetTop={offsetTop}>
                        <ActionListPanel modeler={modeler} offsetTop={offsetTop} />
                        <ModelerArea>
                            <ModelerContainer id="bpmn-modeler" />
                            <RunSavePanel
                                process={process}
                                onSave={() => {
                                    onSave();
                                    setCommandStack(initialCommandStackInfo);
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
                            <LeavePromt />
                            <PanelNavigation
                                selectedTab={currentTab}
                                onTabToggle={(tabIndex) => setCurrentTab(tabIndex)}
                            />
                        </ModelerArea>
                        <ResizableDrawer open={currentTab !== null}>
                            {currentTab === ProcessBuildTab.CONFIGURE_ACTION && (
                                <BpmnFormProvider element={selectedElement} modeler={modeler} process={process}>
                                    <ConfigureActionPanel />
                                </BpmnFormProvider>
                            )}
                            {currentTab === ProcessBuildTab.RUN_INFO && <InfoPanel />}
                        </ResizableDrawer>
                    </Wrapper>
                </Hotkeys>
            </Hotkeys>
        );
    },
);

export default BpmnModeler;
