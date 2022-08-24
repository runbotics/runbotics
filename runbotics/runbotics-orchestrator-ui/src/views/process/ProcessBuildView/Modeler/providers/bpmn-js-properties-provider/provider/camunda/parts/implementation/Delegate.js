'use strict';

var entryFactory = require('../../../../factory/EntryFactory'),
    cmdHelper = require('../../../../helper/CmdHelper');

var DELEGATE_TYPES = ['class', 'expression', 'delegateExpression', 'runbotics'];

var PROPERTIES = {
    class: 'camunda:class',
    expression: 'camunda:expression',
    delegateExpression: 'camunda:delegateExpression',
    runbotics: 'implementation',
};

function isDelegate(type) {
    return DELEGATE_TYPES.indexOf(type) !== -1;
}

function getAttribute(type) {
    return PROPERTIES[type];
}

module.exports = function (element, bpmnFactory, options, translate) {
    var getImplementationType = options.getImplementationType,
        getBusinessObject = options.getBusinessObject;

    function getDelegationLabel(type) {
        switch (type) {
            case 'class':
                return translate('Java Class');
            case 'expression':
                return translate('Expression');
            case 'delegateExpression':
                return translate('Delegate Expression');
            case 'runbotics':
                return 'Runner';
            default:
                return '';
        }
    }

    var DEFAULT_OPTIONS = [
        { value: '${environment.services.run()}', name: 'Content Script' },
        { value: '${environment.services.desktop()}', name: 'Desktop' },
        { value: '${environment.services.backgroundScript()}', name: 'Background Page' },
        { value: '${environment.services.runHidden()}', name: 'Hidden Content Script' },
    ];

    var delegateEntry = entryFactory.selectBox(translate, {
        id: 'delegate',
        label: 'Runner',
        dataValueLabel: 'delegationLabel',
        modelProperty: 'delegate',
        selectOptions: DEFAULT_OPTIONS,

        get: function (element, node) {
            var bo = getBusinessObject(element);
            var type = getImplementationType(element);
            var attr = getAttribute(type);
            var label = getDelegationLabel(type);
            return {
                delegate: bo.get(attr),
                delegationLabel: label,
            };
        },

        set: function (element, values, node) {
            var bo = getBusinessObject(element);
            var type = getImplementationType(element);
            var attr = getAttribute(type);
            var prop = {};
            prop[attr] = values.delegate || '';
            return cmdHelper.updateBusinessObject(element, bo, prop);
        },

        validate: function (element, values, node) {
            return isDelegate(getImplementationType(element)) && !values.delegate
                ? { delegate: translate('Must provide a value') }
                : {};
        },

        hidden: function (element, node) {
            return !isDelegate(getImplementationType(element));
        },
    });

    return [delegateEntry];
};
