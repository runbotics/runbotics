class RunboticsModule {
    private bpmnFactory: any;

    private create: any;

    private elementFactory: any;

    private translate: any;

    private commandStack: any;

    constructor(bpmnFactory: any, create: any, elementFactory: any, translate: any, commandStack: any) {
        this.bpmnFactory = bpmnFactory;
        this.create = create;
        this.elementFactory = elementFactory;
        this.translate = translate;
        this.commandStack = commandStack;
    }
}
// @ts-ignore
RunboticsModule.$inject = ['bpmnFactory', 'create', 'elementFactory', 'translate', 'commandStack'];

export default {
    __init__: ['runboticsModule'],
    runboticsModule: ['type', RunboticsModule],
};
