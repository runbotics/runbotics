import { BpmnElementType } from 'runbotics-common';

// @ts-nocheck
export default class CustomContextPad {
    constructor(contextPad) {
        contextPad.registerProvider(this);
    }

    getContextPadEntries(el) {
        return function (entries) {
            delete entries['append.append-task'];

            if (el.type !== BpmnElementType.BOUNDARY_EVENT) {
                delete entries.replace;
            }

            if (el.type === BpmnElementType.SEQUENCE_FLOW) {
                entries.replace = {
                    group: 'edit',
                    className: 'bpmn-icon-screw-wrench',
                    title: 'Change type',
                    action: {},
                };
            }

            return entries;
        };
    }
}
// @ts-ignore
CustomContextPad.$inject = ['contextPad'];
