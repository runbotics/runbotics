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
import ModelerProvider from '#src-app/providers/ModelerProvider';
import { useDispatch, useSelector } from '#src-app/store';

import {
    CommandStackInfo,
    processActions,
} from '#src-app/store/slices/Process';

import { ProcessBuildTab } from '#src-app/types/sidebar';

import {
    centerCanvas,
    copy,
    ModelerArea,
    ModelerContainer,
    ModelerImperativeHandle,
    ModelerProps,
    paste,
    Wrapper,
} from '.';
import ImportExportPanel from '../../ModelerPanels/ImportExportPanel';
import ModelerToolboxPanel from '../../ModelerPanels/ModelerToolboxPanel';
import RunSavePanel from '../../ModelerPanels/RunSavePanel';
import SidebarNavigationPanel from '../../SidebarNavigationPanel';
import ActionListPanel from '../ActionListPanel';
import internalBpmnActions from '../ConfigureActionPanel/Actions';
import ConfigureActionPanel from '../ConfigureActionPanel/ConfigureActionPanel';
import emptyBpmn from '../empty.bpmn';
import Clipboard from '../extensions/clipboard';
import ContextPad from '../extensions/contextPad';
import BasicModelerModule from '../extensions/customRenderer/Modeler.module';
import modelerPalette from '../extensions/modelerPalette';
import ZoomScrollModule from '../extensions/zoomscroll';
import { applyModelerElement } from '../utils';

const ELEMENTS_PROPERTIES_WHITELIST = [
    'bpmn:ServiceTask',
    'bpmn:SequenceFlow',
    'bpmn:SubProcess',
];
const initialCommandStackInfo: CommandStackInfo = {
    commandStackIdx: -1,
    commandStackSize: 0,
};

