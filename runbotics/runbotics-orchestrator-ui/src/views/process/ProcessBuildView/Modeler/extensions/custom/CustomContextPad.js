// @ts-nocheck
/* eslint-disable */
const SUITABILITY_SCORE_HIGH = 100,
    SUITABILITY_SCORE_AVERGE = 50,
    SUITABILITY_SCORE_LOW = 25;

export default class CustomContextPad {
    constructor(bpmnFactory, config, contextPad, create, elementFactory, injector, translate) {
        this.bpmnFactory = bpmnFactory;
        this.create = create;
        this.elementFactory = elementFactory;
        this.translate = translate;

        if (config.autoPlace !== false) {
            this.autoPlace = injector.get('autoPlace', false);
        }

        contextPad.registerProvider(this);
    }

    getContextPadEntries(element) {
        const { autoPlace, bpmnFactory, create, elementFactory, translate } = this;

        function appendServiceTask(scriptText) {
            return function (event, element) {
                if (autoPlace) {
                    const businessObject = bpmnFactory.create('bpmn:ServiceTask');

                    businessObject.scriptText = scriptText;

                    const shape = elementFactory.createShape({
                        type: 'bpmn:ServiceTask',
                        businessObject: businessObject,
                    });

                    autoPlace.append(element, shape);
                } else {
                    appendServiceTaskStart(event, element);
                }
            };
        }

        function appendServiceTaskStart(scriptText) {
            return function (event) {
                const businessObject = bpmnFactory.create('bpmn:ServiceTask');

                businessObject.scriptText = scriptText;

                const shape = elementFactory.createShape({
                    type: 'bpmn:ServiceTask',
                    businessObject: businessObject,
                });

                create.start(event, shape, element);
            };
        }

        return {
            'append.low-task': {
                group: 'model',
                className: 'bpmn-icon-task red',
                title: translate('Append Task with low suitability score'),
                action: {
                    click: appendServiceTask('Start process'),
                    dragstart: appendServiceTaskStart('Start process'),
                },
            },
        };
    }
}

CustomContextPad.$inject = ['bpmnFactory', 'config', 'contextPad', 'create', 'elementFactory', 'injector', 'translate'];
