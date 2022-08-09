import { getBusinessObject, is } from 'bpmn-js/lib/util/ModelUtil';
import { isAny } from 'bpmn-js/lib/features/modeling/util/ModelingUtil';

class BPMNHelperFunctions {
    static getScope(element) {
        const businessObject = getBusinessObject(element);

        if (isAny(businessObject, ['bpmn:Process', 'bpmn:SubProcess'])) {
            return businessObject.id;
        }

        // look for processes or sub process in parents
        let parent = businessObject;

        while (parent.$parent && !isAny(parent, ['bpmn:Process', 'bpmn:SubProcess'])) {
            parent = parent.$parent;
        }

        return parent.id;
    }

    static getParentElement(element) {
        let parent;

        try {
            const businessObject = getBusinessObject(element);
            parent = businessObject?.$parent;

            while (parent && parent.$parent && !isAny(parent, ['bpmn:Process', 'bpmn:SubProcess'])) {
                parent = parent.$parent;
            }
        } catch (e) {
            console.error('Error getting parent', e, element);
        }

        return parent;
    }

    static getRootElement(element) {
        const businessObject = getBusinessObject(element);
        let parent = businessObject;

        while (parent.$parent && !is(parent, 'bpmn:Process')) {
            parent = parent.$parent;
        }

        return parent;
    }
}

export default BPMNHelperFunctions;
