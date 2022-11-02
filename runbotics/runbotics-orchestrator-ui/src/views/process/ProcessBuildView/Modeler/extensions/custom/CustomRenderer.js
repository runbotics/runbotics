// @ts-nocheck
/* eslint-disable */
import BaseRenderer from 'diagram-js/lib/draw/BaseRenderer';

import {
    append as svgAppend,
    attr as svgAttr,
    classes as svgClasses,
    create as svgCreate,
    remove as svgRemove,
} from 'tiny-svg';

import { getRoundRectPath } from 'bpmn-js/lib/draw/BpmnRenderUtil';

import { is, getBusinessObject } from 'bpmn-js/lib/util/ModelUtil';
import { getExtensionScriptLabel } from '../../utils';
import { truncate } from 'lodash';
import { CustomActionDescription } from 'src/utils/action';
import store from '../../../../../../store';
import internalBpmnActions from '../../ConfigureActionPanel/Actions';
import { translate } from 'src/hooks/useTranslations';
import { capitalizeFirstLetter } from 'src/utils/text';

const HIGH_PRIORITY = 1500,
    TASK_BORDER_RADIUS = 1,
    COLOR_GREEN = '#52B415',
    COLOR_YELLOW = '#ffc800',
    COLOR_RED = '#cc0000';

export default class CustomRenderer extends BaseRenderer {
    constructor(eventBus, bpmnRenderer) {
        super(eventBus, HIGH_PRIORITY);

        this.bpmnRenderer = bpmnRenderer;
    }

    canRender(element) {
        // ignore labels
        return !element.labelTarget;
    }

    drawTextNode(label, parentNode, color = '#000', transformX = 0, transformY = 0, width = 240, height = 20) {
        // const color = this.getColor(50);

        const rect = drawRect(parentNode, width, height, TASK_BORDER_RADIUS, 'none');

        svgAttr(rect, {
            x: -75,
            y: 0,
            transform: `translate(${transformX}, ${transformY})`,
            opacity: 0,
        });

        var text = svgCreate('text');

        svgAttr(text, {
            fill: color,
            transform: `translate(${transformX}, ${transformY})`,
            textAnchor: 'middle',
            dominantBaseline: 'middle',
            fontWeight: 500,
            x: width / 2 - 75,
            y: height / 2,
        });

        // svgClasses(text).add('djs-label');

        const actionId = label.actionId;

        if(actionId) {
            const translateKey = `Process.Details.Modeler.Actions.${capitalizeFirstLetter({ text: actionId, lowerCaseRest: false, delimiter: '.', join: '.' })}.Label`;
            
            const translatedLabel = translate(translateKey);

            svgAppend(text, document.createTextNode(label.title || translatedLabel || label.actionId));
    
            svgAppend(parentNode, text);
        }

    }

    drawShape(parentNode, element) {
        const shape = this.bpmnRenderer.drawShape(parentNode, element);
        const businessObject = getBusinessObject(element);
        const label = this.getLabel(element);

        const disabled = getBusinessObject(element).disabled;

        if (is(element, 'bpmn:Task')) {
            const rect = drawRect(parentNode, 100, 80, TASK_BORDER_RADIUS, disabled ? '#e0e0e0' : '#bbbbbb');

            // icon
            // prependTo(rect, parentNode)
            svgRemove(shape);
        }

        if (label && (label.title || label.actionId)) {
            if (is(element, 'bpmn:SubProcess')) {
                this.drawTextNode(label, parentNode, disabled ? '#b3b3b3' : '#000', 0, -30);
            } else {
                this.drawTextNode(label, parentNode, disabled ? '#b3b3b3' : '#000', 0, 90);
                if (label.description && label.description != '') {
                    this.drawTextNode(label.description, parentNode, disabled ? '#b3b3b3' : '#8d8d8d', 0, 105);
                }
            }
        }

        const implementation = this.getImplementation(element);
        if (implementation) {
            const color = this.getColor(100);

            const rect = drawRect(parentNode, 100, 20, TASK_BORDER_RADIUS, 'none');

            svgAttr(rect, {
                transform: 'translate(0, 85)',
            });

            var text = svgCreate('text');

            svgAttr(text, {
                fill: disabled ? '#b3b3b3' : '#000',
                transform: 'translate(3, 75)',
                fontSize: '10px',
            });

            // svgClasses(text).add('djs-label')

            svgAppend(text, document.createTextNode(getExtensionScriptLabel(implementation)));

            svgAppend(parentNode, text);
            // const seleniumCommand = this.getSelenium(element)
            // if (seleniumCommand) {
            //   this.drawSeleniumCommand(parentNode, seleniumCommand, disabled)
            // }
        }

        return shape;
    }

    drawSeleniumCommand(parentNode, seleniumCommand, disabled) {
        let commandText = svgCreate('text');
        svgAttr(commandText, {
            fill: disabled ? '#b3b3b3' : '#000',
            transform: 'translate(3, 45)',
            fontSize: '10px',
        });
        svgAppend(commandText, document.createTextNode('C:' + seleniumCommand.command));
        svgAppend(parentNode, commandText);

        let targetText = svgCreate('text');
        svgAttr(targetText, {
            fill: disabled ? '#b3b3b3' : '#000',
            transform: 'translate(3, 55)',
            fontSize: '10px',
        });
        svgAppend(
            targetText,
            document.createTextNode(
                'T:' +
                    truncate(seleniumCommand.target, {
                        omission: '...',
                        length: 20,
                    }),
            ),
        );
        svgAppend(parentNode, targetText);

        let valueText = svgCreate('text');
        svgAttr(valueText, {
            fill: disabled ? '#b3b3b3' : '#000',
            transform: 'translate(3, 65)',
            fontSize: '10px',
        });
        svgAppend(
            valueText,
            document.createTextNode(
                'V:' +
                    truncate(seleniumCommand.value ? seleniumCommand.value : '', {
                        omission: '...',
                        length: 20,
                    }),
            ),
        );
        svgAppend(parentNode, valueText);
    }