const BpmnModeler = React.forwardRef<ModelerImperativeHandle, ModelerProps>(
    // eslint-disable-next-line max-lines-per-function
    (
        {
            readOnly,
            definition,
            offsetTop,
            onSave,
            onImport,
            onExport,
            process,
        },
        ref
    ) => {
        const dispatch = useDispatch();
        const [modeler, setModeler] = useState<BpmnIoModeler>(null);
        const modelerRef = useRef<BpmnIoModeler>(modeler);
        const [imported, setImported] = useState(false);
        const [currentTab, setCurrentTab] = useState<ProcessBuildTab | null>(
            null
        );
        const externalBpmnActions = useSelector(
            (state) => state.action.bpmnActions.byId
        );
        const appliedActivities = useSelector(
            (state) => state.process.modeler.appliedActivities
        );
        const { isSaveDisabled, selectedElement, commandStack, errors } =
            useSelector((state) => state.process.modeler);

        useNavigationLock(
            !isSaveDisabled,
            translate('Process.Modeler.LoseModelerChangesContent')
        );
        //TODO - add a CUSTOM warning when the user tries to leave the page without saving
        const [prevLanguage, setPrevLanguage] = useState<string>(null);

        useEffect(() => {
            modelerRef.current = modeler;
        }, [modeler, offsetTop]);

        useEffect(() => {
            if (prevLanguage !== i18n.language && modelerRef?.current) {
                modelerRef.current?._container.remove();
            }

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
                        ContextPad,
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

                dispatch(
                    processActions.setCommandStack({
                        commandStackIdx: _stackIdx,
                        commandStackSize: _stack.length,
                    })
                );
                updateActivities();
            });

            eventBus.on('commandStack.shape.delete.preExecute', () => {
                dispatch(processActions.resetSelectedElement());
            });

            eventBus.on('commandStack.connection.delete.preExecute', () => {
                dispatch(processActions.resetSelectedElement());
            });

            eventBus.on(
                'commandStack.elements.create.postExecuted',
                (event: any) => {
                    if (event.context.elements.length === 1) {
                        const element = event.context.elements[0];
                        dispatch(processActions.setSelectedElement(element));
                        dispatch(processActions.setSelectedAction(null));
                        const externalAction = _.cloneDeep(
                            externalBpmnActions[
                                element?.businessObject.actionId
                            ]
                        );
                        const action =
                            externalAction ??
                            internalBpmnActions[
                                element?.businessObject.actionId
                            ];
                        applyModelerElement({
                            modeler: bpmnModeler,
                            element,
                            action,
                        });
                        if (element.id.includes('Activity')) {
                            dispatch(
                                processActions.addAppliedAction(element.id)
                            );
                            updateActivities();
                        }
                    }
                    if (event.context.elements.length > 1) {
                        event.context.elements.forEach((element) => {
                            const externalAction = _.cloneDeep(
                                externalBpmnActions[
                                    element?.businessObject.actionId
                                ]
                            );
                            const action =
                                externalAction ??
                                internalBpmnActions[
                                    element?.businessObject.actionId
                                ];
                            applyModelerElement({
                                modeler: bpmnModeler,
                                element,
                                action,
                            });
                            if (element.id.includes('Activity')) {
                                dispatch(
                                    processActions.addAppliedAction(element.id)
                                );
                                updateActivities();
                            }
                        });
                    }
                }
            );

            eventBus.on('element.click', (event: any) => {
                if (
                    ELEMENTS_PROPERTIES_WHITELIST.includes(event.element.type)
                ) {
                    dispatch(processActions.setSelectedElement(event.element));
                } else {
                    setCurrentTab(null);
                    dispatch(processActions.resetSelectedElement());
                }
            });

            eventBus.on('connection.removed', () => {
                setCurrentTab(null);
                updateActivities();
            });

            eventBus.on('shape.removed', (event: any) => {
                setCurrentTab(null);
                dispatch(processActions.removeAppliedAction(event.element.id));
                updateActivities();
            });

            setModeler(bpmnModeler);

            // eslint-disable-next-line react-hooks/exhaustive-deps
        }, [readOnly, offsetTop, i18n.language]);

        useEffect(() => {
            updateActivities();
        }, [
            appliedActivities,
            modelerRef.current,
            commandStack.commandStackIdx,
            imported,
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

        const openBpmnDiagram = async (xml: any) => {
            if (!modelerRef.current) return;
            try {
                await modelerRef.current.importXML(xml);
                const elementRegistry =
                    modelerRef.current?.get('elementRegistry');
                const elementIds = Object.keys(elementRegistry._elements);
                const activityIds = elementIds.filter(
                    (elm) => elm.split('_')[0] === 'Activity'
                );
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
            if (currentTab !== ProcessBuildTab.CONFIGURE_ACTION) {
                dispatch(processActions.resetSelectedElement());
                updateActivities();
            }
        }, [currentTab]);

        useUpdateEffect(() => {
            if (selectedElement) {
                setCurrentTab(ProcessBuildTab.CONFIGURE_ACTION);
                updateActivities();
            }
        }, [selectedElement]);

        useEffect(() => {
            if (modelerRef.current) {
                openBpmnDiagram(definition ?? emptyBpmn);
                updateActivities();
            }
            // eslint-disable-next-line react-hooks/exhaustive-deps
        }, [modeler, definition]);

        const updateActivities = () => {
            if (!modelerRef.current) return;
            const { _elements } = modelerRef.current?.get('elementRegistry');
            const modelerActivities = Object.keys(_elements).filter(
                (elm) => elm.split('_')[0] === 'Activity'
            );

            const isModelerInSync = _.isEqual(
                _.sortBy(modelerActivities),
                _.sortBy(appliedActivities)
            );

            if (
                imported ||
                (isModelerInSync &&
                    commandStack.commandStackIdx >= 0 &&
                    errors.length === 0)
            ) {
                dispatch(processActions.setSaveDisabled(false));
            } else {
                dispatch(processActions.setSaveDisabled(true));
            }
        };
        const onCopy = () => {
            copy(modelerRef.current, selectedElement.id);
        };

        const onPaste = () => {
            paste(modelerRef.current, selectedElement.id);
        };

        const onCenter = () => {
            centerCanvas(modelerRef.current);
        };

        const onZoom = (step: number) => {
            modelerRef.current?.get('zoomScroll').stepZoom(step);
        };

        const canRedo =
            commandStack.commandStackIdx + 1 === commandStack.commandStackSize;

        const canUndo = !(commandStack.commandStackIdx + 1 > 0);

        const onUndo = () => {
            modelerRef.current?.get('commandStack')?.undo();
        };

        const onRedo = () => {
            modelerRef.current.get('commandStack')?.redo();
        };

        return (
            <Hotkeys
                keyName="command+c,ctrl+c"
                disabled={selectedElement === null}
                onKeyDown={onCopy}
            >
                <Hotkeys
                    keyName="command+b,ctrl+b"
                    disabled={selectedElement === null}
                    onKeyDown={onPaste}
                >
                    <ModelerProvider modelerRef={modelerRef}>
                        <Wrapper offsetTop={offsetTop}>
                            <ActionListPanel
                                modeler={modeler}
                                offsetTop={offsetTop}
                            />
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
                                    <BpmnFormProvider
                                        element={selectedElement}
                                        modeler={modeler}
                                        process={process}
                                    >
                                        <ConfigureActionPanel />
                                    </BpmnFormProvider>
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
            </Hotkeys>
        );
    }
);
BpmnModeler.displayName = 'BpmnModeler';
export default BpmnModeler;
