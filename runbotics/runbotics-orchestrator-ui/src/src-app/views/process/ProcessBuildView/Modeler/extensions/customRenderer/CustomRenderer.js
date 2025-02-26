// @ts-nocheck
/* eslint-disable */
import BaseRenderer from "diagram-js/lib/draw/BaseRenderer";

import {
    append as svgAppend,
    attr as svgAttr,
    classes as svgClasses,
    create as svgCreate,
    remove as svgRemove,
} from "tiny-svg";

import { getRoundRectPath } from "bpmn-js/lib/draw/BpmnRenderUtil";

import { is, getBusinessObject } from "bpmn-js/lib/util/ModelUtil";
import { CustomActionDescription } from "#src-app/utils/action";
import store from "../../../../../../store";
import internalBpmnActions from "../../../../../../Actions";
import { translate, checkIfKeyExists } from "#src-app/hooks/useTranslations";
import { capitalizeFirstLetter } from "#src-app/utils/text";
import { lightTheme } from "#src-app/theme/light";

const HIGH_PRIORITY = 1500,
    TASK_BORDER_RADIUS = 5,
    COLOR_RED = "#ff5e5e",
    COLOR_GREY = "#e0e0e0",
    COLOR_DEFAULT = "#bbbbbb",
    COLOR_BLACK = "#000000",
    COLOR_ORANGE_SECONDARY = lightTheme.palette.secondary.main

export default class CustomRenderer extends BaseRenderer {
    constructor(eventBus, bpmnRenderer) {
        super(eventBus, HIGH_PRIORITY);

        this.bpmnRenderer = bpmnRenderer;
    }

    canRender(element) {
        // ignore labels
        return !element.labelTarget;
    }

    drawTextNode(
        label,
        parentNode,
        businessObject,
        color = "#000",
        transformX = 0,
        transformY = 0,
        width = 240,
        height = 20,
    ) {
        const rect = drawRect(
            parentNode,
            width,
            height,
            TASK_BORDER_RADIUS,
            "none"
        );

        svgAttr(rect, {
            x: -75,
            y: 0,
            transform: `translate(${transformX}, ${transformY})`,
            opacity: 0,
        });

        var text = svgCreate("text");

        svgAttr(text, {
            fill: color,
            transform: `translate(${transformX}, ${transformY})`,
            textAnchor: "middle",
            dominantBaseline: "middle",
            fontWeight: 500,
            x: width / 2 - 75,
            y: height / 2,
        });

        var actionName = svgCreate("text");

        svgAttr(actionName, {
            fill: '#b3b3b3',
            transform: `translate(${transformX}, ${transformY})`,
            textAnchor: "middle",
            dominantBaseline: "middle",
            fontWeight: 500,
            x: width / 2 - 75,
            y: (height + 45) / 2,
        });

        const actionId = label.actionId;

        if (actionId) {
            const actionPartialTranslationKey = capitalizeFirstLetter({
                text: actionId,
                lowerCaseRest: false,
                delimiter: ".",
                join: ".",
            });
            const actionTranslationKey = `Process.Details.Modeler.Actions.${actionPartialTranslationKey}.Label`;

            const actionGroupKey = actionPartialTranslationKey.split('.')[ 0 ];
            const actionGroupTranslationKey = `Process.Details.Modeler.ActionsGroup.${actionGroupKey}`;

            const translatedLabel = checkIfKeyExists(actionGroupTranslationKey)
                ? `${translate(actionGroupTranslationKey)}: ${translate(actionTranslationKey)}`
                : translate(actionTranslationKey);

            svgAppend(
                text,
                document.createTextNode(
                    label.title || translatedLabel || label.actionId
                )
            );

            svgAppend(parentNode, text);

            if (label.title !== '' && !label.actionId.startsWith('external.')) {
                svgAppend(
                    actionName,
                    document.createTextNode(
                        translatedLabel || label.actionId
                    )
                )

                svgAppend(parentNode, actionName);
            }
        }

    }
    pickColor(businessObject) {
        const { disabled, validationError, processOutput } = businessObject;
        if (disabled) return COLOR_GREY;
        if (validationError) return COLOR_RED;
        if (processOutput) return COLOR_ORANGE_SECONDARY;
        return COLOR_DEFAULT;
    }
    pickStrokeColor(businessObject) {
        const { validationError } = businessObject;
        if (validationError) return COLOR_RED;
        return COLOR_BLACK;
    }