    getShapePath(shape) {
        if (is(shape, 'bpmn:Task')) {
            return getRoundRectPath(shape, TASK_BORDER_RADIUS);
        }

        return this.bpmnRenderer.getShapePath(shape);
    }

    getSuitabilityScore(element) {
        const businessObject = getBusinessObject(element);
        const { suitable } = businessObject;

        return Number.isFinite(suitable) ? suitable : null;
    }

    getImplementation(element) {
        const businessObject = getBusinessObject(element);
        let { implementation } = businessObject;
        if (businessObject.$type === 'bpmn:ManualTask') {
            if (businessObject.extensionElements) {
                const extensionElements = getBusinessObject(businessObject.extensionElements);
                const inputOutputs = extensionElements.values.filter((value) => value.$type == 'camunda:InputOutput');
                if (inputOutputs && inputOutputs.length > 0) {
                    const inputOutput = inputOutputs[0];
                    if (inputOutput && inputOutput.inputParameters) {
                        inputOutput.inputParameters.forEach((inputParameter) => {
                            if (inputParameter.name === 'component') {
                                implementation = '${environment.services.run()}';
                            }
                        });
                    }
                }
            }
        }
        return implementation;
    }

    getParam(parameters, param) {
        const values = parameters.filter((parameter) => parameter.name === param);

        if (values && values.length > 0) {
            return values[0].value;
        }

        return null;
    }

    getSelenium(element) {
        let seleniumCommand;
        const businessObject = getBusinessObject(element);
        if (businessObject.extensionElements) {
            const extensionElements = getBusinessObject(businessObject.extensionElements);
            const inputOutputs = extensionElements.values.filter((value) => value.$type == 'camunda:InputOutput');
            if (inputOutputs && inputOutputs.length > 0) {
                const inputOutput = inputOutputs[0];
                if (inputOutput && inputOutput.inputParameters) {
                    if (
                        inputOutput.inputParameters.some(
                            (inputParameter) =>
                                inputParameter.name === 'script' && inputParameter.value.startsWith('browser.selenium'),
                        )
                    ) {
                        return {
                            command: this.getParam(inputOutput.inputParameters, 'script').substring(
                                'browser.selenium.'.length,
                            ),
                            target: this.getParam(inputOutput.inputParameters, 'target'),
                            value: this.getParam(inputOutput.inputParameters, 'value'),
                        };
                    }
                }
            }
        }
        return null;
    }

    getLabel(element) {
        const businessObject = getBusinessObject(element);
        const actionId = businessObject?.actionId;
        let title;
        let description = undefined;
        //
        // if (businessObject.$type === 'bpmn:ManualTask') {
        //   if (businessObject.extensionElements) {
        //     const extensionElements = getBusinessObject(businessObject.extensionElements)
        //     const inputOutputs = extensionElements.values.filter(value => value.$type == 'camunda:InputOutput')
        //     if (inputOutputs && inputOutputs.length > 0) {
        //       const inputOutput = inputOutputs[0]
        //       if (inputOutput && inputOutput.inputParameters) {
        //         inputOutput.inputParameters.forEach(inputParameter => {
        //           if (inputParameter.name === 'component') {
        //             label = inputParameter.value
        //           }
        //         })
        //       }
        //     }
        //   }
        // } else {
        //   if (businessObject.extensionElements) {
        //     const extensionElements = getBusinessObject(businessObject.extensionElements)
        //     const inputOutputs = extensionElements.values.filter(value => value.$type == 'camunda:InputOutput')
        //     if (inputOutputs && inputOutputs.length > 0) {
        //       const inputOutput = inputOutputs[0]
        //       if (inputOutput && inputOutput.inputParameters) {
        //         inputOutput.inputParameters.forEach(inputParameter => {
        //           if (inputParameter.name === 'script') {
        //             label = inputParameter.value
        //           }
        //         })
        //       }
        //     }
        //   }
        // }
        const externalAction = store.getState().action.bpmnActions.byId[businessObject.actionId];
        const action = externalAction ? externalAction : internalBpmnActions[businessObject.actionId];

        const globalVariables = store.getState().globalVariable.globalVariables;
        if (action) {
            if (CustomActionDescription[businessObject.actionId]) {
                description = CustomActionDescription[businessObject.actionId](element, globalVariables);
            }
            return {
                title: businessObject.label,
                actionId: actionId,
                description: description,
            };
        } else {
            if (is(element, 'bpmn:Task')) {
                title = businessObject.name;
            }
        }
        return {
            title: title,
            actionId: actionId,
            description: description,
        };
    }

    getColor(suitabilityScore) {
        if (suitabilityScore > 75) {
            return COLOR_GREEN;
        } else if (suitabilityScore > 25) {
            return COLOR_YELLOW;
        }

        return COLOR_RED;
    }
}

CustomRenderer.$inject = ['eventBus', 'bpmnRenderer'];

// helpers //////////

// copied from https://github.com/bpmn-io/bpmn-js/blob/master/lib/draw/BpmnRenderer.js
function drawRect(parentNode, width, height, borderRadius, color) {
    const rect = svgCreate('rect');

    svgAttr(rect, {
        width: width,
        height: height,
        rx: borderRadius,
        ry: borderRadius,
        stroke: color,
        strokeWidth: 2,
        fill: color,
    });

    svgAppend(parentNode, rect);

    return rect;
}

function prependTo(newNode, parentNode, siblingNode) {
    parentNode.insertBefore(newNode, siblingNode || parentNode.firstChild);
}
