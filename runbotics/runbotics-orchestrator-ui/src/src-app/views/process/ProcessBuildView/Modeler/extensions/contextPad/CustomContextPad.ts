
import { BpmnElementType } from 'runbotics-common';

// @ts-nocheck
export default class CustomContextPad {

    contextPad: any;
    popupMenu: any;

    constructor(contextPad) {
        contextPad.registerProvider(this);
        this.contextPad = contextPad;
    }

    getContextPadEntries(el) {
        return function (entries) {
            delete entries['append.append-task'];
            if(el.type !== BpmnElementType.BOUNDARY_EVENT){
                delete entries.replace;
            }
            return entries;
        };
    }

}

CustomContextPad.$inject = ['contextPad', 'popupMenu'];
