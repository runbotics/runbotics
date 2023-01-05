// @ts-nocheck
export default class CustomContextPad {
    constructor(contextPad) {
        contextPad.registerProvider(this);
    }

    getContextPadEntries() {
        return function (entries) {
            delete entries['append.append-task'];

            return entries;
        };
    }
}

CustomContextPad.$inject = ['contextPad'];
