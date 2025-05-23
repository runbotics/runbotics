import BpmnIoModeler from 'bpmn-js/lib/Modeler';
import { ProcessDto } from 'runbotics-common';

export interface ModelerImperativeHandle {
    export: () => Promise<string>;
}

export interface ModelerProps {
    definition: string;
    readOnly?: boolean;
    offsetTop: number | null;
    process: ProcessDto;
    onSave: (modeler: BpmnIoModeler) => void;
    onImport: (definition: string, additionalInfo: AdditionalInfo) => void;
    onExport: () => void;
}

export interface ModelerViewboxOpts {
    x: number;
    y: number;
    width: number;
    height: number;
}

export interface ModelerViewboxResult {
    width: number;
    height: number;
}

export interface ModelerRegistryElement {
    x: number;
    y: number;
    width: number;
    height: number;
}

export interface ModelerHTMLCanvasElement extends HTMLCanvasElement {
    zoom: (precition: string, scale: string) => void;
    viewbox: (opts?: ModelerViewboxOpts) => ModelerViewboxResult;
}
export interface AdditionalInfo {
    executionInfo?: ProcessDto['executionInfo'];
    isAttended?: ProcessDto['isAttended'];
    isTriggerable?: ProcessDto['isTriggerable'];
    system?: ProcessDto['system'];
}

