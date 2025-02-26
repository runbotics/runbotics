/* eslint-disable max-lines-per-function */
import BpmnModeler from 'bpmn-js/lib/Modeler';

import internalBpmnActions from '#src-app/Actions';
import store from '#src-app/store';
import { ActionToBPMNElement } from '#src-app/views/process/ProcessBuildView/Modeler/ActionFormPanel/ActionToBPMNElement';
import { TaskType } from '#src-app/views/process/ProcessBuildView/Modeler/extensions/elementFactory/ElementFactory';
import { ParameterDestination } from '#src-app/views/process/ProcessBuildView/Modeler/extensions/palette/CustomPalette';
import {
    Direction,
    ElementType,
    MapRecord,
    ServiceTaskElement,
    TemplatesSchema,
    Position,
    CreateConnectionProps,
    CalculateOffsetProps
} from '#src-app/views/process/ProcessBuildView/Modeler/templates/Template.types';

function mapSchemaToElements(template: TemplatesSchema, modeler: BpmnModeler) {
    // mapOfRelations holds necessary information to create connections between elements (shapes)
    const mapOfRelations = new Map<string, MapRecord>();
    // arrayOfElements holds all elements (shapes) and connections that will be added to the diagram
    const arrOfShapesAndEdges = [];
    const keysToMap: Direction[] = [
        Direction.RIGHT,
        Direction.TOP,
        Direction.BOTTOM,
        Direction.LEFT
    ];
    const actionToBPMNElement = ActionToBPMNElement.from(modeler);
    const elementFactory = modeler.get('elementFactory');
    const bpmnFactory = modeler.get('bpmnFactory');

    // function responsible for creating elements (shapes) based on the template schema
    const createElement = (
        templateSchema: TemplatesSchema,
        position?: Position
    ) => {
        const { type, input, output, label } = templateSchema;
        const { x, y } = position;

        const { pluginBpmnActions } = store.getState().plugin;

        const action =
            internalBpmnActions[(templateSchema as ServiceTaskElement).bpmnAction] ||
            pluginBpmnActions[(templateSchema as ServiceTaskElement).bpmnAction];
        switch (type) {
            case ElementType.SERVICE_TASK:
                const serviceTaskElement = actionToBPMNElement.createElement(
                    TaskType.ServiceTask,
                    action,
                    {},
                    { x, y }
                );

                const inputParams =
                    input &&
                    actionToBPMNElement.formDataToParameters(
                        ParameterDestination.Input,
                        {
                            ...input,
                            script: (templateSchema as ServiceTaskElement)
                                .bpmnAction
                        }
                    );
                const outputParams =
                    output &&
                    actionToBPMNElement.formDataToParameters(
                        ParameterDestination.Output,
                        {
                            [output]: '${content.output[0]}'
                        }
                    );

                if (input) {
                    actionToBPMNElement.setInputParameters(
                        serviceTaskElement,
                        inputParams
                    );
                }
                if (output) {
                    actionToBPMNElement.setOutputParameters(
                        serviceTaskElement,
                        outputParams
                    );
                }

                return serviceTaskElement;
            case ElementType.GATEWAY:
                const gatewayElement = elementFactory.createShape({
                    type: 'bpmn:ExclusiveGateway',
                    businessObject: bpmnFactory.create('bpmn:ExclusiveGateway'),
                    y,
                    x
                });
                gatewayElement.businessObject.default = label;
                return gatewayElement;
            case ElementType.START_EVENT:
                return elementFactory.createShape({
                    type: 'bpmn:StartEvent',
                    businessObject: bpmnFactory.create('bpmn:StartEvent'),
                    x,
                    y
                });
            case ElementType.END_EVENT:
                return elementFactory.createShape({
                    type: 'bpmn:EndEvent',
                    businessObject: bpmnFactory.create('bpmn:EndEvent'),
                    x,
                    y
                });
            default:
                return null;
        }
    };

    const calculateOffset = ({
        element,
        direction,
        offsetValues,
        origin
    }: CalculateOffsetProps) => {
        const { type, shape } = element;
        let offset = 0;
        const directionOfSubtracking =
            direction === Direction.LEFT || direction === Direction.RIGHT
                ? 'width'
                : 'height';
        if (type === ElementType.GATEWAY) offset += offsetValues.gateway;
        if (
            type === ElementType.START_EVENT ||
            type === ElementType.END_EVENT
        ) {
            offset += offsetValues.event;
        }
        if (origin === 'target') {
            if (direction === Direction.LEFT || direction === Direction.TOP) {
                offset += shape[directionOfSubtracking];
            }
        } else if (
            direction === Direction.RIGHT ||
            direction === Direction.BOTTOM
        ) {
            offset += shape[directionOfSubtracking];
        }

        return offset;
    };

    // function responsible for centering connection points on the shapes
    const adjustSourceEdge = (element: MapRecord, direction: Direction) => {
        const { position } = element;
        const offset = calculateOffset({
            element,
            direction,
            offsetValues: { gateway: 20, event: 27 },
            origin: 'source'
        });

        switch (direction) {
            case Direction.LEFT:
            case Direction.RIGHT:
                return {
                    x: position.x + offset,
                    y: position.y + 40
                };
            case Direction.TOP:
            case Direction.BOTTOM:
                return {
                    x: position.x + 50,
                    y: position.y + offset
                };
            default:
                return {
                    x: position.x,
                    y: position.y
                };
        }
    };

    // function responsible for centering connection points on the shapes
    const adjustTargetEdge = (element: MapRecord, direction: Direction) => {
        const { position } = element;
        const offset = calculateOffset({
            element,
            direction,
            offsetValues: { gateway: 22, event: 29 },
            origin: 'target'
        });

        switch (direction) {
            case Direction.LEFT:
            case Direction.RIGHT:
                return {
                    x: position.x + offset,
                    y: position.y + 40
                };
            case Direction.TOP:
            case Direction.BOTTOM:
                return {
                    x: position.x + 50,
                    y: position.y + offset
                };
            default:
                return {
                    x: position.x,
                    y: position.y
                };
        }
    };

    // function responsible for aligning shapes depending on the type of the element
    const centerShape = (type: ElementType, position: Position) => {
        switch (type) {
            case ElementType.START_EVENT:
            case ElementType.END_EVENT:
                return {
                    x: position.x + 32,
                    y: position.y + 25
                };
            case ElementType.GATEWAY:
                return {
                    x: position.x + 25,
                    y: position.y + 15
                };
            case ElementType.SERVICE_TASK:
            default:
                return position;
        }
    };

    const calculateShapeWaypoints = (
        position: Position,
        direction: Direction
    ) => {
        const { x, y } = position;
        switch (direction) {
            case Direction.RIGHT:
                return { x: x + 200, y };
            case Direction.LEFT:
                return { x: x - 200, y };
            case Direction.TOP:
                return { x, y: y - 200 };
            case Direction.BOTTOM:
                return { x, y: y + 200 };
            default:
                return { x, y };
        }
    };

    // function responsible for creating all nessessary information and shapes
    // based on provided template and saving them to the mapOfRelations
    const saveElementToMap = (
        templateSchema: TemplatesSchema,
        parent?: string,
        direction?: Direction
    ) => {
        const { type, label } = templateSchema;
        if (type === ElementType.MERGE) return;

        const parentRecord = mapOfRelations.get(parent);
        const createChild = ([key, val]: [Direction, TemplatesSchema]) => {
            const edgeProps = {
                expression: val.expression ? val.expression : null,
                defaultEdge: val.default ? val.default : false
            };
            // eslint-disable-next-line @typescript-eslint/no-shadow
            const label =
                val.type === ElementType.MERGE ? val.mergeByLabel : val.label;
            return { label, direction: key, edgeProps };
        };
        const position = parent
            ? calculateShapeWaypoints(parentRecord.position, direction)
            : { x: 0, y: 0 };
        mapOfRelations.set(label, {
            type,
            position,
            label,
            shape: createElement(templateSchema, centerShape(type, position)),
            children: Object.entries(templateSchema)
                .filter(([key]) => keysToMap.includes(key as Direction))
                .map(createChild)
        });
    };

    const createConnection = ({
        sourceElement,
        targetElement,
        direction,
        edgeProps
    }: CreateConnectionProps) => {
        const { expression, defaultEdge } = edgeProps;

        const connection = elementFactory.createConnection({
            type: 'bpmn:SequenceFlow',
            source: sourceElement.shape,
            target: targetElement.shape,
            waypoints: [
                adjustSourceEdge(sourceElement, direction),
                adjustTargetEdge(targetElement, direction)
            ]
        });
        if (expression) {
            connection.businessObject.conditionExpression = modeler
                .get('bpmnFactory')
                .create('bpmn:FormalExpression', {
                    body: expression
                });
        }

        // we have to add reference to the connection to the source shape
        if (defaultEdge) {
            const { shape } = sourceElement;
            shape.businessObject.default = connection;
            // after altering shape we have to update it in mapOfRelations
            // before we can add it to the arrOfShapesAndEdges
            mapOfRelations.set(sourceElement.label, {
                ...sourceElement,
                shape
            });
        }
        return connection;
    };

    // saving first record to the map because function only adds records that are children of keysToMap
    saveElementToMap(template);
    recursivelyCreateMapElement(template, template.label);

    function recursivelyCreateMapElement(
        templateSchema: TemplatesSchema,
        parent?: string
    ): void {
        Object.entries(templateSchema)
            .filter(([key]) => keysToMap.includes(key as Direction))
            .forEach(([key, ele]: [Direction, TemplatesSchema]) => {
                saveElementToMap(ele, parent, key);
                recursivelyCreateMapElement(ele, ele.label);
            });
    }

    mapOfRelations.forEach(value => {
        value.children.forEach(child => {
            const sourceElement = value;
            const targetElement = mapOfRelations.get(child.label);
            const connection = createConnection({
                sourceElement,
                targetElement,
                direction: child.direction,
                edgeProps: child.edgeProps
            });
            arrOfShapesAndEdges.push(connection);
        });
        arrOfShapesAndEdges.unshift(value.shape);
    });

    return arrOfShapesAndEdges;
}

export default mapSchemaToElements;
