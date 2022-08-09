import React, {
    useEffect, useImperativeHandle, useRef, useState,
} from 'react';
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
import { processActions } from 'src/store/slices/Process';

import { ProcessBuildTab } from 'src/types/sidebar';
import InfoPanel from 'src/components/InfoPanel';
import useUpdateEffect from 'src/hooks/useUpdateEffect';
import BpmnFormProvider from 'src/providers/BpmnForm.provider';
import _ from 'lodash';
import emptyBpmn from '../empty.bpmn';
import BasicModelerModule from '../Modeler.module';
import ActionListPanel from '../ActionListPanel';
import ConfigureActionPanel from '../ConfigureActionPanel/ConfigureActionPanel';
import propertiesProviderModule from '../providers/bpmn-js-properties-provider/provider/camunda';
import Clipboard from '../extensions/Clipboard';
import ZoomScrollModule from '../extensions/zoomscroll';
import {
    copy,
    ModelerContainer,
    ModelerImperativeHandle,
    ModelerProps,
    paste,
    Wrapper,
    InfoDrawer,
    ModelerArea,
    centerCanvas,
} from '.';
import { BPMNElement } from '../BPMN';
import internalBpmnActions from '../ConfigureActionPanel/Actions';
import { applyModelerElement } from '../utils';
import ImportExportPanel from '../../ModelerPanels/ImportExportPanel';
import RunSavePanel from '../../ModelerPanels/RunSavePanel';
import ModelerToolboxPanel from '../../ModelerPanels/ModelerToolboxPanel';

const ELEMENTS_PROPERTIES_WHITELIST = ['bpmn:ServiceTask', 'bpmn:SequenceFlow', 'bpmn:SubProcess'];

const BpmnModeler = React.forwardRef<ModelerImperativeHandle, ModelerProps>(({
    readOnly, definition, currentTab, onTabChange, offsetTop, onSave, onImport, onExport, onRunClick, process,
}, ref) => {
    const [modeler, setModeler] = useState<BpmnIoModeler>(null);
    const [selectedElement, setSelectedElement] = useState<BPMNElement>(null);
    const modelerRef = useRef<BpmnIoModeler>(modeler);
    const dispatch = useDispatch();
    const externalBpmnActions = useSelector((state) => state.action.bpmnActions.byId);

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
                    propertiesPanelModule,
                    propertiesProviderModule,
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

        eventBus.on('commandStack.elements.create.postExecuted', (event: any) => {
            if (event.context.elements.length === 1) setSelectedElement(event.context.elements[0]);
            if (event.context.elements.length > 1) {
                event.context.elements.forEach((element) => {
                    const externalAction = _.cloneDeep(externalBpmnActions[element?.businessObject.actionId]);
                    const action = externalAction ?? internalBpmnActions[element?.businessObject.actionId];
                    applyModelerElement({ modeler: bpmnModeler, element, action });
                });
            }
        });

        eventBus.on('element.click', (event: any) => {
            if (ELEMENTS_PROPERTIES_WHITELIST.includes(event.element.type)) {
                setSelectedElement(event.element);
            } else {
                onTabChange(ProcessBuildTab.PROPERTIES);
                setSelectedElement(null);
            }
        });

        eventBus.on('connection.removed', (event: any) => {
            onTabChange(ProcessBuildTab.PROPERTIES);
            setSelectedElement(null);
        });

        eventBus.on('shape.removed', (event: any) => {
            onTabChange(ProcessBuildTab.PROPERTIES);
            setSelectedElement(null);
        });

        setModeler(bpmnModeler);
    }, [readOnly, offsetTop]);

    useImperativeHandle(
        ref,
        () => ({
            export: async () => {
                const result = await modelerRef.current.saveXML({ format: true });
                const { xml } = result;
                return xml;
            },
            getActivities: () => {
                const elementRegistry = modelerRef.current.get('elementRegistry');
                // eslint-disable-next-line no-underscore-dangle
                const activities = Object.keys(elementRegistry._elements);
                return activities;
            },
        }),
        [],
    );

    const openBpmnDiagram = async (xml: any) => {
        if (!modeler) return;
        try {
            await modeler.importXML(xml);
            const elementRegistry = modeler.get('elementRegistry');
            // eslint-disable-next-line no-underscore-dangle
            const elementIds = Object.keys(elementRegistry._elements);
            const activityIds = elementIds.filter((elm) => elm.split('_')[0] === 'Activity');
            dispatch(processActions.setAppliedActions(activityIds));

            const canvas = modeler.get('canvas');
            canvas.zoom('fit-viewport', 'auto');
        } catch (error) {
            if (error) {
                console.log('fail import xml');
            }
        }
    };

    useUpdateEffect(() => {
        if (currentTab === ProcessBuildTab.RUN_INFO) {
            setSelectedElement(null);
        }
    }, [currentTab]);

    useUpdateEffect(() => {
        if (selectedElement) {
            onTabChange(ProcessBuildTab.PROPERTIES);
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
        modeler.get('zoomScroll').stepZoom(step);
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
                            onSave={onSave}
                            onRunClick={onRunClick}
                        />
                        <ImportExportPanel
                            onExport={onExport}
                            onImport={onImport}
                        />
                        <ModelerToolboxPanel
                            onCenter={onCenter}
                            onZoomIn={() => onZoom(1)}
                            onZoomOut={() => onZoom(-1)}
                        />
                    </ModelerArea>
                    <BpmnFormProvider element={selectedElement} modeler={modeler}>
                        <ConfigureActionPanel />
                    </BpmnFormProvider>
                    <InfoDrawer
                        variant="permanent"
                        anchor="right"
                        open={currentTab === ProcessBuildTab.RUN_INFO && !selectedElement}
                    >
                        <InfoPanel />
                    </InfoDrawer>
                </Wrapper>
            </Hotkeys>
        </Hotkeys>
    );
});

export default BpmnModeler;