    drawShape(parentNode, element) {
        const shape = this.bpmnRenderer.drawShape(parentNode, element);
        const label = this.getLabel(element);
        const businessObject = getBusinessObject(element);
        const { disabled } = businessObject;

        if (is(element, "bpmn:Task")) {
            drawRect(
                parentNode,
                100,
                80,
                TASK_BORDER_RADIUS,
                this.pickColor(businessObject)
            );
            svgRemove(shape);
        }
        if (
            is(element, "bpmn:SubProcess") ||
            is(element, "bpmn:StartEvent") ||
            is(element, "bpmn:EndEvent") ||
            is(element, "bpmn:ExclusiveGateway")
        ) {
            svgAttr(shape, { stroke: this.pickStrokeColor(businessObject) });
        }

        if (label && (label.title || label.actionId)) {
            if (is(element, "bpmn:SubProcess")) {
                this.drawTextNode(
                    label,
                    parentNode,
                    businessObject,
                    disabled ? "#b3b3b3" : "#000",
                    0,
                    -30
                );
            } else {
                this.drawTextNode(
                    label,
                    parentNode,
                    businessObject,
                    disabled ? "#b3b3b3" : "#000",
                    0,
                    90
                );
                if (label.description && label.description != "") {
                    this.drawTextNode(
                        label.description,
                        parentNode,
                        businessObject,
                        disabled ? "#b3b3b3" : "#8d8d8d",
                        0,
                        105
                    );
                }
            }
        }

        const implementation = this.getImplementation(element);
        if (implementation) {
            const rect = drawRect(parentNode, 100, 20, TASK_BORDER_RADIUS, "none");

            svgAttr(rect, {
                transform: "translate(0, 85)",
            });

            var text = svgCreate("text");

            svgAttr(text, {
                fill: disabled ? "#b3b3b3" : "#000",
                transform: "translate(3, 75)",
                fontSize: "10px",
            });

            // svgClasses(text).add('djs-label')

            // svgAppend(
            //     text,
            //     document.createTextNode(getExtensionScriptLabel(implementation))
            // );
            svgAppend(parentNode, text);
        }

        return shape;
    }



    getShapePath(shape) {
        if (is(shape, "bpmn:Task")) {
            return getRoundRectPath(shape, TASK_BORDER_RADIUS);
        }

        return this.bpmnRenderer.getShapePath(shape);
    }

    getImplementation(element) {
        const businessObject = getBusinessObject(element);
        let { implementation } = businessObject;
        if (businessObject.$type === "bpmn:ManualTask") {
            if (businessObject.extensionElements) {
                const extensionElements = getBusinessObject(
                    businessObject.extensionElements
                );
                const inputOutputs = extensionElements.values.filter(
                    (value) => value.$type == "camunda:InputOutput"
                );
                if (inputOutputs && inputOutputs.length > 0) {
                    const inputOutput = inputOutputs[ 0 ];
                    if (inputOutput && inputOutput.inputParameters) {
                        inputOutput.inputParameters.forEach((inputParameter) => {
                            if (inputParameter.name === "component") {
                                implementation = "${environment.services.run()}";
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
            return values[ 0 ].value;
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
        const externalAction =
            store.getState().action.bpmnActions.byId[ businessObject.actionId ];
        const { pluginBpmnActions } = store.getState().plugin;
        const action = externalAction || internalBpmnActions[businessObject.actionId] || pluginBpmnActions[businessObject.actionId];

        const globalVariables = store.getState().globalVariable.globalVariables;
        if (action) {
            if (CustomActionDescription[ businessObject.actionId ]) {
                description = CustomActionDescription[ businessObject.actionId ](
                    element,
                    globalVariables
                );
            }
            return {
                title: businessObject.label,
                actionId,
                description: description,
            };
        } else {
            if (is(element, "bpmn:Task")) {
                title = businessObject.name;
            }
        }
        return {
            title: title,
            actionId,
            description: description,
        };
    }

    getColor(type) {
        if (type === "disabled") {
            return COLOR_GREY;
        } else if (type === "validationError") {
            return COLOR_RED;
        } else {
        }
    }
}

CustomRenderer.$inject = [ "eventBus", "bpmnRenderer" ];

// helpers //////////

// copied from https://github.com/bpmn-io/bpmn-js/blob/master/lib/draw/BpmnRenderer.js
function drawRect(parentNode, width, height, borderRadius, color) {
    const rect = svgCreate("rect");

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