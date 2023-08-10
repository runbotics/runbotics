import { BpmnElementType } from 'runbotics-common';

// @ts-nocheck
export default class CustomContextPad {
    constructor(contextPad) {
        contextPad.registerProvider(this);
    }

    getContextPadEntries(el) {
        return function (entries) {
            delete entries['append.append-task'];
            if (
                el.type !== BpmnElementType.BOUNDARY_EVENT &&
                el.type !== BpmnElementType.SEQUENCE_FLOW
            ) {
                delete entries.replace;
            }
            return entries;
        };
    }
}
// @ts-ignore
CustomContextPad.$inject = ['contextPad'];
