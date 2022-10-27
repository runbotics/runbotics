import BpmnIoModeler from 'bpmn-js/lib/Modeler';

import { ModelerHTMLCanvasElement, ModelerRegistryElement } from './BpmnModeler.types';

/**
 * For the given modeler, copy an element to
 * localStorage.
 *
 * @param  {BpmnModeler} modeler
 * @param  {String} elementId
 * @param  {String} target
 * @param  {Point} position
 */
export const copy = (modeler: any, elementId: any) => {
    const clipboard = modeler.get('clipboard');
    const copyPaste = modeler.get('copyPaste');
    const elementRegistry = modeler.get('elementRegistry');

    // get element to be copied
    const element = elementRegistry.get(elementId);

    // copy!
    copyPaste.copy(element);

    // retrieve clipboard contents
    const copied = clipboard.get();

    // persist in local storage, encoded as json
    localStorage.setItem('bpmnClipboard', JSON.stringify(copied));
};

/**
 * A factory function that returns a reviver to be
 * used with JSON#parse to reinstantiate moddle instances.
 *
 * @param  {Moddle} moddle
 *
 * @return {Function}
 */
export const createReviver = (moddle) => {
    const elCache = {};

    /**
     * The actual reviewer that creates model instances
     * for elements with a $type attribute.
     *
     * Elements with ids will be re-used, if already
     * created.
     *
     * @param  {String} key
     * @param  {Object} object
     *
     * @return {Object} actual element
     */
    return (key, object) => {
        if (typeof object === 'object' && typeof object.$type === 'string') {
            const objectId = object.id;

            if (objectId && elCache[objectId]) 
                return elCache[objectId];
            

            const type = object.$type;
            const attrs = { ...object };

            delete attrs.$type;

            const newEl = moddle.create(type, attrs);

            if (objectId) 
                elCache[objectId] = newEl;
            

            return newEl;
        }

        return object;
    };
};

/**
 * For the given modeler retrieved copied elements from
 * localStorage and paste them onto the specified target.
 *
 * @param  {BpmnModeler} modeler
 * @param  {String} target
 * @param  {Point} position
 */
export const paste = (modeler, targetId) => {
    const clipboard = modeler.get('clipboard');
    const copyPaste = modeler.get('copyPaste');
    const elementRegistry = modeler.get('elementRegistry');
    const moddle = modeler.get('moddle');

    // retrieve from local storage
    const serializedCopy = localStorage.getItem('bpmnClipboard');

    // parse tree, reinstantiating contained objects
    const parsedCopy = JSON.parse(serializedCopy, createReviver(moddle));

    // put into clipboard
    clipboard.set(parsedCopy);

    const pasteContext = {
        element: elementRegistry.get(targetId),
    };

    // paste tree
    copyPaste.paste(pasteContext);
};

export const centerToElement = (
    viewer: BpmnIoModeler,
    canvas: ModelerHTMLCanvasElement,
    selectedElementId: string,
) => {
    const elementRegistry = viewer.get('elementRegistry');
    const elementBox: ModelerRegistryElement = elementRegistry.get(selectedElementId);
    const currentViewbox = canvas.viewbox();

    const elementCenterPos = {
        x: elementBox.x + (elementBox.width / 2),
        y: elementBox.y + (elementBox.height / 2),
    };

    canvas.viewbox({
        x: elementCenterPos.x - currentViewbox.width / 2,
        y: elementCenterPos.y - currentViewbox.height / 2,
        width: currentViewbox.width,
        height: currentViewbox.height,
    });
};

export const centerCanvas = (viewer: BpmnIoModeler) => {
    const canvas: ModelerHTMLCanvasElement = viewer.get('canvas');

    const selectedElements = viewer.get('selection').get();

    if (selectedElements?.length > 0) {
        const selectedElementId = selectedElements[0].id;
        centerToElement(viewer, canvas, selectedElementId);
    } else {
        canvas.zoom('fit-viewport', 'auto');
    }
};
