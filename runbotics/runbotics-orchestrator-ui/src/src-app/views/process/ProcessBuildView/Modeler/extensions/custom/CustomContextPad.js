// @ts-nocheck
/* eslint-disable */
const SUITABILITY_SCORE_HIGH = 100,
    SUITABILITY_SCORE_AVERGE = 50,
    SUITABILITY_SCORE_LOW = 25;

export default class CustomContextPad {
    constructor(config, contextPad, injector, translate) {
        this.translate = translate;
    }

    getContextPadEntries(element) {
        return function (entries) {
            delete entries['append.append-task'];

            return entries;
        }
    }

}

CustomContextPad.$inject = ['config', 'contextPad', 'injector', 'translate'];
