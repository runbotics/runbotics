import BpmnModeler from 'bpmn-js/lib/Modeler';

import { BPMNElementFactory } from '../../custom/BPMNElementFactory';

// export const definition = [{'command': 'open', 'target': 'https://www.google.pl/', 'value': ''}, {'command': 'click', 'target': 'name=q', 'value': ''}, {'command': 'type', 'target': 'name=q', 'value': 'test'}, {'command': 'sendKeys', 'target': 'name=q', 'value': '${KEY_ENTER}'}];
// export const definition = [{'command': 'open', 'target': 'https://www.google.pl/', 'value': ''}, {'command': 'open', 'target': 'https://www.google.pl/', 'value': ''}, {'command': 'test', 'target': 'https://www.google.pl/', 'value': ''}];

export default class SeleniumImporter {
    constructor(private modeler: BpmnModeler) { }

    public async import(event) {
        const clipboard: string = await navigator.clipboard.readText();
        try {
            const definition = JSON.parse(clipboard);
            if (!Array.isArray(definition))
            { return {
                error: true,
            }; }

            const bpmnElementFactory = new BPMNElementFactory(
                this.modeler.get('bpmnFactory'),
                this.modeler.get('elementFactory'),
                this.modeler.get('commandStack'),
            );
            let tasks = [];
            let connections = [];
            for (let i = 0; i < definition.length; i += 1)
            { if (i === 0) {
                tasks.push(bpmnElementFactory.createSeleniumTask(definition[i], { x: i * 150, y: 0 }));
            } else {
                const source = tasks[tasks.length - 1];
                const target = bpmnElementFactory.createSeleniumTask(definition[i], { x: i * 150, y: 0 });
                const connection = bpmnElementFactory.createSequenceFlow({
                    source,
                    target,
                    waypoints: [
                        { x: i * 150 - 50, y: 40 },
                        { x: i * 150, y: 40 },
                    ],
                });
                tasks = [...tasks, target];
                connections = [...connections, connection];
            } }


            this.modeler.get('create').start(event, [...tasks, ...connections]);
            return {
                completed: true,
            };
        } catch (e) {
            // eslint-disable-next-line no-console
            console.error('Error loading clip', e);
            return {
                error: true,
            };
        }
    }
}
