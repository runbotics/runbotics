// @ts-nocheck
/* eslint-disable */
import inherits from 'inherits';

import PropertiesActivator from 'bpmn-js-properties-panel/lib/PropertiesActivator';

// Require all properties you need from existing providers.
// In this case all available bpmn relevant properties without camunda extensions.
import processProps from 'bpmn-js-properties-panel/lib/provider/bpmn/parts/ProcessProps';
import eventProps from 'bpmn-js-properties-panel/lib/provider/bpmn/parts/EventProps';
import linkProps from 'bpmn-js-properties-panel/lib/provider/bpmn/parts/LinkProps';
import documentationProps from 'bpmn-js-properties-panel/lib/provider/bpmn/parts/DocumentationProps';
import idProps from 'bpmn-js-properties-panel/lib/provider/bpmn/parts/IdProps';
import nameProps from 'bpmn-js-properties-panel/lib/provider/bpmn/parts/NameProps';
import executableProps from 'bpmn-js-properties-panel/lib/provider/bpmn/parts/ExecutableProps';

import { is } from 'bpmn-js/lib/util/ModelUtil';

// camunda Input/Output
import inputParameters from 'bpmn-js-properties-panel/lib/provider/camunda/parts/InputParametersProps';
import outputParameters from 'bpmn-js-properties-panel/lib/provider/camunda/parts/OutputParametersProps';

// import inputOutput from 'bpmn-js-properties-panel/lib/provider/camunda/parts/InputOutputProps';
// import inputOutputParameter from 'bpmn-js-properties-panel/lib/provider/camunda/parts/InputOutputParameterProps';
// camunda
import conditionalProps from 'bpmn-js-properties-panel/lib/provider/camunda/parts/ConditionalProps';

// Require your custom property entries.
import spellProps from './parts/SpellProps';

// The general tab contains all bpmn relevant properties.
// The properties are organized in groups.
function createGeneralTabGroups(element, bpmnFactory, canvas, elementRegistry, translate) {
    var generalGroup = {
        id: 'general',
        label: 'General',
        entries: [],
    };
    idProps(generalGroup, element, translate);
    nameProps(generalGroup, element, bpmnFactory, canvas, translate);
    processProps(generalGroup, element, translate);
    executableProps(generalGroup, element, translate);

    var detailsGroup = {
        id: 'details',
        label: 'Details',
        entries: [],
    };
    linkProps(detailsGroup, element, translate);
    eventProps(detailsGroup, element, bpmnFactory, elementRegistry, translate);
    conditionalProps(detailsGroup, element, bpmnFactory, translate);

    var documentationGroup = {
        id: 'documentation',
        label: 'Documentation',
        entries: [],
    };

    documentationProps(documentationGroup, element, bpmnFactory, translate);

    return [generalGroup, detailsGroup, documentationGroup];
}

var getInputOutputParameterLabel = function (param, translate) {
    if (is(param, 'camunda:InputParameter')) {
        return translate('Input Parameter');
    }

    if (is(param, 'camunda:OutputParameter')) {
        return translate('Output Parameter');
    }

    return '';
};

function createInputOutputTabGroups(element, bpmnFactory, elementTemplates, translate) {
    var inputParametersGroup = {
        id: 'input-parameters',
        label: translate('Input Parameters'),
        entries: [],
    };

    inputParameters(inputParametersGroup, element, bpmnFactory, elementTemplates, translate);

    var outputParametersGroup = {
        id: 'output-parameters',
        label: translate('Output Parameters'),
        entries: [],
    };

    outputParameters(outputParametersGroup, element, bpmnFactory, elementTemplates, translate);

    return [inputParametersGroup, outputParametersGroup];
}

// Create the custom magic tab
function createMagicTabGroups(element) {
    // Create a group called "Black Magic".
    var blackMagicGroup = {
        id: 'implementation',
        label: '',
        entries: [],
    };

    // Add the spell props to the black magic group.
    spellProps(blackMagicGroup, element);

    return [blackMagicGroup];
}

export default function MagicPropertiesProvider(eventBus, bpmnFactory, canvas, elementRegistry, translate) {
    PropertiesActivator.call(this, eventBus);

    this.getTabs = function (element) {
        var generalTab = {
            id: 'general',
            label: 'General',
            groups: createGeneralTabGroups(element, bpmnFactory, canvas, elementRegistry, translate),
        };

        var inputOutputTab = {
            id: 'input-output',
            label: 'input / output',
            groups: createInputOutputTabGroups(element, bpmnFactory, elementRegistry, translate),
        };

        // The "magic" tab
        var magicTab = {
            id: 'configuration',
            label: 'Configuration',
            groups: createMagicTabGroups(element),
        };

        // Show general + "magic" tab
        return [generalTab, inputOutputTab, magicTab];
    };
}
MagicPropertiesProvider.$inject = ['eventBus', 'bpmnFactory', 'canvas', 'elementRegistry', 'translate'];

inherits(MagicPropertiesProvider, PropertiesActivator);
