import React, { useEffect, useImperativeHandle, useRef, useState } from 'react';

import Ajv from 'ajv';
import 'bpmn-js/dist/assets/diagram-js.css';
import 'bpmn-js/dist/assets/bpmn-font/css/bpmn-embedded.css';
import BpmnIoModeler from 'bpmn-js/lib/Modeler';
import 'bpmn-js-properties-panel/dist/assets/bpmn-js-properties-panel.css';
import i18n from 'i18next';
import _ from 'lodash';
import Hotkeys from 'react-hot-keys';
import 'react-resizable/css/styles.css';

import InfoPanel from '#src-app/components/InfoPanel';
import ResizableDrawer from '#src-app/components/ResizableDrawer';
import If from '#src-app/components/utils/If';
import useNavigationLock from '#src-app/hooks/useNavigationLock';
import { translate } from '#src-app/hooks/useTranslations';
import useUpdateEffect from '#src-app/hooks/useUpdateEffect';
import ModelerProvider from '#src-app/providers/ModelerProvider';
import { useDispatch, useSelector } from '#src-app/store';

import {
    CommandStackInfo,
    processActions
} from '#src-app/store/slices/Process';

import { ProcessBuildTab } from '#src-app/types/sidebar';

import {
    centerCanvas,
    copy,
    ModelerArea,
    ModelerContainer,
    ModelerImperativeHandle,
    ModelerProps,
    openBpmnDiagram,
    paste,
    Wrapper
} from '.';
import ImportExportPanel from '../../ModelerPanels/ImportExportPanel';
import ModelerToolboxPanel from '../../ModelerPanels/ModelerToolboxPanel';
import RunSavePanel from '../../ModelerPanels/RunSavePanel';
import SidebarNavigationPanel from '../../SidebarNavigationPanel';
import ActionListPanel from '../ActionListPanel';
import internalBpmnActions from '../ConfigureActionPanel/Actions';
import ConfigureActionPanel from '../ConfigureActionPanel/ConfigureActionPanel';
import emptyBpmn from '../empty.bpmn';

import {
    applyModelerElement,
    getFormData,
    getFormSchema,
    toggleValidationError
} from '../utils';
import { BpmnModelerConfig } from './BpmnModeler.config';

const ajv = new Ajv();
const ELEMENTS_PROPERTIES_WHITELIST = [
    'bpmn:ServiceTask',
    'bpmn:SequenceFlow',
    'bpmn:SubProcess'
];
const initialCommandStackInfo: CommandStackInfo = {
    commandStackIdx: -1,
    commandStackSize: 0
};