export enum ModelerEvent {
    DIAGRAM_DESTROY = 'diagram.destroy',
    RENDER_SHAPE = 'render.shape',
    RENDER_CONNECTION = 'render.connection',
    RENDER_GETSHAPEPATH = 'render.getShapePath',
    RENDER_GETCONNECTIONPATH = 'render.getConnectionPath',
    DIAGRAM_INIT = 'diagram.init',
    SHAPE_ADDED = 'shape.added',
    CONNECTION_ADDED = 'connection.added',
    SHAPE_REMOVED = 'shape.removed',
    CONNECTION_REMOVED = 'connection.removed',
    ELEMENTS_CHANGED = 'elements.changed',
    PLANE_SET = 'plane.set',
    DIAGRAM_CLEAR = 'diagram.clear',
    CANVAS_DESTROY = 'canvas.destroy',
    CANVAS_INIT = 'canvas.init',
    SHAPE_CHANGED = 'shape.changed',
    CONNECTION_CHANGED = 'connection.changed',
    INTERACTIONEVENTS_CREATEHIT = 'interactionEvents.createHit',
    INTERACTIONEVENTS_UPDATEHIT = 'interactionEvents.updateHit',
    SHAPE_REMOVE = 'shape.remove',
    CONNECTION_REMOVE = 'connection.remove',
    ELEMENT_HOVER = 'element.hover',
    ELEMENT_OUT = 'element.out',
    SELECTION_CHANGED = 'selection.changed',
    CREATE_END = 'create.end',
    CONNECT_END = 'connect.end',
    SHAPE_MOVE_END = 'shape.move.end',
    ELEMENT_CLICK = 'element.click',
    CANVAS_VIEWBOX_CHANGING = 'canvas.viewbox.changing',
    CANVAS_VIEWBOX_CHANGED = 'canvas.viewbox.changed',
    ELEMENT_CHANGED = 'element.changed',
    ELEMENT_MARKER_UPDATE = 'element.marker.update',
    ATTACH = 'attach',
    DETACH = 'detach',
    EDITORACTIONS_INIT = 'editorActions.init',
    KEYBOARD_KEYDOWN = 'keyboard.keydown',
    ELEMENT_MOUSEDOWN = 'element.mousedown',
    COMMANDSTACK_CONNECTION_START_CANEXECUTE = 'commandStack.connection.start.canExecute',
    COMMANDSTACK_CONNECTION_CREATE_CANEXECUTE = 'commandStack.connection.create.canExecute',
    COMMANDSTACK_CONNECTION_RECONNECT_CANEXECUTE = 'commandStack.connection.reconnect.canExecute',
    COMMANDSTACK_CONNECTION_UPDATEWAYPOINTS_CANEXECUTE = 'commandStack.connection.updateWaypoints.canExecute',
    COMMANDSTACK_SHAPE_RESIZE_CANEXECUTE = 'commandStack.shape.resize.canExecute',
    COMMANDSTACK_ELEMENTS_CREATE_CANEXECUTE = 'commandStack.elements.create.canExecute',
    COMMANDSTACK_ELEMENTS_MOVE_CANEXECUTE = 'commandStack.elements.move.canExecute',
    COMMANDSTACK_SHAPE_CREATE_CANEXECUTE = 'commandStack.shape.create.canExecute',
    COMMANDSTACK_SHAPE_ATTACH_CANEXECUTE = 'commandStack.shape.attach.canExecute',
    COMMANDSTACK_ELEMENT_COPY_CANEXECUTE = 'commandStack.element.copy.canExecute',
    SHAPE_MOVE_START = 'shape.move.start',
    SHAPE_MOVE_MOVE = 'shape.move.move',
    ELEMENTS_DELETE = 'elements.delete',
    TOOL_MANAGER_UPDATE = 'tool-manager.update',
    I18N_CHANGED = 'i18n.changed',
    DRAG_MOVE = 'drag.move',
    CONTEXTPAD_CREATE = 'contextPad.create',
    PALETTE_CREATE = 'palette.create',
    AUTOPLACE_END = 'autoPlace.end',
    AUTOPLACE = 'autoPlace',
    DRAG_START = 'drag.start',
    DRAG_CLEANUP = 'drag.cleanup',
    COMMANDSTACK_SHAPE_CREATE_POSTEXECUTED = 'commandStack.shape.create.postExecuted',
    COMMANDSTACK_ELEMENTS_MOVE_POSTEXECUTED = 'commandStack.elements.move.postExecuted',
    COMMANDSTACK_SHAPE_TOGGLECOLLAPSE_POSTEXECUTED = 'commandStack.shape.toggleCollapse.postExecuted',
    COMMANDSTACK_SHAPE_RESIZE_POSTEXECUTED = 'commandStack.shape.resize.postExecuted',
    COMMANDSTACK_ELEMENT_AUTORESIZE_CANEXECUTE = 'commandStack.element.autoResize.canExecute',
    BENDPOINT_MOVE_HOVER = 'bendpoint.move.hover',
    BENDPOINT_MOVE_OUT = 'bendpoint.move.out',
    BENDPOINT_MOVE_CLEANUP = 'bendpoint.move.cleanup',
    BENDPOINT_MOVE_END = 'bendpoint.move.end',
    CONNECTIONSEGMENT_MOVE_START = 'connectionSegment.move.start',
    CONNECTIONSEGMENT_MOVE_MOVE = 'connectionSegment.move.move',
    CONNECTIONSEGMENT_MOVE_HOVER = 'connectionSegment.move.hover',
    CONNECTIONSEGMENT_MOVE_OUT = 'connectionSegment.move.out',
    CONNECTIONSEGMENT_MOVE_CLEANUP = 'connectionSegment.move.cleanup',
    CONNECTIONSEGMENT_MOVE_CANCEL = 'connectionSegment.move.cancel',
    CONNECTIONSEGMENT_MOVE_END = 'connectionSegment.move.end',
    ELEMENT_MOUSEMOVE = 'element.mousemove',
    ELEMENT_UPDATEID = 'element.updateId',
    BENDPOINT_MOVE_MOVE = 'bendpoint.move.move',
    BENDPOINT_MOVE_START = 'bendpoint.move.start',
    BENDPOINT_MOVE_CANCEL = 'bendpoint.move.cancel',
    CONNECT_MOVE = 'connect.move',
    CONNECT_HOVER = 'connect.hover',
    CONNECT_OUT = 'connect.out',
    CONNECT_CLEANUP = 'connect.cleanup',
    CREATE_MOVE = 'create.move',
    CREATE_HOVER = 'create.hover',
    CREATE_OUT = 'create.out',
    CREATE_CLEANUP = 'create.cleanup',
    CREATE_INIT = 'create.init',
    COPYPASTE_COPYELEMENT = 'copyPaste.copyElement',
    COPYPASTE_PASTEELEMENTS = 'copyPaste.pasteElements',
    MODDLECOPY_CANCOPYPROPERTIES = 'moddleCopy.canCopyProperties',
    MODDLECOPY_CANCOPYPROPERTY = 'moddleCopy.canCopyProperty',
    MODDLECOPY_CANSETCOPIEDPROPERTY = 'moddleCopy.canSetCopiedProperty',
    COPYPASTE_PASTEELEMENT = 'copyPaste.pasteElement',
    POPUPMENU_GETPROVIDERS_BPMN_REPLACE = 'popupMenu.getProviders.bpmn-replace',
    CONTEXTPAD_GETPROVIDERS = 'contextPad.getProviders',
    RESIZE_MOVE = 'resize.move',
    RESIZE_END = 'resize.end',
    COMMANDSTACK_SHAPE_RESIZE_PREEXECUTE = 'commandStack.shape.resize.preExecute',
    SPACETOOL_MOVE = 'spaceTool.move',
    SPACETOOL_END = 'spaceTool.end',
    CREATE_START = 'create.start',
    COMMANDSTACK_CONNECTION_CREATE_POSTEXECUTED = 'commandStack.connection.create.postExecuted',
    COMMANDSTACK_CONNECTION_LAYOUT_POSTEXECUTED = 'commandStack.connection.layout.postExecuted',
    SHAPE_MOVE_INIT = 'shape.move.init',
    RESIZE_START = 'resize.start',
    RESIZE_CLEANUP = 'resize.cleanup',
    ELEMENT_DBLCLICK = 'element.dblclick',
    AUTOPLACE_START = 'autoPlace.start',
    DRAG_INIT = 'drag.init',
    POPUPMENU_OPEN = 'popupMenu.open',
    COMMANDSTACK_CHANGED = 'commandStack.changed',
    DIRECTEDITING_ACTIVATE = 'directEditing.activate',
    DIRECTEDITING_RESIZE = 'directEditing.resize',
    DIRECTEDITING_COMPLETE = 'directEditing.complete',
    DIRECTEDITING_CANCEL = 'directEditing.cancel',
    COMMANDSTACK_CONNECTION_UPDATEWAYPOINTS_POSTEXECUTED = 'commandStack.connection.updateWaypoints.postExecuted',
    COMMANDSTACK_LABEL_CREATE_POSTEXECUTED = 'commandStack.label.create.postExecuted',
    COMMANDSTACK_ELEMENTS_CREATE_POSTEXECUTED = 'commandStack.elements.create.postExecuted',
    COMMANDSTACK_SHAPE_APPEND_PREEXECUTE = 'commandStack.shape.append.preExecute',
    COMMANDSTACK_SHAPE_MOVE_POSTEXECUTE = 'commandStack.shape.move.postExecute',
    COMMANDSTACK_ELEMENTS_MOVE_PREEXECUTE = 'commandStack.elements.move.preExecute',
    COMMANDSTACK_CONNECTION_CREATE_POSTEXECUTE = 'commandStack.connection.create.postExecute',
    COMMANDSTACK_CONNECTION_RECONNECT_POSTEXECUTE = 'commandStack.connection.reconnect.postExecute',
    COMMANDSTACK_SHAPE_CREATE_EXECUTED = 'commandStack.shape.create.executed',
    COMMANDSTACK_SHAPE_CREATE_REVERTED = 'commandStack.shape.create.reverted',
    COMMANDSTACK_SHAPE_CREATE_PREEXECUTE = 'commandStack.shape.create.preExecute',
    SHAPE_MOVE_HOVER = 'shape.move.hover',
    SHAPE_MOVE_OUT = 'shape.move.out',
    GLOBAL_CONNECT_HOVER = 'global-connect.hover',
    GLOBAL_CONNECT_OUT = 'global-connect.out',
    GLOBAL_CONNECT_END = 'global-connect.end',
    GLOBAL_CONNECT_CLEANUP = 'global-connect.cleanup',
    CONNECT_START = 'connect.start',
    COMMANDSTACK_ELEMENTS_CREATE_PREEXECUTE = 'commandStack.elements.create.preExecute',
    COMMANDSTACK_SHAPE_CREATE_EXECUTE = 'commandStack.shape.create.execute',
    COMMANDSTACK_SHAPE_CREATE_REVERT = 'commandStack.shape.create.revert',
    COMMANDSTACK_SHAPE_CREATE_POSTEXECUTE = 'commandStack.shape.create.postExecute',
    COMMANDSTACK_CONNECTION_LAYOUT_EXECUTED = 'commandStack.connection.layout.executed',
    COMMANDSTACK_CONNECTION_CREATE_EXECUTED = 'commandStack.connection.create.executed',
    COMMANDSTACK_CONNECTION_LAYOUT_REVERTED = 'commandStack.connection.layout.reverted',
    COMMANDSTACK_SHAPE_MOVE_EXECUTED = 'commandStack.shape.move.executed',
    COMMANDSTACK_SHAPE_DELETE_EXECUTED = 'commandStack.shape.delete.executed',
    COMMANDSTACK_CONNECTION_MOVE_EXECUTED = 'commandStack.connection.move.executed',
    COMMANDSTACK_CONNECTION_DELETE_EXECUTED = 'commandStack.connection.delete.executed',
    COMMANDSTACK_SHAPE_MOVE_REVERTED = 'commandStack.shape.move.reverted',
    COMMANDSTACK_SHAPE_DELETE_REVERTED = 'commandStack.shape.delete.reverted',
    COMMANDSTACK_CONNECTION_CREATE_REVERTED = 'commandStack.connection.create.reverted',
    COMMANDSTACK_CONNECTION_MOVE_REVERTED = 'commandStack.connection.move.reverted',
    COMMANDSTACK_CONNECTION_DELETE_REVERTED = 'commandStack.connection.delete.reverted',
    COMMANDSTACK_CANVAS_UPDATEROOT_EXECUTED = 'commandStack.canvas.updateRoot.executed',
    COMMANDSTACK_CANVAS_UPDATEROOT_REVERTED = 'commandStack.canvas.updateRoot.reverted',
    COMMANDSTACK_SHAPE_RESIZE_EXECUTED = 'commandStack.shape.resize.executed',
    COMMANDSTACK_SHAPE_RESIZE_REVERTED = 'commandStack.shape.resize.reverted',
    COMMANDSTACK_CONNECTION_RECONNECT_EXECUTED = 'commandStack.connection.reconnect.executed',
    COMMANDSTACK_CONNECTION_RECONNECT_REVERTED = 'commandStack.connection.reconnect.reverted',
    COMMANDSTACK_CONNECTION_UPDATEWAYPOINTS_EXECUTED = 'commandStack.connection.updateWaypoints.executed',
    COMMANDSTACK_CONNECTION_UPDATEWAYPOINTS_REVERTED = 'commandStack.connection.updateWaypoints.reverted',
    COMMANDSTACK_ELEMENT_UPDATEATTACHMENT_EXECUTED = 'commandStack.element.updateAttachment.executed',
    COMMANDSTACK_ELEMENT_UPDATEATTACHMENT_REVERTED = 'commandStack.element.updateAttachment.reverted',
    COMMANDSTACK_SHAPE_DELETE_POSTEXECUTE = 'commandStack.shape.delete.postExecute',
    COMMANDSTACK_CANVAS_UPDATEROOT_POSTEXECUTE = 'commandStack.canvas.updateRoot.postExecute',
    SPACETOOL_SELECTION_INIT = 'spaceTool.selection.init',
    SPACETOOL_SELECTION_ENDED = 'spaceTool.selection.ended',
    SPACETOOL_SELECTION_CANCELED = 'spaceTool.selection.canceled',
    SPACETOOL_ENDED = 'spaceTool.ended',
    SPACETOOL_CANCELED = 'spaceTool.canceled',
    SPACETOOL_SELECTION_END = 'spaceTool.selection.end',
    COMMANDSTACK_SHAPE_DELETE_POSTEXECUTED = 'commandStack.shape.delete.postExecuted',
    COMMANDSTACK_CONNECTION_CREATE_PREEXECUTED = 'commandStack.connection.create.preExecuted',
    COMMANDSTACK_SHAPE_REPLACE_PREEXECUTED = 'commandStack.shape.replace.preExecuted',
    BPMNELEMENT_ADDED = 'bpmnElement.added',
    COMMANDSTACK_ELEMENT_UPDATEPROPERTIES_POSTEXECUTE = 'commandStack.element.updateProperties.postExecute',
    COMMANDSTACK_LABEL_CREATE_POSTEXECUTE = 'commandStack.label.create.postExecute',
    COMMANDSTACK_CONNECTION_LAYOUT_POSTEXECUTE = 'commandStack.connection.layout.postExecute',
    COMMANDSTACK_CONNECTION_UPDATEWAYPOINTS_POSTEXECUTE = 'commandStack.connection.updateWaypoints.postExecute',
    COMMANDSTACK_SHAPE_REPLACE_POSTEXECUTE = 'commandStack.shape.replace.postExecute',
    COMMANDSTACK_SHAPE_RESIZE_POSTEXECUTE = 'commandStack.shape.resize.postExecute',
    SHAPE_MOVE_REJECTED = 'shape.move.rejected',
    CREATE_REJECTED = 'create.rejected',
    COMMANDSTACK_SHAPE_DELETE_PREEXECUTE = 'commandStack.shape.delete.preExecute',
    COMMANDSTACK_CONNECTION_RECONNECT_PREEXECUTE = 'commandStack.connection.reconnect.preExecute',
    COMMANDSTACK_ELEMENT_UPDATEPROPERTIES_POSTEXECUTED = 'commandStack.element.updateProperties.postExecuted',
    COMMANDSTACK_SHAPE_REPLACE_POSTEXECUTED = 'commandStack.shape.replace.postExecuted',
    COMMANDSTACK_SHAPE_TOGGLECOLLAPSE_EXECUTED = 'commandStack.shape.toggleCollapse.executed',
    COMMANDSTACK_SHAPE_TOGGLECOLLAPSE_REVERTED = 'commandStack.shape.toggleCollapse.reverted',
    SPACETOOL_GETMINDIMENSIONS = 'spaceTool.getMinDimensions',
    COMMANDSTACK_CONNECTION_DELETE_PREEXECUTE = 'commandStack.connection.delete.preExecute',
    COMMANDSTACK_CANVAS_UPDATEROOT_PREEXECUTE = 'commandStack.canvas.updateRoot.preExecute',
    COMMANDSTACK_SPACETOOL_PREEXECUTE = 'commandStack.spaceTool.preExecute',
    COMMANDSTACK_LANE_ADD_PREEXECUTE = 'commandStack.lane.add.preExecute',
    COMMANDSTACK_LANE_RESIZE_PREEXECUTE = 'commandStack.lane.resize.preExecute',
    COMMANDSTACK_LANE_SPLIT_PREEXECUTE = 'commandStack.lane.split.preExecute',
    COMMANDSTACK_ELEMENTS_DELETE_PREEXECUTE = 'commandStack.elements.delete.preExecute',
    COMMANDSTACK_SHAPE_MOVE_PREEXECUTE = 'commandStack.shape.move.preExecute',
    COMMANDSTACK_SPACETOOL_POSTEXECUTED = 'commandStack.spaceTool.postExecuted',
    COMMANDSTACK_LANE_ADD_POSTEXECUTED = 'commandStack.lane.add.postExecuted',
    COMMANDSTACK_LANE_RESIZE_POSTEXECUTED = 'commandStack.lane.resize.postExecuted',
    COMMANDSTACK_LANE_SPLIT_POSTEXECUTED = 'commandStack.lane.split.postExecuted',
    COMMANDSTACK_ELEMENTS_DELETE_POSTEXECUTED = 'commandStack.elements.delete.postExecuted',
    COMMANDSTACK_SHAPE_MOVE_POSTEXECUTED = 'commandStack.shape.move.postExecuted',
    SAVEXML_START = 'saveXML.start',
    COMMANDSTACK_CONNECTION_CREATE_PREEXECUTE = 'commandStack.connection.create.preExecute',
    COMMANDSTACK_CONNECTION_MOVE_PREEXECUTE = 'commandStack.connection.move.preExecute',
    SHAPE_MOVE_CLEANUP = 'shape.move.cleanup',
    COMMANDSTACK_ELEMENTS_MOVE_PREEXECUTED = 'commandStack.elements.move.preExecuted',
    COMMANDSTACK_SHAPE_DELETE_EXECUTE = 'commandStack.shape.delete.execute',
    COMMANDSTACK_SHAPE_DELETE_REVERT = 'commandStack.shape.delete.revert',
    SPACETOOL_SELECTION_START = 'spaceTool.selection.start',
    SPACETOOL_SELECTION_MOVE = 'spaceTool.selection.move',
    SPACETOOL_SELECTION_CLEANUP = 'spaceTool.selection.cleanup',
    SPACETOOL_CLEANUP = 'spaceTool.cleanup',
    LASSO_SELECTION_INIT = 'lasso.selection.init',
    LASSO_SELECTION_ENDED = 'lasso.selection.ended',
    LASSO_SELECTION_CANCELED = 'lasso.selection.canceled',
    LASSO_ENDED = 'lasso.ended',
    LASSO_CANCELED = 'lasso.canceled',
    LASSO_SELECTION_END = 'lasso.selection.end',
    LASSO_END = 'lasso.end',
    LASSO_START = 'lasso.start',
    LASSO_MOVE = 'lasso.move',
    LASSO_CLEANUP = 'lasso.cleanup',
    HAND_INIT = 'hand.init',
    HAND_ENDED = 'hand.ended',
    HAND_CANCELED = 'hand.canceled',
    HAND_MOVE_ENDED = 'hand.move.ended',
    HAND_MOVE_CANCELED = 'hand.move.canceled',
    KEYBOARD_KEYUP = 'keyboard.keyup',
    HAND_END = 'hand.end',
    HAND_MOVE_MOVE = 'hand.move.move',
    HAND_MOVE_END = 'hand.move.end',
    GLOBAL_CONNECT_INIT = 'global-connect.init',
    GLOBAL_CONNECT_ENDED = 'global-connect.ended',
    GLOBAL_CONNECT_CANCELED = 'global-connect.canceled',
    GLOBAL_CONNECT_DRAG_ENDED = 'global-connect.drag.ended',
    GLOBAL_CONNECT_DRAG_CANCELED = 'global-connect.drag.canceled',
    PALETTE_GETPROVIDERS = 'palette.getProviders',
    ROOT_ADDED = 'root.added',
    PROPERTIESPANEL_CHANGED = 'propertiesPanel.changed',
    PROPERTIESPANEL_RESIZED = 'propertiesPanel.resized',
    ELEMENTTEMPLATES_CHANGED = 'elementTemplates.changed',
    PROPERTIESPANEL_PROVIDERSCHANGED = 'propertiesPanel.providersChanged',
    CANVAS_RESIZED = 'canvas.resized',
    IMPORT_PARSE_COMPLETE = 'import.parse.complete',
    IMPORT_DONE = 'import.done',
    COMMANDSTACK_CONNECTION_DELETE_POSTEXECUTED = 'commandStack.connection.delete.postExecuted',
}
