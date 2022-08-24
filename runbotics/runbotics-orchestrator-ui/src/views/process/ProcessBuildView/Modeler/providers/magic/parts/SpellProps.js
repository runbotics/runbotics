import entryFactory from 'bpmn-js-properties-panel/lib/factory/EntryFactory';

import { is } from 'bpmn-js/lib/util/ModelUtil';

export default function (group, element) {
    // Only return an entry, if the currently selected
    // element is a start event.

    if (is(element, 'bpmn:ServiceTask')) {
        group.entries.push(
            entryFactory.textField({
                id: 'implementation',
                description: '',
                label: 'Implementation',
                modelProperty: 'implementation',
            }),
        );

        // group.entries.push(entryFactory.textField({
        //   id : 'input',
        //   description : '',
        //   label : 'input',
        //   modelProperty : 'input'
        // }));
    }

    if (is(element, 'bpmn:ManualTask')) {
        group.entries.push(
            entryFactory.textField({
                id: 'implementation',
                description: '',
                label: 'Implementation',
                modelProperty: 'implementation',
            }),
        );
    }
}