const BpmnModeler = React.forwardRef<ModelerImperativeHandle, ModelerProps>(
    // eslint-disable-next-line max-lines-per-function
    ({ definition, offsetTop, onSave, onImport, onExport, process }, ref) => {
        const dispatch = useDispatch();
        const modelerRef = useRef<BpmnIoModeler>(null);
        const [imported, setImported] = useState(false);
        const [currentTab, setCurrentTab] = useState<ProcessBuildTab | null>(
            null
        );
        const [prevLanguage, setPrevLanguage] = useState<string>(null);
        const externalBpmnActions = useSelector(
            state => state.action.bpmnActions.byId
        );
        const {
            isSaveDisabled,
            selectedElement,
            commandStack,
            errors,
            appliedActivities
        } = useSelector(state => state.process.modeler);

        useNavigationLock(
            !isSaveDisabled,
            translate('Process.Modeler.LoseModelerChangesContent')
        );
        const handleInvalidForm = event => {
            dispatch(
                processActions.setError({
                    elementId: event.element.id,
                    elementName: event.element.id
                })
            );

            if (!event.element.businessObject.validationError) {
                toggleValidationError(modelerRef.current, event.element, true);
            }
        };

        const handleValidForm = event => {
            dispatch(processActions.removeError(event.element.id));

            if (event.element.businessObject.validationError) {
                toggleValidationError(modelerRef.current, event.element, false);
            }
        };

        useEffect(() => {
            if (prevLanguage !== i18n.language && modelerRef?.current) {
                modelerRef.current?._container.remove();
            }

            setPrevLanguage(i18n.language);

            if (!offsetTop) return;

            const bpmnModeler: BpmnIoModeler = new BpmnIoModeler(
                BpmnModelerConfig(offsetTop)
            );

            const eventBus = bpmnModeler.get('eventBus');

            eventBus.on('commandStack.changed', () => {
                const { _stackIdx, _stack } = bpmnModeler.get('commandStack');

                dispatch(
                    processActions.setCommandStack({
                        commandStackIdx: _stackIdx,
                        commandStackSize: _stack.length
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
                    const { elements } = event.context;

                    elements.forEach(element => {
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
                            action
                        });
                        if (element.id.includes('Activity')) {
                            dispatch(
                                processActions.addAppliedAction(element.id)
                            );
                            updateActivities();
                        }
                    });
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
                dispatch(processActions.removeError(event.element.id));
                updateActivities();
            });

            eventBus.on('shape.changed', (event: any) => {
                if (
                    !event.element.id.includes('Activity') ||
                    event.element.type.includes('bpmn:SubProcess')
                ) {
                    return;
                }

                const formData = getFormData(event.element);
                const validate = ajv.compile(getFormSchema(event.element));
                const isValid = validate(formData);

                if (!isValid && !formData.disabled) {
                    handleInvalidForm(event);
                } else {
                    handleValidForm(event);
                }
            });

            modelerRef.current = bpmnModeler;
            // eslint-disable-next-line react-hooks/exhaustive-deps
        }, [offsetTop, i18n.language]);

        useEffect(() => {
            updateActivities();
        }, [
            appliedActivities,
            modelerRef.current,
            commandStack.commandStackIdx,
            imported
        ]);

        useImperativeHandle(
            ref,
            () => ({
                export: async () => {
                    const result = await modelerRef.current.saveXML({
                        format: true
                    });
                    const { xml } = result;
                    return xml;
                }
            }),
            []
        );

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
                openBpmnDiagram(
                    modelerRef.current,
                    definition ?? emptyBpmn
                ).then(modelerActivities => {
                    dispatch(processActions.setSaveDisabled(true));
                    dispatch(
                        processActions.setAppliedActions(modelerActivities)
                    );
                    updateActivities();
                });
            }
            // eslint-disable-next-line react-hooks/exhaustive-deps
        }, [modelerRef.current, definition]);

        const updateActivities = () => {
            if (!modelerRef.current) return;
            const { _elements } = modelerRef.current?.get('elementRegistry');
            const modelerActivities = Object.keys(_elements).filter(elm =>
                elm.startsWith('Activity')
            );

            const areActivitiesMatched = _.isEqual(
                _.sortBy(modelerActivities),
                _.sortBy(appliedActivities)
            );

            const isModelerInSync =
                imported ||
                (areActivitiesMatched &&
                    commandStack.commandStackIdx >= 0 &&
                    errors.length === 0);

            dispatch(processActions.setSaveDisabled(!isModelerInSync));
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
                onKeyDown={onCopy}>
                <Hotkeys
                    keyName="command+b,ctrl+b"
                    disabled={selectedElement === null}
                    onKeyDown={onPaste}>
                    <ModelerProvider modelerRef={modelerRef}>
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
                                    onImport={e => {
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
                                    onTabToggle={tabIndex =>
                                        setCurrentTab(tabIndex)
                                    }
                                />
                            </ModelerArea>
                            <ResizableDrawer open={currentTab !== null}>
                                <If
                                    condition={
                                        currentTab ===
                                        ProcessBuildTab.CONFIGURE_ACTION
                                    }>
                                    <ConfigureActionPanel />
                                </If>
                                <If
                                    condition={
                                        currentTab === ProcessBuildTab.RUN_INFO
                                    }>
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
