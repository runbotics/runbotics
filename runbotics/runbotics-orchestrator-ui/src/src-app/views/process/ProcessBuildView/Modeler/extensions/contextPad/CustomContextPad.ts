
import { BpmnElementType } from 'runbotics-common';

// @ts-nocheck
export default class CustomContextPad {

    constructor(contextPad) {
        contextPad.registerProvider(this);
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

CustomContextPad.$inject = ['contextPad'];
